# 🧠 NeuroFlow: ADHD-Friendly AI Personal Assistant

> **"Your external pre-frontal cortex."**

NeuroFlow is a Progressive Web App (PWA) designed to help neurodivergent brains manage tasks without overwhelm. Unlike traditional todo lists that become "graveyards of guilt," NeuroFlow uses **Time Container Methodologies** and **AI Agents** to automatically prioritize, sort, and limit your Work-In-Progress.

![Project Status](https://img.shields.io/badge/Status-Live-success)
![Stack](https://img.shields.io/badge/Stack-React_|_FastAPI_|_Groq_AI-blueviolet)

---

## ✨ Key Features

### 🧠 AI Brain Dump
Stop overthinking where to put a task. Just type (or speak) naturally:
> *"I need to email the professor about the project, buy milk, and spend 10 mins on LeetCode"*

The **Python AI Backend (Llama 3.3 via Groq)** will:
1.  Split the complex sentence into 3 separate tasks.
2.  Analyze the urgency and context of each.
3.  Auto-sort them into the correct **Traffic Light Lanes**.

### 🚦 The Traffic Light System (WIP Limits)
To prevent paralysis, each lane has a strict limit on active tasks:
* 🔴 **RED (Urgent):** Max 3 tasks. High energy, "Do it first."
* 🟡 **YELLOW (Important):** Max 2 tasks. Progress goals.
* 🟢 **GREEN (Restore):** Max 1 task. Dopamine hits & rest.
* ⚫ **GRAY (Parking Lot):** Unlimited storage for later.

### ⚡ Anxiety Reset Button
Overwhelmed? Click one button to:
1.  Hide all non-essential tasks.
2.  Highlight the single most important Red task.
3.  Start a "Time Container" focus timer.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React + TypeScript (Vite)
* **Styling:** Tailwind CSS
* **State/Storage:** Dexie.js (IndexedDB) for Local-First data persistence.
* **Drag & Drop:** `@dnd-kit/core`

### Backend (The "Brain")
* **Framework:** FastAPI (Python)
* **AI Model:** Llama 3.3-70b-versatile (via Groq API)
* **Validation:** Pydantic & Instructor
* **Architecture:** Serverless Function (Vercel Monorepo)

---

## 🚀 Getting Started Locally

### 1. Clone the Repo
```bash
git clone [https://github.com/your-username/neuroflow.git](https://github.com/your-username/neuroflow.git)
cd neuroflow
2. Setup the Backend (Python)
The backend lives in the api/ folder.

Bash

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn groq python-dotenv instructor pydantic

# Set up your API Key
# Create a .env file in the root directory and add:
GROQ_API_KEY=your_actual_api_key_here
3. Setup the Frontend (React)
Bash

npm install
4. Run the App
You need two terminals running side-by-side:

Terminal 1 (Backend):

Bash

# Runs the API on port 8000
python -m uvicorn api.index:app --reload --port 8000
Terminal 2 (Frontend):

Bash

# Runs the UI on port 5173
npm run dev
Note: Update vite.config.ts proxy settings if your local backend port changes.

☁️ Deployment (Vercel)
This project is configured as a Vercel Monorepo.

Push your code to GitHub.

Import the project into Vercel.

Add your Environment Variable in Vercel Settings:

GROQ_API_KEY: gsk_...

Vercel will automatically detect the api/ folder and deploy it as a Serverless Function.
