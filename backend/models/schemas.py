from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    step: Optional[int] = None
    extracted_domain: Optional[str] = None
    extracted_country: Optional[str] = None

class ProgramInfo(BaseModel):
    name: str
    university: str
    location: str
    country: str
    duration: str
    fee: str
    subjects: str
    career_outcomes: str

class TopProgramsRequest(BaseModel):
    domain: str
    countries: str
    programs: List[ProgramInfo] = []

class GenerateRoadmapRequest(BaseModel):
    domain: str
    top_programs: List[ProgramInfo] = []
