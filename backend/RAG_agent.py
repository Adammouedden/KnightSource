from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

from computer_use.main import gemini_computer_use

load_dotenv()
api_key = os.getenv("GOOGLE_CLOUD_API")


class RAG_Agent:
    def __init__(self):
        self.client = genai.Client(vertexai=True, api_key=api_key)

        # --- Tool: Retrieval (Vertex RAG Store) ---
        self.retrieval_tool = types.Tool(
            retrieval=types.Retrieval(
                vertex_rag_store=types.VertexRagStore(
                    rag_resources=[
                        types.VertexRagStoreRagResource(
                            rag_corpus="projects/gen-lang-client-0773414929/locations/us-east4/ragCorpora/4611686018427387904"
                        )
                    ]
                )
            )
        )

        # --- Tool: Function declaration for Computer Use ---
        self.browser_fn_tool = types.Tool(
            function_declarations=[
                types.FunctionDeclaration(
                    name="start_browser",
                    description=(
                        "Open a real browser to investigate dynamic or fresh information, "
                        "click through pages, or complete tasks that require on-screen actions."
                        "Fill out forms, sign up for events, or automate any UI based completion tasks."
                    ),
                    parameters=types.Schema(
                        type=types.Type.OBJECT,
                        properties={
                            "query": types.Schema(
                                type=types.Type.STRING,
                                description="What you want to accomplish in the browser."
                            ),
                            "initial_url": types.Schema(
                                type=types.Type.STRING,
                                description="Optional starting URL.",
                            ),
                        },
                        required=["query"],
                    ),
                )
            ]
        )

        # Shared generation config
        self.gen_config = types.GenerateContentConfig(
            system_instruction="You are a smart financial advisor with the ability to fill out forms for users to apply for different resources. You have RAG capabilities along with the ability to use Gemini-Computer-Use, and interact with UI. Do not be afraid to scroll and search for your target, accuracy matters most. " \
            "User information: first name: Adam, last name: Mouedden, full name: Adam Mouedden, email: adam.mouedden@gmail.com, phone number: 123-456-7890, discord: adammouedden",
            temperature=1,
            top_p=0.95,
            seed=0,
            max_output_tokens=2000,
            safety_settings=[
                types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
                types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF"),
            ],
            tools=[self.retrieval_tool, self.browser_fn_tool],
            thinking_config=types.ThinkingConfig(thinking_budget=-1),
        )

    def generate(self, prompt: str) -> str:
        model = "gemini-2.5-flash"

        contents = [
            types.Content(
                role="user",
                parts=[{"text": prompt}]
            )
        ]

        # Single-shot first (you can also do streaming; see note below)
        resp = self.client.models.generate_content(
            model=model,
            contents=contents,
            config=self.gen_config,
        )

        # If the model asks to call a tool, handle it:
        # (Function calls appear in parts as {"functionCall": {...}})
        out = []
        for cand in (resp.candidates or []):
            for part in (cand.content.parts or []):
                # 1) Handle function calls
                if getattr(part, "function_call", None):
                    fn = part.function_call
                    if fn.name == "start_browser":
                        args = fn.args or {}
                        q = args.get("query", prompt)
                        initial_url = args.get("initial_url", "http://www.google.com")
                        # Run your Playwright loop ONLY when requested
                        gemini_computer_use(query=q, initial_url=initial_url)
                        # Optionally append a short note to the final text
                        out.append("[Opened browser to investigate and complete the task.]")
                    # If you add more functions later, handle them here.
                # 2) Collect normal text
                if getattr(part, "text", None):
                    out.append(part.text)

        return " ".join(out).strip()


if __name__ == "__main__":
    agent = RAG_Agent()
    user_input = input("You: ")
    print(f"RAG Bot: {agent.generate(user_input)}")
