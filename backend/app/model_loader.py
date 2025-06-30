import os
import json
import joblib

# Base directory is 2 levels up from this file (so it reaches /app)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml", "models", "xgb_model_100_5_0.1.pkl")
COLUMNS_PATH = os.path.join(BASE_DIR, "ml", "models", "feature_columns.json")

def load_model():
    return joblib.load(MODEL_PATH)

def load_columns():
    with open(COLUMNS_PATH, 'r') as f:
        return json.load(f)
