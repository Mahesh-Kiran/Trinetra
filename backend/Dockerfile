FROM python:3.10-slim

# Create a non-root user as required by Hugging Face Spaces
RUN useradd -m -u 1000 user
ENV PATH="/home/user/.local/bin:$PATH"

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Switch to the non-root user
USER user

WORKDIR /app

# Copy and install requirements
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the remaining files
COPY --chown=user . .

# Hugging Face Spaces requires exposing port 7860
EXPOSE 7860

CMD ["uvicorn", "trinetra_server:app", "--host", "0.0.0.0", "--port", "7860"]
