FROM python:3.11-slim

WORKDIR /app

# Install requirements
COPY backend/requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy app code and model
COPY backend/app /app/app
COPY ml /app/ml

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
