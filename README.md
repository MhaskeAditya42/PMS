# 📊 Portfolio Management System (PMS)

A full-stack web application designed to manage personal investment portfolios, including stocks, gold, wallets, and transaction history.It displays performance metrics visually and in real time, making it easier to monitor and analyze investments.Built with React (frontend) and Node.js + Express (backend), connected via RESTful APIs, and styled using Tailwind CSS.
---

## 🏗️ Project Structure

```
PMS-dev/
│
├── backend/         # Node.js + Express backend with REST APIs
│   ├── controllers/     # Route logic for stocks, wallet, portfolio, etc.
│   ├── models/          # Mongoose models for various entities
│   ├── routes/          # Express routes
│   ├── tests/           # Jest-based unit tests
│   ├── utils/           # DB connection
│   └── server.js        # Server entry point
│
├── frontend/        # React + Vite frontend
│   ├── components/      # UI components (Header, Sidebar, Spinner, etc.)
│   ├── pages/           # Main pages (Dashboard, Wallet, Login, etc.)
│   ├── services/        # Axios API service
│   └── main.jsx         # App bootstrap
│
├── .env              # Environment variables
├── package.json      # Project dependencies (frontend-root)
└── README.md
```

---

## 🚀 Features

- 🔐 **Authentication** system with protected routes
- 📈 **Portfolio dashboard** with insights
- 💼 **Wallet** and **transactions** tracking
- 📊 **Watchlist** and real-time stock data integration
- 🪙 **Gold investment** tracking
- 🧪 Unit testing with **Jest**
- 🎨 Styled with **Tailwind CSS** and responsive UI

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- React
- Vite
- Tailwind CSS
- Context API for state management

### 🌐 Backend
- Node.js
- Express
- MySQL
- Jest (for testing)

---

## 🔧 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/MhaskeAditya42/PMS.git
cd PMS-dev
```

---

### 2️⃣ Backend Setup (`/backend`)

```bash
cd backend
npm install
```

#### Create `.env` file with the following:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pms
```

#### Run Backend Server:
```bash
node server.js
```

---

### 3️⃣ Frontend Setup (`/frontend`)

```bash
cd frontend
npm install
npm run dev
```

This runs the React frontend on [http://localhost:5173](http://localhost:5173)

---

## 🧪 Run Tests

```bash
cd backend
npx jest
```

Tests available for:
- Login
- Portfolio
- Transactions
- Stocks
- Wallet
- Watchlist

---

## 🌐 API Routes Overview (Backend)

| Method | Route                 | Description                  |
|--------|-----------------------|------------------------------|
| POST   | `/login`              | Authenticate user            |
| GET    | `/portfolio`          | Get user portfolio           |
| POST   | `/wallet/add`         | Add funds to wallet          |
| GET    | `/transactions`       | Get transaction history      |
| GET    | `/stocks`             | Fetch stock data             |
| GET    | `/watchlist`          | Get user watchlist           |

---

## 📸 UI Pages

- 📊 Dashboard with charts and summaries
- 📂 Portfolio manager
- 📈 Stocks and watchlist interface
- 💼 Wallet manager
- 📜 Transaction history
- 🔐 Login page

---

## 🤝 Contributing

Feel free to fork and submit pull requests! Ensure you write unit tests for any backend logic added.

---

## 📝 License

This project is licensed under the MIT License.
