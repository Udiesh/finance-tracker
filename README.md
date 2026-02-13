<div align="center">

# 💰 Finance Tracker

*A modern personal finance management application*

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://finance-tracker-ashy-iota.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repo-blue?style=for-the-badge&logo=github)](https://github.com/Udiesh/finance-tracker)

**[Live Demo](https://finance-tracker-ashy-iota.vercel.app)** • **[Tech Stack](#-tech-stack)** • **[Setup](#-local-setup)**

</div>

---

## 📋 About

Finance Tracker is a full-stack web application I built to help manage personal finances. It allows users to track income and expenses, categorize transactions, and visualize spending patterns through interactive charts.

---

## ✨ Features

- 💳 **Transaction Management** - Add, edit, and delete income & expense transactions
- 📊 **Smart Categorization** - Organize transactions by custom categories
- 📈 **Visual Analytics** - Interactive charts showing income vs expenses, category breakdowns, and monthly trends
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Real-time Updates** - Charts and data update instantly as you add transactions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | UI Framework |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Build Tool & Dev Server |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Styling Framework |
| ![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=flat) | Data Visualization |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | HTTP Client |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) | Client-side Routing |

### Backend
| Technology | Purpose |
|-----------|---------|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | Backend Language |
| REST API | API Architecture |

### Deployment & DevOps
| Platform | Service |
|----------|---------|
| ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) | Frontend Hosting |
| ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white) | Version Control |

---

## 📁 Project Structure

```
finance-tracker/
│
├── frontend/                   # React frontend application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── App.jsx            # Root component
│   │   └── main.jsx           # Entry point
│   ├── package.json           # Dependencies & scripts
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── vite.config.js         # Vite configuration
│   └── .env                   # Environment variables
│
├── backend/                    # Python backend application
│   ├── app/                   # Application logic
│   ├── main.py                # Server entry point
│   ├── requirements.txt       # Python dependencies
│   ├── venv/                  # Virtual environment
│   └── .env                   # Environment variables
│
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

---

## 🚀 Local Setup

Want to run this project locally? Follow these steps:

### Prerequisites

- Node.js v16+
- Python 3.9+

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Udiesh/finance-tracker.git
cd finance-tracker
```

**2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

**3. Backend Setup**
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
python main.py
```
Backend runs at `http://localhost:8000`

### Environment Variables

**Frontend** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:8000
```

**Backend** (`backend/.env`):
```env
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
DEBUG=True
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/transactions` | GET | Get all transactions |
| `/transactions` | POST | Create new transaction |
| `/transactions/{id}` | PUT | Update transaction |
| `/transactions/{id}` | DELETE | Delete transaction |

---

## 🚀 Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com)
- **Backend:** Ready for deployment on Railway, Render, or Heroku

---

## 👤 Author

**Udiesh Kumar**

- GitHub: [@Udiesh](https://github.com/Udiesh)
- Portfolio: [Your Portfolio URL]

---

<div align="center">

**Built with ❤️ using React & Python**

⭐ Star this repo if you find it useful!

</div>
