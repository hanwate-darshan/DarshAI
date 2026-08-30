# DarshAI

DarshAI is an **AI-powered chat platform** with a **multi-agent LLM backend** and a **credit-based billing system**. It combines a modern React frontend with a Node.js microservices backend, orchestrated through LangChain/LangGraph, and is deployed on AWS via GitHub Actions.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [The Agent Graph](#the-agent-graph)
- [Data Flow](#data-flow)
- [Deployment](#deployment)
- [Getting Started](#getting-started)

---

## Features

- **AI-powered chat** with a LangGraph agent state machine routing to 14 specialized agents
- **Google OAuth** authentication via Firebase
- **Multi-agent modes**: Chat, Coding, Search, PDF, PPT, Vision, Code Runner, Data, Diagram, Resume, Translate, Video
- **File uploads**: PDF (RAG), images (analysis), CSV/Excel (data analysis)
- **Code artifacts**: rendered in the Monaco Editor
- **Voice-to-text input** via the Web Speech API
- **Conversation history** stored in MongoDB
- **Redis-backed** session management, short-term memory, and rate limiting
- **Credit-based billing** with Razorpay payments and subscription plans
- **AWS deployment** via GitHub Actions (ECS/Fargate, ECR, S3, CloudFront)

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 + Vite 8 | UI framework and build tool |
| Tailwind CSS 4 | Styling |
| Redux Toolkit | State management |
| Firebase | Google OAuth authentication |
| Monaco Editor | Code artifacts rendering |
| react-markdown + remark-gfm | Markdown rendering |
| Razorpay | Payment checkout |
| lucide-react, motion | Icons and animations |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express 5 | API framework |
| LangChain + LangGraph | Agent orchestration |
| Gemini, Groq, OpenRouter | LLM providers |
| Qdrant | Vector database (PDF RAG) |
| Tavily | Web search |
| MongoDB (Mongoose) | Primary datastore |
| Redis (ioredis) | Sessions, memory, rate limiting |
| AWS SDK (S3) | File storage with presigned URLs |
| Razorpay SDK | Payment processing |
| pdf-parse, pdfkit, pptxgenjs | Document generation |

### Infrastructure

| Technology | Purpose |
|---|---|
| Docker / docker-compose | Containerization |
| AWS ECR | Container registry |
| AWS ECS (Fargate) | Service hosting |
| AWS S3 + CloudFront | Frontend hosting |
| GitHub Actions | CI/CD pipeline |

---

## Architecture

```
┌──────────────┐     ┌─────────────────────────────────────────────────┐
│   Frontend   │     │             Backend (Microservices)             │
│  React+Vite  │────▶│  Gateway ──▶ Auth │ Chat │ Agent │ Billing     │
│  Firebase    │     │  Redis (sessions, cache, rate-limit)            │
│  Razorpay    │     │  MongoDB (users, conversations, messages)       │
└──────────────┘     └─────────────────────────────────────────────────┘
```

### Backend Services

- **Gateway** — Express.js API gateway that routes and authenticates requests to internal services
- **Auth Service** — Firebase token verification, session management, credit deduction, plan updates
- **Chat Service** — Conversation and message persistence (MongoDB)
- **Agent Service** — LangGraph state machine with 14 specialized LLM agents
- **Redis** — Session storage, conversation memory cache, per-agent rate limiting

---

## Project Structure

```
DarshAI/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline (AWS ECR/ECS/S3/CloudFront)
├── backend/
│   ├── docker-compose.yml      # Redis for local development
│   ├── gateway/                # API gateway service
│   │   ├── index.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   └── auth.middleware.js   # Session verification via Redis
│   │   ├── utils/
│   │   └── Dockerfile
│   ├── services/
│   │   ├── auth/               # Firebase auth, sessions, credits
│   │   ├── chat/               # Conversations & messages
│   │   ├── agent/              # LangGraph multi-agent backend
│   │   │   ├── agents/         # 14 specialized agents
│   │   │   ├── graph/          # LangGraph state machine (graph, router, state)
│   │   │   ├── config/         # LLM models, memory, rate limits, vector DB
│   │   │   └── controllers/
│   │   └── billing/            # Razorpay orders & payment verification
│   └── shared/
│       └── redis/              # Shared Redis client
└── frontend/
    ├── src/
    │   ├── components/         # ChatArea, ChatInput, Artifact, SideBar, etc.
    │   ├── features/           # API calls (sendMessage, createOrder, etc.)
    │   ├── pages/              # Home.jsx
    │   └── redux/              # Redux slices
    └── utils/                  # axios, firebase config
```

---

## How It Works

### 1. Authentication (Firebase Google OAuth)

1. User clicks **"Continue With Google"** on the login modal
2. Firebase popup returns an ID token
3. Frontend sends the token to `POST /api/auth/login` via the Gateway
4. **Auth Service** verifies the token with the Firebase Admin SDK, then finds or creates the MongoDB user record
5. A UUID session ID is generated and stored in **Redis** (`session-<uuid>` → user JSON) with a 7-day TTL
6. The session ID is set as an `httpOnly` cookie
7. All subsequent requests carry this cookie; the Gateway middleware (`protect`) reads it from Redis on every request

### 2. Gateway Routing

The Gateway proxies authenticated requests to internal services:

| Route | Service | Auth |
|---|---|---|
| `POST /api/auth/*` | Auth Service | No |
| `POST /api/chat/*` | Chat Service | Yes |
| `POST /api/agent/*` | Agent Service | Yes |
| `POST /api/billing/*` | Billing Service | Yes |
| `GET /api/me` | Current user (from Redis session) | Yes |

Each proxy adds `x-user-id` and `x-user-plan` headers from the session data.

### 3. Chat Flow

1. User selects or creates a conversation (sidebar)
2. User types a message, optionally selects an **agent mode** (Auto/Chat/Coding/Search/PDF/PPT/Vision/Data/Diagram/Resume/Translate/Video) and/or attaches a file (.pdf, image, .csv)
3. Frontend sends `POST /api/agent/chat` with `FormData` (prompt, conversationId, agent, file)
4. **Agent Service** receives the request:
   - Saves the user message to MongoDB via the Chat Service (`POST /save-message`)
   - Invokes the **LangGraph state machine** with the prompt

### 4. The Agent Graph (LangGraph State Machine)

The agent graph is a **LangGraph StateGraph** that routes requests through specialized LLM agents:

```
Router ──▶ Chat, Search, Coding, PDF, PPT, Vision,
           CodeRunner, Data, Diagram, Resume, Translate, Video
           (each ──▶ __end__)
           Search ──▶ Chat ──▶ __end__
```

**Router logic**:
- If the user explicitly selected an agent (not "Auto"), use that agent directly
- If a file is attached, auto-detect: `.pdf` → pdfRag, image → imageAnalyzer, `.csv` → data
- Otherwise, call an LLM with a classification prompt to determine the agent type

---

## The Agent Graph

### Available Agents (14 specialized agents)

| Agent | Function |
|---|---|
| `chat` | General conversation, explanations, learning |
| `search` | Current events, news, internet lookup (Tavily) |
| `coding` | Generate/debug code, build projects, architecture |
| `pdf` | Generate PDF documents |
| `ppt` | Generate PowerPoint presentations |
| `vision` | Generate images |
| `pdfRag` | RAG on uploaded PDFs (Qdrant vector DB) |
| `imageAnalyzer` | Analyze uploaded images |
| `codeRunner` | Execute code and return output |
| `data` | Analyze CSV/Excel data, charts, statistics |
| `diagram` | Generate Mermaid diagrams (flowchart, ERD, mindmap) |
| `resume` | Analyze resumes, ATS scores, review |
| `translate` | Translate text between languages |
| `video` | Generate video slideshows/storyboards |

### Graph State

Each invocation carries state: `prompt`, `aiResponse`, `agent`, `conversationId`, `searchResults`, `images`, `artifacts`, `userId`, `file`.

---

## Data Flow

```
User Input ──▶ Frontend (React) ──▶ Gateway (Express) ──▶ Agent Service
                                                              │
                                                              ├─▶ Router (LLM classification)
                                                              ├─▶ Specialized Agent (Chat/Coding/etc.)
                                                              ├─▶ Redis (memory, rate-limit)
                                                              ├─▶ Chat Service (save messages)
                                                              └─▶ Auth Service (deduct credits)
                                                              │
                                                              ◀── Response + artifacts + images
                                                              │
Frontend ◀──────────────────────── Gateway ◀──────────────────
```

### Memory & Context

- **Short-term memory**: Redis stores the last 20 messages per conversation (`messages-<conversationId>`) with a 24-hour TTL
- **Long-term history**: All messages persist in MongoDB (Message model)
- On each request, the agent loads history from Redis (or falls back to MongoDB) and injects it into the LLM prompt for context

### Rate Limiting & Credits

- **Rate limiting** (per agent per minute) via Redis counters: chat=20/min, coding=5/min, video=3/min, etc.
- **Credit deduction** per agent call: chat=1, coding=10, search=5, video=20, etc.
- Credits are deducted from the user's MongoDB record via the Auth Service (`POST /deduct-credits`)

### Billing (Razorpay)

1. User selects a plan in the billing drawer
2. Frontend calls `POST /api/billing/create-order` → Billing Service creates a Razorpay order
3. Frontend opens the Razorpay checkout; user completes payment
4. Frontend calls `POST /api/billing/verify-payment`
5. Billing Service verifies the HMAC signature, updates the payment record, and calls the Auth Service (`POST /update-plan`) to add credits
6. The Redis session is updated with the new credit balance

### Artifacts

Agents can return **artifacts** (code blocks, diagrams, generated content) alongside the text response. These render in the **Artifact panel** (Monaco Editor for code, Mermaid renderer for diagrams) on the right side of the UI.

---

## Deployment

CI/CD is handled by **GitHub Actions** (`.github/workflows/deploy.yml`) triggered on push to `main`:

1. **Backend** — builds 5 Docker images (gateway, auth, chat, agent, billing), pushes them to **AWS ECR**, then forces new deployments on **ECS/Fargate**
2. **Frontend** — runs `npm install` + `npm run build`, syncs `dist/` to **S3**, and invalidates **CloudFront** (`/*`)

Required GitHub secrets: `AWS_REGION`, `AWS_ACCOUNT_ID`, `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY`, `ECS_CLUSTER`, service names, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`, `VITE_FIREBASE_API_KEY`, `VITE_RAZORPAY_KEY_ID`, `VITE_SERVER_URL`.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Docker
- MongoDB (local or Atlas)
- Redis (or `docker compose up` in `backend/`)
- Firebase project (Web + Admin SDK credentials)
- Razorpay keys

### Local Setup

```bash
# 1. Start Redis
cd backend
docker compose up -d

# 2. Configure environment variables
#    backend/gateway/.env
#    backend/services/auth/.env
#    backend/services/chat/.env
#    backend/services/agent/.env
#    backend/services/billing/.env
#    frontend/.env

# 3. Start backend services (each in its own terminal)
cd backend/services/auth && npm run dev
cd backend/services/chat && npm run dev
cd backend/services/agent && npm run dev
cd backend/services/billing && npm run dev
cd backend/gateway && npm run dev

# 4. Start frontend
cd frontend
npm install
npm run dev
```

---

## Notes

- The root `backend/package.json` only lists `ioredis`; each service has its own local `node_modules` with its real dependencies
- **Redis** is required for sessions, memory caching, and rate limiting — all services share the client from `backend/shared/redis`
- The auth service requires a Firebase Admin SDK service account key (`serviceAccountKey.json`)
