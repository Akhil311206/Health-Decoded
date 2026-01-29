from fastapi import FastAPI, UploadFile, File
import google.generativeai as genai
import PIL.Image
import io
import os
import json  
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv("APIkey.env")

app = FastAPI()

origins = [
    "http://localhost:5173",           # Local testing
    "https://healthdecoded.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@app.post("/analyze")
async def analyze_document(
    file: UploadFile = File(...),
    mode: str = "report"
):
    try:
        content = await file.read()
        img = PIL.Image.open(io.BytesIO(content))
        
        
        model = genai.GenerativeModel("gemini-2.5-flash")

        if mode == "report":
            prompt = (
                "ACT AS: Specialized Medical Data Interpreter. "
                "TASK: Extract medical data and explain in ELI5 terms."
                "STRICT RULE: Output ONLY valid JSON. No markdown tags, no conversational text. "
                "JSON STRUCTURE: {"
                "\"summary\": \"2-sentence simple overview\", "
                "\"findings\": [{\"parameter\": \"name\", \"value\": \"result\", \"status\": \"Normal/High/Low/Critical\", \"explanation\": \"simple analogy\"}], "
                "\"safety_note\": \"calm doctor-first disclaimer\", "
                "\"sensitivity_flag\": boolean"
                "}"
            )
        else:
            prompt = (
                "ACT AS: Professional Medical Billing Auditor. "
                "TASK: Audit bill for errors and suggest generic alternatives. "
                "STRICT RULE: Output ONLY valid JSON. No markdown tags, no conversational text. "
                "JSON STRUCTURE: {"
                "\"bill_trust_score\": number, "
                "\"audit_findings\": [{\"item\": \"name\", \"cost\": number, \"issue_detected\": \"string\", \"suggested_action\": \"string\"}], "
                "\"savings_opportunity\": {\"detected\": boolean, \"generic_alternatives\": [{\"branded\": \"string\", \"generic\": \"string\", \"estimated_savings\": \"string\"}]}"
                "}"
            )

        response = model.generate_content([prompt, img])
        
        
        try:
            # .strip() handles any accidental whitespace the AI might add
            structured_data = json.loads(response.text.strip())
            return {"analysis": structured_data}
            
        except json.JSONDecodeError:
            # Fallback if the AI fails to follow the JSON rule perfectly
            return {"analysis": response.text, "error": "AI response was not valid JSON"}

    except Exception as e:
        print("🔥 ERROR:", e)
        return {"error": str(e)}