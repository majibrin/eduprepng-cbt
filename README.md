
EduPrepNG CBT is a **full-stack Computer-Based Test system** built with **Django (backend)** and **React (frontend)**.
It simulates real examination conditions including **timed exams**, **question navigation**, **answer tracking**, and **result analytics**.

This project was built as part of **practical training / SIWES preparation**, with a strong focus on **learning by building**.

---

## **Features**

### **Backend (Django)**
- User authentication (session-based)
- Exam creation and management
- Question bank with multiple-choice questions
- Exam attempts with:
  - Start time
  - Expiry time
  - Auto-expiration
- Student answers tracking
- Automatic scoring
- REST-style API endpoints consumed by the frontend

### **Frontend (React + Vite)**
- Start exam
- Load questions dynamically
- One-question-at-a-time CBT flow
- Pagination (**Previous / Next / Submit**)
- Countdown timer with auto-submit
- Answer persistence
- Result page with analytics

### **CBT Experience**
- Mobile-first interface
- Clean and distraction-free exam layout
- Sticky navigation buttons
- Prevents changes after submission
- Supports early submission

---

## **Tech Stack**

### **Backend**
- **Python**
- **Django**
- **Django ORM**
- **SQLite** (development)

### **Frontend**
- **React**
- **Vite**
- **JavaScript (ES6+)**
- **CSS (custom, mobile-first)**

### **Tools**
- **Git & GitHub**
- **cURL**
- **Termux Linux environment**

---

## **Project Structure**

```text
eduprepng/
├── backend/
│   ├── exams/
│   ├── questions/
│   ├── subjects/
│   ├── users/
│   ├── eduprepng/
│   ├── manage.py
│   └── db.sqlite3
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── api/
    │   ├── App.jsx
    │   └── App.css
    └── vite.config.js

Setup Instructions
Backend Setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

Admin panel: http://127.0.0.1:8000/admin/
Frontend Setup
cd frontend
npm install
npm run dev

Frontend URL: http://localhost:5173
API Endpoints
 * POST  /api/attempts/start/
 * GET   /api/attempts/<id>/questions/
 * POST  /api/answers/submit/
 * POST  /api/attempts/<id>/submit/
Result Analytics
The system calculates:
 * Total questions
 * Answered questions
 * Correct answers
 * Wrong answers
 * Skipped questions
 * Percentage score
Project Purpose
 * Practice full-stack development
 * Build a realistic CBT system
 * Strengthen backend–frontend integration
 * Prepare for SIWES / Industrial Training defense
 * Serve as a foundation for future education platforms
Project Status
 * Working MVP
Author
Muhammad Abdullahi Jibrin Computer Science – Gombe State University
GitHub: https://github.com/majibrin
