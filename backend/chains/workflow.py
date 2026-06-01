import json
from langchain_core.output_parsers import StrOutputParser
from services.llm_service import get_llm
from prompts.templates import (
    chat_extraction_template,
    top_programs_template,
    output_refinement_template,
    roadmap_template,
    summary_template
)

def clean_markdown(text: str) -> str:
    text = text.strip()
    if text.startswith("```markdown"):
        text = text[len("```markdown"):].strip()
    elif text.startswith("```"):
        text = text[3:].strip()
    if text.endswith("```"):
        text = text[:-3].strip()
    return text

def extract_chat_info(history: str, message: str):
    llm = get_llm()
    chain = chat_extraction_template | llm | StrOutputParser()
    result = chain.invoke({"history": history, "message": message})
    try:
        # LLM might wrap JSON in markdown like ```json ... ```
        if "```json" in result:
            result = result.split("```json")[1].split("```")[0].strip()
        elif "```" in result:
            result = result.split("```")[1].strip()
        data = json.loads(result)
        return data
    except Exception as e:
        # Fallback if parsing fails
        return {
            "response": clean_markdown(result),
            "extracted_domain": None,
            "extracted_country": None,
            "extracted_budget": "Any"
        }

def generate_top_programs(domain: str, countries: str, budget: str = "Any"):
    llm = get_llm()
    
    # Generate initial raw text
    gen_chain = top_programs_template | llm | StrOutputParser()
    raw_programs = gen_chain.invoke({"domain": domain, "countries": countries, "budget": budget})
    
    # Refine output
    refine_chain = output_refinement_template | llm | StrOutputParser()
    refined_programs = refine_chain.invoke({"raw_output": raw_programs})
    
    return clean_markdown(refined_programs)

def generate_roadmap(domain: str):
    llm = get_llm()
    chain = roadmap_template | llm | StrOutputParser()
    return clean_markdown(chain.invoke({"domain": domain}))

def generate_summary(domain: str, programs_text: str, roadmap_text: str):
    llm = get_llm()
    chain = summary_template | llm | StrOutputParser()
    return clean_markdown(chain.invoke({"domain": domain, "programs": programs_text, "roadmap": roadmap_text}))
