# Expense Tracker Backend (Express + MongoDB)

A clean, production-ready REST API for a MERN Expense Tracker. Features auth (JWT), CRUD for transactions, filtering, pagination and stats.

## Quick Start

1. Install Node.js 18+.
2. Open a terminal in this folder and run:
   ```bash
   npm install
   cp .env.example .env  # On Windows, use: copy .env.example .env
   ```
3. Edit `.env` and set `MONGO_URI` and `JWT_SECRET`.
4. Start the server:
   ```bash
   npm run dev
   # or
   npm start
   ```
5. Test the API (examples):
   ```bash
   # Register
   curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Divyansh\", \"email\":\"me@example.com\", \"password\":\"secret123\"}"

   # Login
   curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"me@example.com\", \"password\":\"secret123\"}"
   # Response contains { token }

   # Create transaction (replace <TOKEN>)
   curl -X POST http://localhost:4000/api/transactions -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d "{\"amount\":1500, \"type\":\"expense\", \"category\":\"Food\", \"note\":\"Zomato\"}"

   # List transactions (with optional filters)
   curl -X GET "http://localhost:4000/api/transactions?from=2025-01-01&to=2025-12-31&limit=5&page=1" -H "Authorization: Bearer <TOKEN>"

   # Stats (optionally by year)
   curl -X GET "http://localhost:4000/api/transactions/stats?year=2025" -H "Authorization: Bearer <TOKEN>"
   ```

## Routes

- `POST /api/auth/register` – register user
- `POST /api/auth/login` – login and receive JWT
- `GET /api/auth/me` – get current user (requires Bearer token)
- `POST /api/transactions` – create
- `GET /api/transactions` – list (filters: `from`, `to`, `type`, `category`, `page`, `limit`)
- `GET /api/transactions/stats` – totals + monthly (by `year`)
- `PATCH /api/transactions/:id` – update
- `DELETE /api/transactions/:id` – delete

## Notes
- Set `NODE_ENV=production` to hide error stack traces in responses.
- Default DB name for local MongoDB is `expense_tracker`. On Atlas, the db name is determined by the connection string.
