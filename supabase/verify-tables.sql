-- VERIFICATION SCRIPT
-- Run this to see what tables and columns actually exist

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('games', 'players', 'votes');

-- Check games table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'games'
ORDER BY ordinal_position;

-- Check if game_status enum exists
SELECT typname 
FROM pg_type 
WHERE typname = 'game_status';
