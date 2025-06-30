from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

from app.model_loader import load_model, load_columns
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="House Price Prediction API")

# Load model and expected columns at startup
model = load_model()
expected_columns = load_columns()
expected_feature_count = len(expected_columns)

class HouseFeatures(BaseModel):
    features: list

@app.get("/")
def read_root():
    return {"message": "API is up and running."}

@app.get("/expected-features")
def get_expected_features():
    return {"columns": expected_columns}

@app.post("/predict")
def predict_price(data: HouseFeatures):
    if len(data.features) != expected_feature_count:
        return {
            "error": f"Feature count mismatch: expected {expected_feature_count}, got {len(data.features)}"
        }
    
    input_data = np.array(data.features).reshape(1, -1)
    prediction = model.predict(input_data)[0]
    return {"predicted_price": float(prediction)}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

