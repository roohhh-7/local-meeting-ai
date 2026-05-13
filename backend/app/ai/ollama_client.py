import httpx
from app.core.config import settings
import json
from typing import AsyncGenerator

class OllamaClient:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL

    async def chat(self, model: str, messages: list, stream: bool = False):
        url = f"{self.base_url}/api/chat"
        payload = {
            "model": model,
            "messages": messages,
            "stream": stream
        }
        
        if stream:
            return self._stream_chat(url, payload)
        
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.post(url, json=payload)
            return response.json()

    async def _stream_chat(self, url: str, payload: dict) -> AsyncGenerator:
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", url, json=payload) as response:
                async for line in response.aiter_lines():
                    if line:
                        yield json.loads(line)

    async def generate_summary(self, transcript: str) -> str:
        prompt = f"""
        Summarize the following meeting transcript. 
        Extract key discussion points, decisions made, and action items.
        
        Transcript:
        {transcript}
        
        Format the output as JSON with the following keys:
        - summary: A brief paragraph summarizing the meeting.
        - key_points: A list of main topics discussed.
        - action_items: A list of tasks with owner and deadline if mentioned.
        """
        
        messages = [{"role": "user", "content": prompt}]
        response = await self.chat("llama3.2", messages)
        return response.get("message", {}).get("content", "")

ollama_client = OllamaClient()
