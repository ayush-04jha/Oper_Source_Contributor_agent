from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["code_agent"]
collection = db["embeddings"]

sample = collection.find_one({"repo_id": "0f17e98b-bb30-4b97-93f0-f9db1a548fe7"})

if sample and "embedding" in sample:
    dims = len(sample["embedding"])
    print(f"✅ Data in DB has {dims} dimensions.")
    print(f"✅ Field name is: 'embedding'")
else:
    print("❌ No data found for this Repo ID.")