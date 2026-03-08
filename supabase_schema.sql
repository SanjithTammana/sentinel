-- Legacy file retained for reference.
-- The active runtime datastore has migrated to Firebase Firestore.

-- SQL for Supabase Editor

-- 1. Profiles Table (User Locations)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  latitude FLOAT8,
  longitude FLOAT8,
  city_name TEXT,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Alerts Table (Hazard History)
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hazard_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'weather', 'earthquake', 'wildfire'
  title TEXT NOT NULL,
  severity TEXT,
  description TEXT,
  location JSONB, -- { lat, lng }
  raw_data JSONB,
  ai_advice JSONB, -- { advice, actions, riskLevel, safeRoute }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own profiles
CREATE POLICY "Users can manage their own profiles"
ON profiles FOR ALL
USING (auth.uid() = id);

-- Allow users to read their own alerts
CREATE POLICY "Users can read their own alerts"
ON alerts FOR SELECT
USING (auth.uid() = user_id);
