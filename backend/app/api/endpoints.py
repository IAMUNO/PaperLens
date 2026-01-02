from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.input_processor import InputProcessor
from app.services.llm_engine import LLMEngine

router = APIRouter()
llm_engine = LLMEngine()

class AnalyzeRequest(BaseModel):
    input_type: str  # "youtube", "url", "text"
    content: str     # URL or text content

@router.get("/health")
async def health_check():
    return {"status": "ok"}

@router.post("/analyze")
async def analyze_content(request: AnalyzeRequest):
    try:
        # 1. Process Input
        raw_text = InputProcessor.process_input(request.input_type, request.content)
        
        # 2. Analyze with LLM
        analysis_result = llm_engine.analyze_content(raw_text)
        
        return analysis_result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
