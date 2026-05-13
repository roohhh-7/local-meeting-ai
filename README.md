# Antigravity AI: Local Meeting Intelligence Platform

A production-grade AI Meeting Intelligence Platform built with 100% local AI models.

## Features

- **Local Transcription**: Uses Whisper.cpp for high-accuracy speech-to-text.
- **AI Summarization**: Generates summaries, action items, and key points using Ollama (Llama 3).
- **RAG Chat**: Chat with your meeting history using retrieval-augmented generation.
- **Semantic Search**: Find meetings based on meaning, not just keywords.
- **Modern Dashboard**: Premium SaaS interface built with Next.js 15 and Framer Motion.

## Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Shadcn UI, Zustand, Framer Motion.
- **Backend**: FastAPI, PostgreSQL, Redis, Celery.
- **AI**: Ollama, Whisper.cpp, ChromaDB, Sentence-Transformers.

## Prerequisites

1. **Ollama**: Install from [ollama.com](https://ollama.com/)
   - Pull the model: `ollama pull llama3`
2. **Docker**: (Optional but recommended)
3. **Whisper.cpp**: (For transcription)

## Getting Started

### Method 1: Using Docker (Recommended)

```bash
docker-compose up --build
```

### Method 2: Manual Setup

#### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `uvicorn main:app --reload`

#### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Configuration

Edit the `.env` files in `backend/` and `frontend/` to match your local setup.

## AI Setup

The system relies on a local Ollama instance running at `http://localhost:11434`. Ensure it is active before processing meetings or chatting.
