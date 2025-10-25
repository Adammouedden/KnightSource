from google import genai
from google.genai import types
import base64
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GOOGLE_CLOUD_API")

class RAG_Agent():
    def __init__(self):
        self.client = genai.Client(vertexai=True,api_key=api_key)

    def generate(self, prompt: str):

        model = "gemini-2.5-flash"
        contents = [
            types.Content(
            role="user",
            parts=[{"text": f"{prompt}"}])
        ]
        tools = [
            types.Tool(
            retrieval=types.Retrieval(
                vertex_rag_store=types.VertexRagStore(
                rag_resources=[
                    types.VertexRagStoreRagResource(
                    rag_corpus="projects/gen-lang-client-0773414929/locations/us-east4/ragCorpora/4611686018427387904"
                    )
                ],
                )
            )
            )
        ]

        generate_content_config = types.GenerateContentConfig(
            temperature = 1,
            top_p = 0.95,
            seed = 0,
            max_output_tokens = 65535,
            safety_settings = [types.SafetySetting(
            category="HARM_CATEGORY_HATE_SPEECH",
            threshold="OFF"
            ),types.SafetySetting(
            category="HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold="OFF"
            ),types.SafetySetting(
            category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold="OFF"
            ),types.SafetySetting(
            category="HARM_CATEGORY_HARASSMENT",
            threshold="OFF"
            )],
            tools = tools,
            thinking_config=types.ThinkingConfig(
            thinking_budget=-1,
            ),
        )

        response = self.client.models.generate_content_stream(model = model,contents = contents,config = generate_content_config)
        return response.text

if __name__ == "__main__":
    agent = RAG_Agent()
    user_input = input("You: ")
    print(f"RAG Bot: {agent.generate(user_input)}")