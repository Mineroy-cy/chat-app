# chat-app


---

# Web Sockets Chat Application

A real-time chat application built with a React frontend and a Node.js/Express/MongoDB backend, utilizing WebSockets for instant messaging.

---

## Features

- User authentication (login/register)
- Real-time chat rooms
- Persistent message storage (MongoDB)
- Modern React frontend (Vite)
- RESTful API for user, room, and message management

---

## Project Structure

```
web sockets/
  client/   # React frontend (Vite)
  server/   # Node.js backend (Express, MongoDB, Socket.io)
```

---

## Deployment URLs

- **Frontend:** [[https://your-frontend-url.com](https://your-frontend-url.com](https://chat-app-frontend-ip6u.onrender.com))
- **Backend:** [[https://your-backend-url.com](https://your-backend-url.co](https://chat-app-t5dh.onrender.com)m)


---

## Local Development

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### Backend Setup

1. `cd server`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (e.g., MongoDB URI, JWT secret) in a `.env` file.
4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000` by default.

### Frontend Setup

1. `cd client`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` by default.

---

## Environment Variables


---

## Scripts

### Backend

- `npm start` — Start the backend server
- `npm run dev` — Start backend with nodemon (if configured)

### Frontend

- `npm run dev` — Start the Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

---

## License

MIT

---

## Author

Royvictor Karanja


---

## Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)

---

Let me know if you want to customize any section or add more details!
