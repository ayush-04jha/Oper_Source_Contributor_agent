import os
import sys
import json
from pymongo import MongoClient
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Setup Clients
client_ai = genai.Client(api_key=os.getenv("GEMINI_KEY"))
client_db = MongoClient(os.getenv("MONGO_URI"))

db = client_db["code_agent"]
collection = db["embeddings"]
# for m in client_ai.models.list():
#     print(m.name)
def search_and_answer(query, repo_id):
    # STEP 1: Turn Question into a Vector
    query_vector = client_ai.models.embed_content(
        model="models/gemini-embedding-2-preview",
        contents=query,
        config={"task_type": "retrieval_query"}
    ).embeddings[0].values

    # STEP 2: Vector Search in MongoDB
    # This uses the 'vector' index we created in the Atlas UI
    pipeline = [
        {
            "$vectorSearch": {
                "index": "vector_index", # Must match the name in Atlas
                "path": "embedding",
                "queryVector": query_vector,
                "numCandidates": 500,
                "limit": 10, # Top 3 most relevant functions
                # "filter": { "repo_id": repo_id }
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

    # STEP 3: Construct the "Context" for the LLM
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

    # STEP 4: Generate the Final Answer
    response = client_ai.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    return response.text

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_query = sys.argv[1]
        # For now, we use the Repo ID from your last run
        r_id = sys.argv[2] if len(sys.argv) > 2 else ""
        answer = search_and_answer(user_query, r_id)
        print(answer)