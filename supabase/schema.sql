-- 2050: The Signal We Trusted - Database Schema
-- Phase 1: Core Infrastructure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Game States Enum
CREATE TYPE game_status AS ENUM (
  'LOBBY',
  'CH1_STORY',
  'CH1_VOTE',
  'CH2_STORY',
  'CH2_VOTE',
  'CH3_STORY',
  'CH3_VOTE',
  'RESULTS',
  'ENDED'
);

-- Games Table (Global State Machine)
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  access_code VARCHAR(6) UNIQUE NOT NULL,
  status game_status NOT NULL DEFAULT 'LOBBY',
  current_chapter INTEGER NOT NULL DEFAULT 0,
  stability INTEGER NOT NULL DEFAULT 50,
  conflict_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Players Table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  role VARCHAR(50),
  is_hacker BOOLEAN DEFAULT FALSE,
  ability_used BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, name)
);

-- Votes Table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  choice VARCHAR(50) NOT NULL,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id, game_id, chapter)
);

-- Indexes for Performance
CREATE INDEX idx_players_game_id ON players(game_id);
CREATE INDEX idx_votes_game_id ON votes(game_id);
CREATE INDEX idx_votes_chapter ON votes(chapter);
CREATE INDEX idx_games_access_code ON games(access_code);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE games;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE votes;

-- Function to Generate Access Code
CREATE OR REPLACE FUNCTION generate_access_code()
RETURNS VARCHAR(6) AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to Auto-Generate Access Code on Game Creation
CREATE OR REPLACE FUNCTION set_access_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.access_code IS NULL THEN
    NEW.access_code := generate_access_code();
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM games WHERE access_code = NEW.access_code) LOOP
      NEW.access_code := generate_access_code();
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_access_code
BEFORE INSERT ON games
FOR EACH ROW
EXECUTE FUNCTION set_access_code();

-- Row Level Security Policies (Optional: Enable if needed for security)
-- ALTER TABLE games ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE players ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Example: Allow all operations for now (adjust for production)
-- CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
-- CREATE POLICY "Allow all operations on votes" ON votes FOR ALL USING (true);
