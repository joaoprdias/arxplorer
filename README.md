# arXplorer

A web application to **discover**, **analyze**, and **cluster** scientific research articles effortlessly.

> Developed as part of the **Text Mining** course project at **ISCTE** University.

---

## Technologies

- **Frontend:** React.js
- **Backend:** FastAPI
- **Styling:** Custom Responsive CSS
- **Data Source:** arXiv API

---

## Main Features

| Feature | Description |
|:--|:--|
| **Search** | Search arXiv articles by keywords and sorting criteria (relevance, date, etc.). |
| **Analyze** | Analyze and display the most frequent keywords in the search results. |
| **Cluster** | Automatically group articles into thematic clusters and visualize them interactively. |
| **Match** | Find similar articles based on topic similarity using cosine distance. |
| **Homepage** | A clean, centralized starting page with quick access to all functionalities. |

---

## 🛠️ How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/joaoprdias/arxplorer.git
cd arxplorer
```

### 2. Install Backend Dependencies (FastAPI)
```bash
python -m venv venv
source venv/bin/activate  # ou .\venv\Scripts\activate no Windows
pip install -r requirements.txt
cd backend
uvicorn main:app --reload
```

### 3. Install Frontend Dependencies (React)
```bash
cd frontend
npm install

# Edit services/api.js to integrate with the backend
const BASE_URL = 'http://127.0.0.1:8000'; // Backend BASE_URL local

# Start
npm start
```

## 🌍 Project Structure
```bash
backend/
├── app/
│   ├── api/        # API routes
│   ├── core/       # Config file
│   ├── services/   # Functions, logic and integrations
├── main.py         # FastAPI entry point
├── .env            # Environment variables (publish in repo because it does not contain sensitive data)

frontend/
├── src/
│   ├── assets/     # Images and static assets
│   ├── pages/      # JS pages and CSS
│   ├── services/   # API service functions
│   ├── App.js      # Main app
│   ├── index.js    # ReactDOM entry
```

## Deployment

| Platform | URL |
|:--|:--|
| **Frontend (React)** | Deployed on **Vercel** |
| **Backend (FastAPI)** | Deployed on **Render** |

- **Frontend (Vercel):** Easy deployment with automatic build and hosting.
- **Backend (Render):** API server hosting with automatic redeployment on Git push.

Both platforms offer free tiers perfect for personal projects and prototypes.

## Notes
This project uses the arXiv public API for article data.

The application is optimized for both desktop and mobile devices.

The cluster visualization is interactive and supports zoom and drag features via D3.js.