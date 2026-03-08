# Sentinel: AI Disaster Preparedness Copilot

Sentinel is an AI-powered disaster preparedness assistant that monitors hazard data, detects risks near the user, and translates emergency alerts into clear, actionable response plans.

## Key Features
- Automated hazard detection via NWS, USGS, and NASA FIRMS APIs.
- AI-generated response guidance using Groq (`llama-3.3-70b-versatile`).
- Dashboard-integrated streaming chatbot (safety scope only).
- Firebase Firestore-backed profiles, alerts, and lightweight chat feedback logs.
- Mapbox-based hazard visualization.

## Tech Stack
- Frontend: Next.js (App Router), React, Lucide Icons, Mapbox GL JS.
- Backend: Next.js Route Handlers (Serverless).
- Database: Firebase (Cloud Firestore).
- AI: Groq API (`groq-sdk`).

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill:
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_CLIENT_EMAIL`
     - `FIREBASE_PRIVATE_KEY` (use escaped newlines: `\\n`)
     - `GROQ_API_KEY`
     - `NASA_FIRMS_MAP_KEY`
     - `NEXT_PUBLIC_MAPBOX_TOKEN`
3. Run dev server:
   ```bash
   npm run dev
   ```
4. Trigger hazard ingestion:
   - `GET /api/check-hazards`
5. Open dashboard:
   - `/dashboard`

## API Reference
- `GET /api/check-hazards`: Polls hazard APIs and stores new alerts in Firestore.
- `GET /api/alerts?userId={id}`: Reads alerts for a specific user from Firestore.
- `POST /api/chat/stream`: Streams Groq chat completions and stores first assistant output summary in `chat_feedback`.

## Legacy Note
- `supabase_schema.sql` is kept as a historical artifact from the previous Supabase implementation.
