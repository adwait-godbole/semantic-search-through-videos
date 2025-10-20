from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import chromadb
from sentence_transformers import SentenceTransformer

app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173",
    "http://127.0.0.1:5173",
    "127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

model = SentenceTransformer('all-MiniLM-L6-v2')
client = chromadb.PersistentClient(path="D:\FY Project\database")

@app.get("/search/{query}")
async def root(query: str) -> dict:
    clip_summaries_collection = client.get_collection(name="clip_summaries")
    data = clip_summaries_collection.query(
      query_embeddings=[model.encode(query).tolist()],
      n_results=5,
    )
    return data