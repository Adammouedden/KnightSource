from fastapi import FastAPI
import uvicorn
from base_agent import Agent
from RAG_agent import RAG_Agent

app = FastAPI()
agent = Agent()
retrieval_agent = RAG_Agent()

@app.get("/chat")
async def chat(prompt):
    return agent.chat(prompt)

@app.get("/RAG")
async def RAG(prompt):
    return retrieval_agent.generate(prompt)
    
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000)