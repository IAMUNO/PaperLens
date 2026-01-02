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

    def _get_mock_response(self):
        return {
            "concept": {
                "title": "Understanding Physical AI",
                "description": "An overview of the rise of Physical AI, focusing on its evolution from traditional robot control to semantic-based AI.",
                "mermaid_code": "graph TD;\n    A[Physical AI Evolution] --> B[Traditional Robot Control];\n    A --> C[Semantic Understanding];\n    B --> D[Programming and Control Theories];\n    C --> E[Context and Meaning Understanding];\n    E --> F[Transformer Approaches];\n    E --> G[Visual Language Associations];",
                "explanation": "This flowchart encapsulates the progression of Physical AI from traditional robot control methods to more advanced semantic understanding capabilities, highlighting the transition points and methodologies involved."
            },
            "example": {
                "title": "RT2 Application in Robotics",
                "description": "RT2 showcases using pre-trained language models linked with robotics to predict actions based on visual and contextual data.",
                "mermaid_code": "sequenceDiagram;\n    participant Human;\n    participant RT2;\n    participant Robot;\n    participant Environment;\n    Human->>RT2: Command 'Pick up an object similar to a banana';\n    RT2->>Robot: Interpret and process command;\n    Robot->>Environment: Identify objects;\n    Robot-->>RT2: Object identified;\n    RT2-->>Robot: Execute action;\n    Robot-->>Human: Task completed;",
                "explanation": "This sequence diagram illustrates how RT2 functions in a real-world setup, showing the communication flow between a human, the RT2 model, a robot, and its environment, culminating in a successful task."
            },
            "learning": {
                "title": "Practice with Physical AI Systems",
                "description": "A structured approach to practicing and enhancing skills in the development and control of Physical AI systems.",
                "mermaid_code": "stateDiagram-v2\n    state PhysicalAI_Training\n    [*] --> DefineGoal\n    DefineGoal --> SelectModel\n    SelectModel --> TrainWithData\n    TrainWithData --> ValidateOnSimulations\n    ValidateOnSimulations --> DeployToRealWorld\n    DeployToRealWorld --> AnalyzePerformance\n    AnalyzePerformance --> [*]",
                "explanation": "This state diagram presents a practical approach to training and refining Physical AI systems, starting from goal definition and moving through model selection, training, validation, deployment, and performance analysis."
            },
            "extension": {
                "title": "Advanced Concepts in Physical AI",
                "description": "Exploring advanced methods like COGACT and FLOW matching as well as infrastructure considerations in Physical AI.",
                "mermaid_code": "mindmap\n    root((Advanced Physical AI))\n        COGACT\n            High-Level Cognition\n            Low-Level Action\n        FLOW_Matching\n            Continuous Action Generation\n        Infrastructure\n            Large-scale Data\n            TPU & GPU Deployment\n        Future_Extensions\n            On-Device Optimization\n            Low-Latency Execution",
                "explanation": "This mindmap outlines advanced concepts surrounding Physical AI, such as the COGACT model's cognitive and action separation, FLOW matching for action generation, and infrastructure requirements that support these advancements."
            }
        }

    def analyze_content(self, text: str) -> Dict:
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
        
        user_prompt = f"Analyze the following content and generate the 4-stage diagram breakdown:\n\n{text[:15000]}"

        try:
            client = self._get_client()
            response = client.chat.completions.create(
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
            print(f"LLM Error (falling back to mock): {e}")
            return self._get_mock_response()
