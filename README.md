# Meetpilot 

**The Privacy-First AI Meeting Intelligence Platform.**

Meetpilot is a high-performance, 100% local AI assistant designed to turn your meetings into actionable intelligence without ever letting your data leave your hardware. No bots, no cloud APIs, and zero privacy leaks.


##  Features

- ** 100% Local Intelligence:** All processing happens on your machine using Whisper.cpp and Llama 3.2 via Ollama.
- ** Smart Transcription:** Industry-leading accuracy for meeting recordings in 100+ languages.
- ** AI Summarization:** Instant key points, decisions, and action items generated automatically.
- ** RAG-Powered Chat:** Chat with your entire meeting history to find insights from months ago.
- ** High-Performance UI:** A premium, builder-focused obsidian dashboard with high-contrast dark mode.
- ** Easy Export:** One-click exports for summaries and transcripts to your favorite tools.

##  Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | FastAPI (Python), SQLAlchemy |
| **AI/ML** | Ollama (Llama 3.2), Whisper.cpp |
| **Database** | PostgreSQL |
| **Cache/Queue** | Redis, Celery |
| **Infrastructure** | Docker, Docker Compose |

##  Quick Start

### Prerequisites
- **Docker & Docker Compose** installed.
- **Ollama** running locally on your machine (`http://localhost:11434`).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/roohhh-7/local-meeting-ai.git
   cd local-meeting-ai
   ```

2. **Configure Environment**
   - Create `.env` files in both `backend/` and `frontend/` (see `.env.example` in each directory).

3. **Spin up with Docker**
   ```bash
   docker-compose up --build
   ```

4. **Access the App**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`

##  Privacy Mission

In an era of cloud-everything, Meetpilot stands for **Digital Sovereignty**. We believe your private conversations should stay private. By leveraging local LLMs and local transcription models, Meetpilot provides the power of modern AI with the security of an air-gapped environment.

##  Roadmap

- [ ] Real-time live transcription (browser-based).
- [ ] Integration with Notion, Obsidian, and Slack.
- [ ] Multi-speaker diarization improvements.
- [ ] Mobile-responsive dashboard optimization.

---

Built with ❤️ for the privacy-conscious builder. 
© 2026 Meetpilot AI. Proudly Open Source.
