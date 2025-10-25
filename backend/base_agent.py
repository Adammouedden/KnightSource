from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()

class Agent:
    def __init__(self):
        self.memory = []
        
        key = os.getenv("GEMINI_API")
        self.client = genai.Client(api_key=key)
        self.system_prompt = "You are an agent. Never respond in key-value pairs, only ever in text."

    def chat(self, prompt):
        self.memory.append({"User":prompt})
        self.input = str(self.memory).replace("[", "").replace("]", "")
        #print(self.input)
        
        config = types.GenerateContentConfig(system_instruction=self.system_prompt)
        response = self.client.models.generate_content(model='gemini-2.5-flash', contents=self.input, config=config,)
        self.memory.append({"Agent":response.text})
        
        return response.text
    

if __name__=="__main__":
    obj = Agent()
    print(obj.chat("Hello, world"))
        
