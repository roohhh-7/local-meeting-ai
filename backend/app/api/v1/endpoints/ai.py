from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.ai.ollama_client import ollama_client
from app.ai.vector_store import vector_store
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    meeting_id: Optional[str] = None

class SearchRequest(BaseModel):
    query: str
    limit: int = 5

@router.post("/chat")
async def chat(request: ChatRequest):
    # 1. RAG: Search for relevant context
    filter = None
    if request.meeting_id:
        filter = {"meeting_id": request.meeting_id}
        
    results = vector_store.search(request.query, n_results=5, filter=filter)
    context = "\n".join(results.get("documents", [[]])[0])
    
    # 2. Generate response with Ollama
    prompt = f"""
    Answer the following question based ONLY on the provided meeting context.
    If the answer is not in the context, say you don't know.
    
    Context:
    {context}
    
    Question: {request.query}
    """
    
    messages = [{"role": "user", "content": prompt}]
    response = await ollama_client.chat("llama3.2", messages)
    
    return {
        "answer": response.get("message", {}).get("content", ""),
        "sources": results.get("metadatas", [[]])[0]
    }

@router.post("/search")
async def search(request: SearchRequest):
    results = vector_store.search(request.query, n_results=request.limit)
    return {
        "results": [
            {
                "text": doc,
                "metadata": meta,
                "distance": dist
            }
            for doc, meta, dist in zip(
                results["documents"][0], 
                results["metadatas"][0], 
                results["distances"][0]
            )
        ]
    }
