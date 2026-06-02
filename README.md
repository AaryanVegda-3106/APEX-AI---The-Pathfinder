# APEX AI - The Pathfinder 🚀

![APEX AI Banner](https://img.shields.io/badge/APEX-AI_Pathfinder-00d4ff?style=for-the-badge&logo=openai&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![LangChain](https://img.shields.io/badge/LangChain-121212?style=for-the-badge&logo=chainlink&logoColor=white)

**APEX (AI Powered Masters Program Explorer)** is an intelligent, modern educational consultant AI. It helps students discover suitable Master's programs tailored to their specific **Domain of Interest**, **Preferred Countries**, and **Tuition Fee Budget**.

---

## ✨ Features

- 🌍 **Interactive 3D UI**: An immersive globe-based landing page providing a stunning modern user experience.
- 🤖 **Conversational AI Assistant**: Chat with APEX to naturally provide your preferences. The AI extracts structured context directly from the conversation.
- 🎓 **Top 5 Program Recommendations**: Get curated, highly relevant Master's programs tailored to your budget and preferred locations.
- 🗺️ **Domain-Specific Roadmaps**: Generate structured learning roadmaps (Foundations, Tools, Projects, etc.) tailored to your chosen domain.
- 📝 **Motivational Summary**: Receive a cohesive, inspiring final summary synthesizing your roadmap and chosen programs.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 / Vite
- **Styling**: Tailwind CSS v4, custom glassmorphism, and metallic CSS styles
- **3D & Visuals**: `react-globe.gl`, `three.js`
- **Markdown rendering**: `react-markdown`, `remark-gfm`
- **Icons**: `lucide-react`

### Backend
- **Framework**: FastAPI, Uvicorn
- **AI & Orchestration**: LangChain, Google Gemini (`gemini-2.5-flash`), `langchain-google-genai`
- **Data Validation**: Pydantic

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.10+
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/apex-ai.git
   cd apex-ai
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   python -m venv venv
   # On Windows: venv\Scripts\activate
   # On Mac/Linux: source venv/bin/activate
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `backend` directory and add your Google API key:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

You can easily spin up both servers at once using the provided script (Windows):
```bash
# In the root directory
start.bat
```

Alternatively, you can run them manually:
- **Backend:** `cd backend && python main.py` (Runs on `http://localhost:8000`)
- **Frontend:** `cd frontend && npm run dev` (Runs on `http://localhost:5173`)

---

## 🧠 How It Works

1. **Extraction**: You interact with the chat interface. LangChain processes the conversation history and uses Gemini to extract your **Domain**, **Country**, and **Budget** into a structured JSON format.
2. **Orchestration**: Once all necessary data is gathered, the frontend hits multiple AI endpoints simultaneously:
   - `/api/top-programs`
   - `/api/generate-roadmap`
   - `/api/summary`
3. **Refinement**: The outputs are passed through LangChain refinement chains to ensure the output is structured perfectly in Markdown before sending it back to the client.

---

## 📂 Repository Structure

```text
├── backend/                  # FastAPI Application
│   ├── chains/               # LangChain prompt pipelines
│   ├── models/               # Pydantic validation schemas
│   ├── prompts/              # System instruction templates
│   ├── routes/               # API endpoints
│   ├── services/             # LLM configurations
│   └── main.py               # Application entry point
├── frontend/                 # React / Vite Application
│   ├── src/
│   │   ├── components/       # ChatInterface, Landing (3D globe), Loading
│   │   ├── api/              # Axios configurations
│   │   └── App.jsx           # Main routing and state logic
│   └── package.json
└── start.bat                 # 1-click startup script (Windows)
```

---

## 📄 License
This project is licensed under the terms of the license provided in the `LICENSE` file.
