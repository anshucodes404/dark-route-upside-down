## UPSIDE DOWN EVENT

A full-stack monorepo application with Next.js frontend and Express backend.

### Project Structure

```
upside-down/
├── backend/          # Express.js server
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.ts
│   ├── package.json
│   └── .env
├── frontend/         # Next.js application
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── package.json      # Root monorepo config
└── readme.md
```

### Quick Start

#### 1. Install Dependencies
From the root directory:
```bash
npm install
```

#### 2. Run Both Frontend & Backend Together
```bash
npm run dev
```
This starts:
- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:5000 (Express)

#### 3. Run Individual Services
```bash
# Backend only
npm run backend

# Frontend only
npm run frontend
```

#### 4. Build for Production
```bash
npm run build
```

#### 5. Start Production Server
```bash
npm start
```

### Installing Packages

Since this is a monorepo using npm workspaces, install packages in the respective workspace where they're needed:

**Install in Backend:**
```bash
npm install package-name -w backend
npm install package-name -w backend --save-dev
```

**Install in Frontend:**
```bash
npm install package-name -w frontend
npm install package-name -w frontend --save-dev
```

> **Note:** The root workspace is only for shared development tools (like `concurrently` for running both servers). Typically, you won't need to install packages at the root level since both frontend and backend are deployed independently.

### Backend Setup

- **Framework**: Express.js
- **Port**: 5000 (configurable in `.env`)
- **Auto-reload**: Nodemon for development

**Backend Endpoints:**
- `GET /health` - Health check
- `GET /api` - Welcome message

### Frontend Setup

- **Framework**: Next.js 16.1.1
- **Port**: 3000
- **Styling**: Tailwind CSS

### Environment Variables

Create or edit `.env` file in the backend folder:
```
PORT=5000
NODE_ENV=development
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend & backend concurrently |
| `npm run backend` | Run backend only |
| `npm run frontend` | Run frontend only |
| `npm run build` | Build both projects for production |
| `npm start` | Start production servers |
| `npm install -w backend` | Install packages in backend |
| `npm install -w frontend` | Install packages in frontend |

