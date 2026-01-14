import os
import instructor
from groq import Groq
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # <--- IMPORT THIS
from pydantic import BaseModel, Field
from typing import List, Literal
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# --- ADD THIS BLOCK ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all frontends (React, etc) to connect
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (POST, GET, etc)
    allow_headers=["*"],
)
# ----------------------

client = instructor.from_groq(Groq(api_key=os.getenv("GROQ_API_KEY")))

# ... rest of your code ...
# 2. Define the exact structure we want (Matches your Frontend/Dexie)
class TaskSchema(BaseModel):
    title: str = Field(..., description="The main action of the task")
    category: Literal["red", "yellow", "green"] = Field(..., description="red=Urgent, yellow=Week, green=Later")
    duration: int = Field(..., description="Estimated minutes (15, 25, or 45)")
    reasoning: str = Field(..., description="Short reason for the priority")

class BrainDumpResponse(BaseModel):
    tasks: List[TaskSchema]

class BrainDumpRequest(BaseModel):
    raw_text: str

@app.post("/api/process-brain-dump", response_model=BrainDumpResponse)
async def process_brain_dump(request: BrainDumpRequest):
    system_prompt = """
    You are an ADHD-friendly Personal Assistant. 
    Break the user's brain dump into actionable tasks using the Traffic Light system.
    - RED (Max 3): Critical/Today.
    - YELLOW (Max 2): Important/This Week.
    - GREEN (Max 1): Low energy/Later.
    """

    try:
        # 3. The Magic: requesting a python object, not a string
        return client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            response_model=BrainDumpResponse, # The AI force-fits output to this class
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.raw_text}
            ],
            temperature=0.1, 
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))