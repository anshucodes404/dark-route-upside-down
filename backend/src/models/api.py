from fastapi import FastAPI, File, UploadFile
import numpy as np
import cv2
from PIL import Image
import io

from detector import AnimalDetector
from health import assess_health
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="AI Livestock Health API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hackathon safe
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = AnimalDetector()

# -----------------------------
# 1. Health Check Endpoint
# -----------------------------
@app.get("/health")
def health_check():
    return {"status": "AI Livestock API is running"}

# -----------------------------
# 2. Image Analysis Endpoint
# -----------------------------
@app.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    # Read image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image_np = np.array(image)

    # Detect animals
    detections = detector.detect(image_np)

    # Health assessment
    health = assess_health(detections)

    # Species count
    species_count = {}
    for d in detections:
        species = d["label"]
        species_count[species] = species_count.get(species, 0) + 1

    return {
        "animals_detected": len(detections),
        "species_count": species_count,
        "health": health,
        "detections": detections
    }