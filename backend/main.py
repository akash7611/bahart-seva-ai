from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI(title="BharatSeva AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
SCHEMES_FILE = BASE_DIR / "data" / "schemes.json"


def load_schemes():
    with open(SCHEMES_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


@app.get("/")
def home():
    return {
        "message": "BharatSeva AI Backend is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/schemes")
def get_schemes():
    return {
        "count": len(load_schemes()),
        "schemes": load_schemes()
    }