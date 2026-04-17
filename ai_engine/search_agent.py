import os
import sys
import json
from pymongo import MongoClient
from google import genai
from dotenv import load_dotenv

load_dotenv()


client_ai = genai.Client(api_key=os.getenv("GEMINI_KEY"))
client_db = MongoClient(os.getenv("MONGO_URI"))

db = client_db["code_agent"]
collection = db["embeddings"]

def search_and_answer(query, repo_id):
   
    query_vector = client_ai.models.embed_content(
        model="models/gemini-embedding-2-preview",
        contents=query,
        config={"task_type": "retrieval_query"}
    ).embeddings[0].values

   
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index", 
                "path": "embedding",
                "queryVector": query_vector,
                "numCandidates": 500,
                "limit": 10, 
            }
        },
        {
            "$project": {
                "_id": 0,
                "name": 1,
                "code": 1,
                "file_path": 1,
                "score": {"$meta": "vectorSearchScore"}
            }
        }
    ]
    
    results = list(collection.aggregate(pipeline))
    
    if not results:
        return "No relevant code found in the repository."

    
    context_text = "\n\n".join([f"--- File: {r['file_path']} | Function: {r['name']} ---\n{r['code']}" for r in results])
    print(f"--- DEBUG: Found {len(results)} results in Vector Search ---")
    for r in results:
        print(f"-> Matching Function: {r['name']} (Score: {r['score']})")
    prompt = f"""
    You are a Senior Open Source Contributor Agent. 
    Use the following code snippets from the repository to answer the user's question accurately.
    If the answer isn't in the code, say you don't know.

    CONTEXT FROM REPOSITORY:
    {context_text}

    USER QUESTION:
    {query}

    FINAL ANSWER:
    """

    
    response = client_ai.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    return response.text

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_query = sys.argv[1]
                   
        r_id = sys.argv[2] if len(sys.argv) > 2 else ""
        answer = search_and_answer(user_query, r_id)
        print(answer)