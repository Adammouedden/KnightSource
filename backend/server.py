from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
import uvicorn
from base_agent import Agent
from RAG_agent import RAG_Agent
from auth import signin

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

agent = Agent()
retrieval_agent = RAG_Agent()

@app.get("/chat")
async def chat(prompt):
    return agent.chat(prompt)

@app.get("/RAG")
async def RAG(prompt):
    return retrieval_agent.generate(prompt)

@app.post("/api/auth/signin")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    return await signin(form_data)
    
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000)