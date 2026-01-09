from ultralytics import YOLO
import cv2

MODEL_PATH = "yolov8n.pt"

class AnimalDetector:
    def __init__(self):
        self.model = YOLO(MODEL_PATH)

    def detect(self, image):
        results = self.model(image)[0]
        detections = []

        for box in results.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            label = self.model.names[cls_id]

            if label in ["cow", "sheep", "goat", "horse"]:
                detections.append({
                    "label": label,
                    "confidence": conf,
                    "bbox": box.xyxy[0].tolist()
                })

        return detections