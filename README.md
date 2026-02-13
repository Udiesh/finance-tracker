# 💰 Finance Tracker

A full-stack personal finance tracking web application that helps users manage income and expenses, categorize transactions, and visualize financial data through an intuitive dashboard.

---

## 🔗 Live Demo

**Frontend:** [https://finance-tracker-ashy-iota.vercel.app](https://finance-tracker-ashy-iota.vercel.app)  
**Repository:** [https://github.com/Udiesh/finance-tracker](https://github.com/Udiesh/finance-tracker)

---

## 📌 Features

- ✅ Add, edit, and delete income & expense transactions
- 📊 Categorize transactions for better tracking
- 📈 Interactive charts for financial insights
- 📱 Responsive UI (mobile & desktop)
- 🔄 Clean separation of frontend and backend
- 🌐 REST-based architecture

---

## 🧠 Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Python** - Backend language
- **REST API** - Architecture
- **Virtual environment** - Dependency management

### Deployment
- **Frontend:** Vercel
- **Backend:** Local / Cloud-ready

---

## 📁 Project Structure

```
finance-tracker/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   ├── main.py
│   ├── requirements.txt
│   └── venv/
│
├── .gitignore
└── README.md
```

---

## 🛠️ Getting Started

### ✅ Prerequisites

- **Node.js** (v16+)
- **Python** (v3.9+)
- **npm** / **pip**

---

## ▶️ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at:  
**http://localhost:5173**

---

## ▶️ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend server
python main.py
```

Backend will run at:  
**http://localhost:8000**

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (`backend/.env`)

```env
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
DEBUG=True
```

---

## 🔌 API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/transactions` | GET | Fetch all transactions |
| `/transactions` | POST | Add new transaction |
| `/transactions/<id>` | PUT | Update transaction |
| `/transactions/<id>` | DELETE | Delete transaction |

---

## 📊 Charts & Analytics

The dashboard uses **Recharts** to visualize:

- 💵 Income vs Expenses
- 🏷️ Category-wise spending
- 📅 Monthly summaries

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m "Add your feature"
   ```

4. **Push to branch**
   ```bash
   git push origin feature/your-feature
   ```

5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👤 Author

**Udiesh Kumar**  
GitHub: [@Udiesh](https://github.com/Udiesh)

---

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern finance management tools
- Built with ❤️ using React and Python

---

**⭐ If you find this project useful, please consider giving it a star!**
