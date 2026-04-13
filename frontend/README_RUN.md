# How to Run Your Project 🚀

You have 3 options to run this project!

## Option 1: The One-Click Way (Recommended if you have Node.js)
This runs the Frontend and a JavaScript version of the Blockchain Backend simultaneously. It requires **no extra tools** besides Node.js.

1.  Open your terminal in the project root.
2.  Run:
    ```bash
    npm run dev
    ```
3.  **Frontend**: [http://localhost:3000](http://localhost:3000)
4.  **Backend API**: [http://localhost:8080/api/blockchain/chain](http://localhost:8080/api/blockchain/chain)

---

## Option 2: The Pro Way (Requires Docker Desktop)
This runs the full **Kotlin Backend**, React Frontend, and an IPFS node together.

1.  Make sure Docker Desktop is running.
2.  In your terminal, run:
    ```bash
    docker-compose up --build
    ```
3.  This is the most "full working" version as it includes a local IPFS node.

---

## Option 3: Manual Startup (Separate Terminals)
Good if you want to see exactly what's happening in each part.

### Terminal 1 - Frontend
```bash
npm start
```

### Terminal 2 - Backend (JavaScript)
```bash
cd backend-js
npm install
node server.js
```

---

## 🛠 Features to Test
1.  **Login/Register**: Use the UI to generate your public/private keys.
2.  **Create Evidence**: Upload a file (PDF/JPG) and metadata.
3.  **Mining**: Go to the Evidence List and click **"Mine Pending Blocks"**.
    - This is the **Proof-of-Work** mining logic. It will take a few seconds and then confirm your evidence on the chain.

## 💾 Storage Note
By default, the blockchain is **in-memory**. If you restart the backend, the chain will reset. This is perfect for testing without creating permanent database files on your computer.

---
Enjoy your blockchain project!
