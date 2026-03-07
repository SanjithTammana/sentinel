# Sentinel: AI Disaster Preparedness Copilot

Sentinel is an AI-powered disaster preparedness assistant that monitors real-time hazard data, detects risks near the user, and translates raw emergency alerts into clear, personalized action plans.

## Key Features
- **Automated Hazard Detection**: Polls NWS (Weather), USGS (Earthquakes), and NASA FIRMS (Wildfires) APIs.
- **AI-Generated Action Plans**: Uses LLMs to translate technical data into human-readable steps.
- **Location-Aware**: Monitors hazards within specific radii of the user's location.
- **Interactive Map**: Visualizes hazards and safe zones using Mapbox.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Lucide Icons, Mapbox GL JS.
- **Backend**: Next.js Route Handlers (Serverless).
- **Database**: Supabase (PostgreSQL).
- **AI**: OpenAI / GPT-4.

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in the following:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `NASA_FIRMS_MAP_KEY`
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
4. **Initialize Database**:
   Run the SQL provided in `supabase_schema.sql` in your Supabase SQL Editor.
5. **Run the development server**:
   ```bash
   npm run dev
   ```
6. **Simulate Hazard Check**:
   Trigger the hazard detection logic by hitting the API endpoint (requires Supabase profiles to be set up):
   `GET /api/check-hazards`

## API Reference
- `GET /api/check-hazards`: Polls external APIs and updates the database with new hazards. Designed for use with Vercel Cron.
- `GET /api/alerts?userId={id}`: Retrieves alerts for a specific user.
