# AI Interview Mocker

A full-stack AI-powered interview preparation platform built with React, Node.js, Express, MongoDB, and OpenAI.

## Features

- **AI-Generated Questions** — Get tailored technical, behavioral, and HR interview questions based on your role and tech stack
- **Resume Analysis** — Upload your resume for AI-powered scoring, skill detection, and improvement suggestions
- **Voice Interviews** — Practice speaking your answers with real-time speech recognition
- **Detailed AI Feedback** — Receive per-answer scoring on technical accuracy, communication, and confidence
- **Analytics Dashboard** — Track progress over time with score trends, topic performance, and insights
- **Secure Authentication** — JWT + refresh tokens, bcrypt password hashing

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS
- React Router DOM
- Zustand (state management)
- React Hook Form + Zod (validation)
- Framer Motion (animations)
- Recharts (analytics charts)
- Axios

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT + Refresh Tokens + bcrypt
- Multer + Cloudinary (file uploads)
- OpenAI API (AI integration)
- Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- OpenAI API key
- Cloudinary account

### Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your environment variables in .env
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=AI Interview Mocker
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/profile` — Get profile
- `PUT /api/auth/profile` — Update profile
- `PUT /api/auth/change-password` — Change password
- `POST /api/auth/upload-avatar` — Upload avatar
- `POST /api/auth/refresh-token` — Refresh JWT

### Resume
- `POST /api/resume/upload` — Upload & analyze resume
- `GET /api/resume` — Get user resumes
- `DELETE /api/resume/:id` — Delete resume

### Interview
- `POST /api/interview/generate` — Generate AI interview
- `POST /api/interview/start/:id` — Start interview
- `POST /api/interview/answer` — Submit answer (get AI feedback)
- `POST /api/interview/finish/:id` — Finish interview
- `GET /api/interview/list` — List user interviews
- `GET /api/interview/:id` — Get interview details

### Analytics
- `GET /api/analytics/dashboard` — Get analytics dashboard data

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # DB, Cloudinary, OpenAI config
│   │   ├── controllers/    # Route handlers
│   │   ├── middlewares/    # Auth, upload, validation, error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes
│   │   ├── services/       # AI service
│   │   ├── utils/          # Helpers, error class, async handler
│   │   ├── validators/     # Zod schemas
│   │   ├── app.js          # Express app
│   │   └── server.js       # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI + layout components
│   │   ├── lib/            # Axios instance
│   │   ├── pages/          # Page components
│   │   ├── routes/         # Protected route
│   │   ├── stores/         # Zustand stores
│   │   ├── utils/          # Helper functions
│   │   ├── validators/     # Zod schemas
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   └── package.json
└── README.md
```

## License

MIT
