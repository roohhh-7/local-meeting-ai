import chromadb
from chromadb.utils import embedding_functions
from app.core.config import settings
import uuid

class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self.collection = self.client.get_or_create_collection(
            name="meetings",
            embedding_function=self.embedding_fn
        )

    def add_chunks(self, meeting_id: str, chunks: list, metadata: list):
        ids = [str(uuid.uuid4()) for _ in chunks]
        # Add meeting_id to each metadata dict
        for m in metadata:
            m["meeting_id"] = meeting_id
            
        self.collection.add(
            documents=chunks,
            metadatas=metadata,
            ids=ids
        )

    def search(self, query: str, n_results: int = 5, filter: dict = None):
        return self.collection.query(
            query_texts=[query],
            n_results=n_results,
            where=filter
        )

vector_store = VectorStore()
