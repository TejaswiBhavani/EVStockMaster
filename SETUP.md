# Secure Gemini Integration Setup

This repo includes a secure pattern for using Gemini without exposing your API key to the browser.

## What was added
- Node proxy service at `server/` that holds the `GEMINI_API_KEY` server-side and exposes `POST /api/chat`.
- React chat (`src/components/Chat/ChatBot.jsx`) now calls the proxy instead of calling Gemini directly.
- Streamlit helper (`utils/gemini_client.py`) reads the key from secrets/env and is used as the first choice; existing keyword responses remain as fallback.
- `.gitignore` updated so real secrets are never committed. Example templates are included.

## Local development
1. Proxy server
   - Copy `server/.env.example` to `server/.env` and set `GEMINI_API_KEY`.
   - Install and run:
     ```bash
     cd server
     npm install
     npm run dev
     ```
   - The server listens on `http://localhost:8080` by default.

2. Frontend (React) configuration
   - Optionally create `.env` at the repo root and set:
     ```
     REACT_APP_API_BASE_URL=http://localhost:8080
     ```
   - If unset, the chat will use same-origin `/api/chat`.

3. Streamlit
   - Copy `.streamlit/secrets.toml.example` to `.streamlit/secrets.toml` and set `GEMINI_API_KEY`.
   - Run Streamlit as you normally do; if the secret is missing or the call fails, the app falls back to its existing keyword-based responses.

## Deployment notes
- Never commit real secrets. Store them in your hosting provider or GitHub Actions secrets.
- If serving the React app and the proxy behind the same domain, route `/api/*` to the Node service.
- If hosting separately, set `REACT_APP_API_BASE_URL` to the proxy origin.
- Rotate keys if they're ever exposed.