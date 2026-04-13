# Evidence Management Blockchain Project

This is a full-stack blockchain project featuring a custom **Kotlin Backend** with Proof-of-Work mining and a **React Frontend** for managing evidence.

## Features
- **Kotlin Blockchain**: A custom-built blockchain implementation in Kotlin.
- **Proof-of-Work Mining**: Miners solve a computational puzzle to commit transactions to the chain.
- **Evidence Management**: Securely store evidence metadata on the blockchain and files on IPFS.
- **Dockerized**: Entire stack runs with one command.

## Project Structure
- `/src`: React Frontend (Evidence Manager UI)
- `/backend-kotlin`: Kotlin/Spring Boot Backend (Blockchain & Mining logic)
- `docker-compose.yml`: Orchestration for Frontend, Backend, and IPFS node.

## How to Run

### Prerequisites
- Docker & Docker Compose

### Fast Start
1. Open a terminal in the project root.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Access the components:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:8080/api/blockchain/chain](http://localhost:8080/api/blockchain/chain)
   - **IPFS Gateway**: [http://localhost:8081/ipfs/](http://localhost:8081/ipfs/)

## Workflow
1. **Register/Login**: Use the frontend to create your cryptographic keys.
2. **Submit Evidence**: Upload a file and give it a title. The file goes to IPFS, and the metadata goes to the "Pending Transactions" pool in the Kotlin backend.
3. **Mine**: Click the **"Mine Pending Blocks"** button on the Evidence List page. This triggers the Kotlin backend to perform Proof-of-Work mining.
4. **View**: Once mined, the evidence appears in the list, secured by the blockchain hash.

## Backend Endpoints (Kotlin)
- `GET /api/blockchain/chain`: Returns the entire blockchain.
- `POST /api/blockchain/transaction`: Adds a new evidence transaction to the pool.
- `POST /api/blockchain/mine?minerAddress=...`: Starts the mining process.
- `GET /api/blockchain/is_valid`: Validates the integrity of the chain.

---
Created by Antigravity AI
