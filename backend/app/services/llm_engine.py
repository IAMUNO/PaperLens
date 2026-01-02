from openai import OpenAI
from pydantic import BaseModel
from typing import List, Dict
import os
import json

class DiagramStage(BaseModel):
    title: str
    description: str
    mermaid_code: str
    explanation: str

class AnalysisResult(BaseModel):
    concept: DiagramStage
    example: DiagramStage
    learning: DiagramStage
    extension: DiagramStage

class LLMEngine:
    def __init__(self):
        self.client = None

    def _get_client(self):
        if not self.client:
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY is not set in environment variables")
            self.client = OpenAI(api_key=api_key)
        return self.client

    def analyze_content(self, text: str) -> Dict:
        client = self._get_client()
            
        system_prompt = """
        You are an expert educational content creator. Your goal is to explain complex topics using visual diagrams.
        You must output a valid JSON object with the following structure, representing 4 stages of learning:
        
        1. "concept": Explains the core concept abstractly. Use a flowchart or mindmap.
        2. "example": A concrete real-world example. Use a sequence diagram or class diagram.
        3. "learning": How to practice or apply this. Use a flowchart or state diagram.
        4. "extension": Advanced or related concepts. Use a mindmap or entity relationship diagram.
        
        For each stage, provide:
        - title: Short title
        - description: One sentence description
        - mermaid_code: Valid Mermaid.js code for the diagram. DO NOT include markdown backticks.
        - explanation: Brief explanation of the diagram.
        """
        
        user_prompt = f"Analyze the following content and generate the 4-stage diagram breakdown:\n\n{text[:15000]}" # Truncate to avoid context limit for MVP

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={ "type": "json_object" }
            )
            
            content = response.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            print(f"LLM Error: {e}")
            raise e
