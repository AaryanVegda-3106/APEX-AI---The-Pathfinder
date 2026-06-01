from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from models.schemas import ChatRequest, ChatResponse
from chains.workflow import (
    extract_chat_info,
    generate_top_programs,
    generate_roadmap,
    generate_summary
)

router = APIRouter()

# In-memory store for session histories
# session_id -> list of "User: ..." / "APEX: ..."
sessions: Dict[str, List[str]] = {}

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    session_id = req.session_id
    if session_id not in sessions:
        sessions[session_id] = []
    
    history_str = "\n".join(sessions[session_id])
    
    try:
        extraction = extract_chat_info(history_str, req.message)
        
        # Update history
        sessions[session_id].append(f"User: {req.message}")
        sessions[session_id].append(f"APEX: {extraction['response']}")
        
        return ChatResponse(
            response=extraction["response"],
            extracted_domain=extraction.get("extracted_domain"),
            extracted_country=extraction.get("extracted_country"),
            extracted_budget=extraction.get("extracted_budget")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class TopProgramsReq(BaseModel):
    domain: str
    countries: str
    budget: Optional[str] = "Any"

@router.post("/top-programs")
async def top_programs_endpoint(req: TopProgramsReq):
    try:
        programs_text = generate_top_programs(req.domain, req.countries, req.budget)
        return {"text": programs_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class RoadmapReq(BaseModel):
    domain: str

@router.post("/generate-roadmap")
async def roadmap_endpoint(req: RoadmapReq):
    try:
        roadmap_text = generate_roadmap(req.domain)
        return {"text": roadmap_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SummaryReq(BaseModel):
    domain: str
    programs_text: str
    roadmap_text: str

@router.post("/summary")
async def summary_endpoint(req: SummaryReq):
    try:
        summary_text = generate_summary(req.domain, req.programs_text, req.roadmap_text)
        return {"text": summary_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
