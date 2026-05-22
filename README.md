# TRINETRA - SAR Maritime Surveillance System

TRINETRA is an advanced Synthetic Aperture Radar (SAR) imagery analysis tool designed to detect maritime anomalies. It uses two powerful AI models:
- **Deformable DETR** for precise Ship Detection
- **TransUNet** for high-accuracy Oil Spill Segmentation

## Prerequisites
- Node.js (v18+ recommended)
- Python 3.10+
- (Optional) Docker

---

## 🐳 How to Run the Backend

You can run the backend server using Docker (recommended) or natively using Python.

### Option A: Run the Pre-built Image from Docker Hub (Easiest)
1. Run the Docker container directly:
   ```bash
   docker run -d -p 8000:8000 --name trinetra-api maheshkiran/trinetra-backend
   ```

### Option B: Build and Run Docker Image Locally
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the Docker image:
   ```bash
   docker build -t maheshkiran/trinetra-backend .
   ```
3. Run the Docker container:
   ```bash
   docker run -d -p 8000:8000 --name trinetra-api maheshkiran/trinetra-backend
   ```

### Option C: Run Locally with Python (No Docker)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the backend server:
   ```bash
   python trinetra_server.py
   ```

*Whichever option you choose, the backend API will start at `http://127.0.0.1:8000`.*

---

## 💻 How to Run the Frontend

The frontend provides the user interface to upload and visualize SAR images.

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies (only needed the first time):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The web application will automatically connect to the backend and be accessible at `http://localhost:5173`.*

---

## 🔍 Features

- **Dashboard:** Track real-time statistics and session data.
- **Ship Detection:** Upload a SAR image and instantly get bounding boxes indicating detected vessels, along with confidence scores.
- **Oil Spill Detection:** Upload a SAR image to receive a pixel-perfect binary mask and a color-contrast overlay visualizing the exact boundaries of the oil spill.
- **Theme Toggle:** Switch between Light and Dark mode using the icon in the top navigation bar.
