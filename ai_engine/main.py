from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from search_agent import search_and_answer
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # production me specific URL dalna
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Querry(BaseModel):
    querry: str
    
    
@app.post("/chat")
def chat(data:Querry):
   answer =  search_and_answer(data.querry)
   return {"answer":answer}