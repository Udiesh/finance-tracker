<div align="center">

# 💰 Finance Tracker

### *Take Control of Your Financial Future*

A modern, full-stack personal finance management application built with React and Python

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://finance-tracker-ashy-iota.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repo-blue?style=for-the-badge&logo=github)](https://github.com/Udiesh/finance-tracker)
[![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

Finance Tracker is a comprehensive personal finance management solution that helps you track income and expenses, visualize spending patterns, and make informed financial decisions. Built with modern web technologies, it offers a seamless experience across all devices.

---

## ✨ Features

### 💳 Transaction Management
- **Add Transactions** - Record income and expenses with ease
- **Edit & Delete** - Full CRUD operations on all transactions
- **Smart Categorization** - Organize transactions by custom categories
- **Date Tracking** - Monitor when money comes in and goes out

### 📊 Data Visualization
- **Interactive Charts** - Beautiful visualizations powered by Recharts
- **Income vs Expense Analysis** - Compare your earnings and spending
- **Category Breakdown** - See where your money goes
- **Monthly Trends** - Track financial patterns over time
- **Real-time Updates** - Charts update instantly as you add data

### 🎨 User Experience
- **Responsive Design** - Works flawlessly on desktop, tablet, and mobile
- **Intuitive Interface** - Clean, modern UI built with Tailwind CSS
- **Fast Performance** - Lightning-fast React with Vite bundling
- **Smooth Navigation** - Seamless routing with React Router

---

## 🎯 Demo

**Live Application:** [finance-tracker-ashy-iota.vercel.app](https://finance-tracker-ashy-iota.vercel.app)

### Screenshots

*Add screenshots here to showcase your application*

```
[Dashboard View] [Add Transaction] [Analytics View]
```

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

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **Python** 3.9 or higher ([Download](https://www.python.org/downloads/))
- **npm** or **yarn** (comes with Node.js)
- **pip** (comes with Python)
- **Git** ([Download](https://git-scm.com/))

### Quick Start

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Udiesh/finance-tracker.git
cd finance-tracker
```

#### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will be running at **http://localhost:5173**

#### 3️⃣ Backend Setup

```bash
# Navigate to backend directory (from project root)
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Run the server
python main.py
```

The backend will be running at **http://localhost:8000**

---

## ⚙️ Configuration

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Application Settings
DEBUG=True
SECRET_KEY=your-secret-key-here

# Database Configuration
DATABASE_URL=your-database-url-here

# API Configuration
API_PORT=8000
CORS_ORIGINS=http://localhost:5173
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### Get All Transactions
```http
GET /transactions
```

**Response:**
```json
[
  {
    "id": 1,
    "type": "income",
    "amount": 5000,
    "category": "Salary",
    "description": "Monthly salary",
    "date": "2026-02-01"
  }
]
```

#### Create Transaction
```http
POST /transactions
```

**Request Body:**
```json
{
  "type": "expense",
  "amount": 150,
  "category": "Food",
  "description": "Groceries",
  "date": "2026-02-13"
}
```

#### Update Transaction
```http
PUT /transactions/{id}
```

**Request Body:**
```json
{
  "amount": 200,
  "description": "Updated description"
}
```

#### Delete Transaction
```http
DELETE /transactions/{id}
```

**Response:**
```json
{
  "message": "Transaction deleted successfully"
}
```

---

## 🎨 Available Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Backend

| Command | Description |
|---------|-------------|
| `python main.py` | Start development server |
| `pip install -r requirements.txt` | Install dependencies |
| `pip freeze > requirements.txt` | Update dependencies |

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
python -m pytest
```

---

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
cd frontend
vercel
```

### Backend

The backend can be deployed to various platforms:

- **Railway** - Simple Python deployment
- **Render** - Free tier available
- **Heroku** - Classic PaaS solution
- **AWS/GCP/Azure** - Full control

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### How to Contribute

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button at the top right
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/finance-tracker.git
   cd finance-tracker
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: amazing new feature"
   ```
   
   **Commit Message Guidelines:**
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for changes to existing features
   - `Remove:` for removing features
   - `Docs:` for documentation changes

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes clearly

### Areas to Contribute

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage

---

## 🐛 Known Issues

Check the [Issues](https://github.com/Udiesh/finance-tracker/issues) page for current bugs and feature requests.

---

## 📝 Roadmap

- [ ] User authentication & authorization
- [ ] Budget planning and alerts
- [ ] Recurring transactions
- [ ] Export data (CSV, PDF)
- [ ] Dark mode
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] AI-powered insights

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - you are free to use, modify, and distribute this software.
```

---

## 👤 Author

**Udiesh Kumar**

- GitHub: [@Udiesh](https://github.com/Udiesh)
- LinkedIn: [Add your LinkedIn]
- Email: [Add your email]

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Recharts** - For beautiful, customizable charts
- **Vercel** - For seamless deployment
- **Open Source Community** - For inspiration and tools

---

## 💬 Support

If you have any questions or need help:

- 📧 Email: [your-email@example.com]
- 💬 Discussions: [GitHub Discussions](https://github.com/Udiesh/finance-tracker/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/Udiesh/finance-tracker/issues)

---

## ⭐ Show Your Support

If this project helped you, please consider giving it a ⭐️!

<div align="center">

**Made with ❤️ by Udiesh Kumar**

[⬆ Back to Top](#-finance-tracker)

</div>
