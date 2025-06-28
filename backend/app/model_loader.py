import json
import os
import joblib

MODEL_PATH = "ml/models/xgb_model_100_5_0.1.pkl"
COLUMNS_PATH = "ml/models/feature_columns.json"

def load_model():
    return joblib.load(MODEL_PATH)

def load_columns():
    with open(COLUMNS_PATH, 'r') as f:
        return json.load(f)
