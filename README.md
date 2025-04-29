# E-Commerce Project

A full-stack e-commerce app with a React + Vite frontend and a Node.js (Express) + MySQL backend.

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/) database running

---

### 1. Backend Setup

1. **Install dependencies:**

    ```bash
    cd backend  # or your backend folder name
    npm install
    ```

2. **Configure Database:**

    - Update your MySQL credentials in `config/db.js`
    - Make sure your database and tables are created and accessible.

3. **Start the backend server:**

    ```bash
    npm run dev
    ```
    Or, if not available:
    ```bash
    node index.js
    ```

    The backend runs by default at [http://3.145.109.156:5001](http://3.145.109.156:5001).

---

### 2. Frontend Setup (React + Vite)

1. **Install dependencies:**

    ```bash
    cd frontend  # or your frontend folder name
    npm install
    ```

2. **(Optional) Configure API URLs:**

    - Make sure API calls in your React app point to `http://3.145.109.156:5001` (backend URL).

3. **Start the frontend:**

    ```bash
    npm run dev
    ```

    The frontend runs at [http://3.145.109.156:5173](http://3.145.109.156:5173) by default.

---

### 3. Usage

- Visit [http://3.145.109.156:5173](http://3.145.109.156:5173) in your browser to use the app.
- Ensure the backend server (`http://3.145.109.156:5001`) is running.

---

### 4. Troubleshooting

- **CORS errors:**  
  Make sure your backend uses the `cors` middleware.

- **Database errors:**  
  Double-check credentials and schema in `config/db.js`. Ensure MySQL server is running.

---

### 5. Useful Scripts

- `npm run dev` — Start the server in development mode (if available)
- `npm start` — Start the server (backend or frontend, depending on folder)

---

## License

MIT

