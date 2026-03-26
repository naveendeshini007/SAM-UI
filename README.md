# 🚀 Frontend

Frontend application built with **React + TypeScript + Vite + Tailwind CSS**

---

## 🧱 Tech Stack

* React (TypeScript)
* Vite
* Tailwind CSS
* Axios
* ESLint (Flat Config)

---

## 📁 Project Structure

```
src/
├── components/      # Reusable UI components
├── features/        # Feature-based modules (auth, users, etc.)
├── pages/           # Route-level pages
├── routes/          # Routing configuration
├── services/        # API layer (Axios, config)
├── utils/           # Helper functions
├── App.tsx
└── main.tsx
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---


## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

### Note: Run 'npm run' for multiple options

## Unit Tesing

### 1. Running Test

```bash
npm vitest run
```

### 2. Run Test in Watch mode

```bash
npm vitest
```

### 3. Run Test in UI mode

```bash
npm vitest --ui
```

### 4. For Code Coverage

```bash
npm vitest run --coverage
```

App runs on:
👉 http://localhost:5173/

---

## 🏗️ Architecture

* **services/api.ts** → Global Axios configuration
* **features/** → Feature-based modular structure
* **.env** → Environment-specific configuration

---

## 🔐 Best Practices

* Do not hardcode API URLs
* Use feature-based structure
* Keep business logic inside `features/`
* Use services layer for API calls

---

## 🚀 Future Improvements

* Authentication (JWT)
* Protected routes
* State management (Zustand/Redux)
* Docker setup

---

## 👨‍💻 Backend

This frontend connects to a FastAPI backend.

---

## 📌 Notes

* Tailwind CSS is used for styling
* ESLint is configured using modern flat config
* Vite is used for fast development

---
