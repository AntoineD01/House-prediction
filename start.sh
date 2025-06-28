#!/bin/bash
set -e

echo "Running DVC Pull..."
dvc pull

echo "Starting FastAPI..."
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
