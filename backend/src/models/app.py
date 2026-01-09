import streamlit as st
import cv2
import numpy as np
from PIL import Image

from detector import AnimalDetector
from health import assess_health
from utils import draw_boxes

st.set_page_config(page_title="Anitect", layout="wide")

st.title("Anitect")

detector = AnimalDetector()

uploaded_file = st.file_uploader(
    "Upload Animal Image",
    type=["jpg", "png", "jpeg"]
)

if uploaded_file:
    image = Image.open(uploaded_file)
    image_np = np.array(image)

    detections = detector.detect(image_np)
    health = assess_health(detections)

    annotated = draw_boxes(image_np.copy(), detections)

    col1, col2 = st.columns(2)

    with col1:
        st.image(annotated, caption="Animals detected", use_column_width=True)

    with col2:
        st.subheader("Detection results")
        species_count = {}
        for d in detections:
            species_count[d["label"]] = species_count.get(d["label"], 0) + 1

        st.json(species_count)

        st.subheader("Health result")
        st.metric("Healthy Animals", health["Healthy"])
        st.metric("Maybe at Risk", health["At Risk"])

        if health["At Risk"] > 0:
            st.warning("Some animals may need veterinary attention")
        else:
            st.success("Livestock appears healthy")