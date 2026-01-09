def assess_health(detections):
    summary = {
        "Healthy": 0,
        "At Risk": 0
    }

    for det in detections:
        x1, y1, x2, y2 = det["bbox"]
        area = (x2 - x1) * (y2 - y1)

        if area < 25000:
            summary["At Risk"] += 1
        else:
            summary["Healthy"] += 1

    return summary