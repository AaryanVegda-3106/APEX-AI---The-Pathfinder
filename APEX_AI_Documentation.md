# APEX AI - The Pathfinder 

## Overview
**APEX (AI Powered Masters Program Explorer)** is an intelligent, modern educational consultant AI. Its primary role is to assist students in discovering suitable Master's programs tailored to their specific **Domain of Interest**, **Preferred Countries**, and **Tuition Fee Budget** (along with career goals). It acts as an interactive assistant, dynamically extracting user preferences through conversation, generating curated program lists, building domain-specific learning roadmaps, and offering inspiring final summaries.

---

## How It Works (The Flow)
1. **User Entry**: The application launches (via `start.bat`) with a sophisticated animated UI. It begins with a loading screen (`Loading.jsx`) and transitions into a 3D globe landing page (`Landing.jsx`) to create a "wow" factor.
2. **Conversation & Extraction**:
   - The user enters the `ChatInterface.jsx` and begins interacting with the AI.
   - User messages are sent to the backend `/api/chat` endpoint.
   - The LLM orchestrator intercepts the conversation history and the new message to formulate a conversational reply while simultaneously extracting structured data (Domain, Country, Budget) in JSON format.
   - If information is missing, the AI gently prompts the user for it.
3. **Data Generation**:
   - Once all three key preferences are extracted, the system executes sequential workflows to provide deep insights:
     - **Top Programs**: Calls `/api/top-programs` to generate the top 5 highly relevant Master's programs based on Reputation, Research, Industry Exposure, and Employability, formatted in beautiful Markdown.
     - **Roadmap**: Calls `/api/generate-roadmap` to generate a structured learning roadmap (Foundations, Tools, Projects, etc.) tailored specifically to the chosen domain.
     - **Summary**: Calls `/api/summary` to generate a cohesive, inspiring final summary based on the generated programs and roadmap.
4. **Display**: The frontend elegantly displays these markdown-formatted responses using `react-markdown` and `remark-gfm`, offering an optimal user experience.

---

## Technical Stack
### Backend
* **Framework**: FastAPI (for building high-performance, asynchronous REST APIs).
* **Server**: Uvicorn (ASGI web server implementation).
* **Data Validation**: Pydantic (defines schemas for strictly-typed API requests and responses).
* **AI & Orchestration**: 
  * **LangChain**: Used for prompt engineering, chaining components, and output parsing.
  * **Google Gemini (genai)**: The core LLM powering the AI (`gemini-2.5-flash`), accessed via `langchain-google-genai`.
* **Environment**: `python-dotenv` for managing sensitive API keys.

### Frontend
* **Framework**: React 19 / Vite.
* **Styling**: Tailwind CSS v4, custom CSS (`index.css`, `App.css`) for advanced metallic text, gradients, and glassmorphism UI elements.
* **Icons & Typography**: `lucide-react`.
* **3D & Visuals**: `react-globe.gl` and `three.js` for an interactive, immersive landing experience.
* **Markdown Rendering**: `react-markdown` and `remark-gfm` to perfectly render the structured LLM responses.

---

## Core Concepts Used
1. **Prompt Engineering & Structured Output (JSON)**: The AI is instructed to return conversational text and simultaneously output a structured JSON schema. This handles the extraction of `Domain`, `Country`, and `Budget` seamlessly.
2. **Chained LLM Operations (LangChain)**: Complex workflows (like generating top programs and then refining them) are divided into specific chains using LangChain Expression Language (LCEL) pipelines (`prompt | llm | output_parser`).
3. **State Management**: The frontend handles application state transitions (`loading` -> `landing` -> `home`) and dynamic extraction state without needing Redux, using React hooks.
4. **Retrieval/Agentic Simulation**: Although it relies purely on the LLM's internal parametric knowledge to act as a consultant (without external RAG currently), it simulates an agentic workflow by extracting data, recognizing when it has enough context, and sequentially triggering various specialized endpoints.

---

## The AI Chains (Workflow)
All LangChain workflows reside in `backend/chains/workflow.py` and utilize prompts from `backend/prompts/templates.py`.

1. **Chat Extraction Chain (`extract_chat_info`)**:
   - **Template**: `chat_extraction_template`
   - **Action**: Ingests conversation history and the latest user message.
   - **Output**: Generates a conversational reply and extracts the user's intent as JSON (Domain, Country, Budget).
2. **Top Programs Chain (`generate_top_programs`)**:
   - **Generation Step**: Uses `top_programs_template` to generate 5 program recommendations based on the extracted domain, country, and budget.
   - **Refinement Step**: Takes the raw generated text and pipes it through an `output_refinement_template` to ensure the Markdown is perfectly structured with rich formatting (headers, bolding, bullet points).
3. **Roadmap Generator Chain (`generate_roadmap`)**:
   - **Template**: `roadmap_template`
   - **Action**: Constructs a detailed domain roadmap categorized strictly into Foundations, Core Concepts, Tools, Advanced Topics, Projects, Research, and Career Prep.
4. **Summary Chain (`generate_summary`)**:
   - **Template**: `summary_template`
   - **Action**: Takes the output of the Top Programs and the Roadmap, synthesizing them into a final motivational overview for the student.

---

## File Structure

```text
APEX AI - The Pathfinder
├── start.bat                     # Convenience script to spin up both Backend and Frontend simultaneously
├── .gitignore
├── LICENSE
├── backend/
│   ├── main.py                   # FastAPI application initialization, CORS setup, and route registration
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables (e.g., GOOGLE_API_KEY)
│   ├── chains/
│   │   └── workflow.py           # Core LangChain implementation linking prompts, LLMs, and parsers
│   ├── models/
│   │   └── schemas.py            # Pydantic models for structured request/response validation
│   ├── prompts/
│   │   └── templates.py          # System instructions and prompt templates for all AI tasks
│   ├── routes/
│   │   └── api.py                # FastAPI endpoints (/chat, /top-programs, /generate-roadmap, /summary)
│   └── services/
│       └── llm_service.py        # Initializes and returns the Gemini ChatGoogleGenerativeAI instance
└── frontend/
    ├── package.json              # Node.js dependencies and scripts
    ├── eslint.config.js
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx               # Main React component, handles high-level state & routing (loading/landing/home)
        ├── main.jsx              # React entry point
        ├── App.css               # Global App styles
        ├── index.css             # Tailwind CSS entry and custom root variables/animations
        ├── api/                  # Axios instances and API call functions
        ├── assets/               # Static assets (images, icons)
        └── components/
            ├── ChatInterface.jsx # Main chat UI logic, message rendering, and API interaction
            ├── Landing.jsx       # 3D interactive landing page using react-globe.gl
            └── Loading.jsx       # Initial loader page animation
```
