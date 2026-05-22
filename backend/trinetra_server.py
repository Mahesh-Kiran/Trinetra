"""
TRINETRA — SAR Maritime Surveillance Backend
Serves both Ship Detection (Deformable DETR) and Oil Spill Detection (TransUNet) models.
"""
import os
import io
import time
import json
import base64
import datetime
import logging
from typing import Dict, Any, Optional, List
from collections import deque

import torch
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from transformers import AutoImageProcessor, AutoModelForObjectDetection
import torchvision.ops as ops

from oilspill_model import (
    VisionTransformer, get_r50_b16_config, ResizeToTensor, predict_oilspill
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("trinetra")

# Config
SHIP_MODEL_DIR = "models"
OIL_MODEL_PATH = "models/oil_spill.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Activity Log
activity_log: deque = deque(maxlen=50)
session_stats = {
    "total_scans": 0,
    "ships_detected": 0,
    "oil_spills_detected": 0,
    "data_processed_mb": 0.0,
    "session_start": datetime.datetime.now(datetime.timezone.utc).isoformat()
}


def add_activity(action: str, log_type: str, status: str):
    activity_log.appendleft({
        "action": action,
        "time": datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S UTC"),
        "type": log_type,
        "status": status
    })


# Ship Detection Model
logger.info(f"🔧 Using device: {DEVICE}")

# Load ship model
logger.info("Loading Ship Detection model (Deformable DETR)...")
ship_processor = AutoImageProcessor.from_pretrained(SHIP_MODEL_DIR)
ship_model = AutoModelForObjectDetection.from_pretrained(SHIP_MODEL_DIR).to(DEVICE)
ship_model.eval()

with open(os.path.join(SHIP_MODEL_DIR, "config.json"), "r") as f:
    ship_config = json.load(f)
ship_class_names = ship_config.get("id2label", {"0": "ship"})
SHIP_CONFIDENCE_THRESHOLD = 0.5
logger.info("✅ Ship model loaded")

# Load oil spill model
logger.info("Loading Oil Spill Detection model (TransUNet)...")
oil_config = get_r50_b16_config()
oil_model = VisionTransformer(oil_config, img_size=(224, 224), num_classes=oil_config.n_classes).to(DEVICE)
oil_model.load_state_dict(torch.load(OIL_MODEL_PATH, map_location=DEVICE, weights_only=False))
oil_model.eval()
oil_transform = ResizeToTensor(size=(224, 224))
logger.info("✅ Oil spill model loaded")

add_activity("System initialized — both models loaded", "system", "SUCCESS")

# FastAPI App
app = FastAPI(title="TRINETRA — SAR Maritime Surveillance API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Ship Detection
@app.post("/detect")
async def detect_ships(file: UploadFile = File(...)):
    """Detect ships in uploaded SAR image using Deformable DETR."""
    start_time = time.time()
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        contents = await file.read()
        file_size_mb = len(contents) / (1024 * 1024)
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        original_size = image.size

        # Preprocess
        inputs = ship_processor(images=image, return_tensors="pt")
        inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

        # Inference
        with torch.no_grad():
            outputs = ship_model(**inputs)

        # Post-process
        target_sizes = torch.tensor([[image.size[1], image.size[0]]]).to(DEVICE)
        results = ship_processor.post_process_object_detection(
            outputs, threshold=SHIP_CONFIDENCE_THRESHOLD, target_sizes=target_sizes
        )[0]

        detections = []
        for box, label, score in zip(results["boxes"], results["labels"], results["scores"]):
            x1, y1, x2, y2 = box.tolist()
            class_id = int(label)
            detections.append({
                "bbox": [x1, y1, x2, y2],
                "confidence": round(score.item(), 4),
                "class_id": class_id,
                "class_name": ship_class_names.get(str(class_id), f"class_{class_id}")
            })

        # NMS
        if detections:
            boxes_t = torch.tensor([d["bbox"] for d in detections])
            scores_t = torch.tensor([d["confidence"] for d in detections])
            keep = ops.nms(boxes_t, scores_t, 0.5)
            detections = [detections[i] for i in keep]

        processing_time = round(time.time() - start_time, 3)

        # Update stats
        session_stats["total_scans"] += 1
        session_stats["ships_detected"] += len(detections)
        session_stats["data_processed_mb"] += file_size_mb
        add_activity(
            f"Ship detection — {len(detections)} ships found in {file.filename}",
            "scan", "SUCCESS"
        )

        return {
            "status": "success",
            "filename": file.filename,
            "image_size": list(original_size),
            "detections": detections,
            "num_detections": len(detections),
            "processing_time": processing_time
        }

    except HTTPException:
        raise
    except Exception as e:
        add_activity(f"Ship detection failed — {str(e)[:60]}", "scan", "ERROR")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# Oil Spill Detection
@app.post("/detect/oilspill")
async def detect_oilspill(file: UploadFile = File(...)):
    """Detect oil spills in uploaded SAR image using TransUNet segmentation."""
    start_time = time.time()
    try:
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        contents = await file.read()
        file_size_mb = len(contents) / (1024 * 1024)

        result = predict_oilspill(contents, oil_model, oil_transform, DEVICE)
        result["processing_time"] = round(time.time() - start_time, 3)
        result["filename"] = file.filename
        result["status"] = "success"

        # Update stats
        session_stats["total_scans"] += 1
        if result["classification"] == "oil_spill":
            session_stats["oil_spills_detected"] += 1
        session_stats["data_processed_mb"] += file_size_mb

        add_activity(
            f"Oil spill analysis — {result['classification'].replace('_', ' ')} ({result['confidence']*100:.1f}%) in {file.filename}",
            "analysis", "SUCCESS"
        )

        return result

    except HTTPException:
        raise
    except Exception as e:
        add_activity(f"Oil spill detection failed — {str(e)[:60]}", "analysis", "ERROR")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# System Endpoints
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "device": str(DEVICE),
        "ship_model_loaded": True,
        "oil_model_loaded": True,
        "cuda_available": torch.cuda.is_available()
    }


@app.get("/activity-log")
async def get_activity_log():
    return {"log": list(activity_log)}


@app.get("/session-stats")
async def get_session_stats():
    return session_stats


@app.get("/")
async def root():
    return {
        "message": "🛰️ TRINETRA — SAR Maritime Surveillance API",
        "status": "running",
        "device": str(DEVICE),
        "models": {
            "ship": "Deformable DETR",
            "oil_spill": "TransUNet"
        },
        "endpoints": {
            "ship_detect": "POST /detect",
            "oil_detect": "POST /detect/oilspill",
            "health": "GET /health",
            "activity": "GET /activity-log",
            "stats": "GET /session-stats"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("trinetra_server:app", host="0.0.0.0", port=8000, log_level="info")
