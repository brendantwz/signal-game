# Quick Start Guide

## ⚠️ IMPORTANT: Database Setup Required

Before you can create or join games, you **MUST** set up the database in Supabase.

### Steps:

1. **Your Supabase credentials are already configured in `.env.local`** ✅

2. **Run the database schema:**
   - Go to your Supabase dashboard: https://supabase.com/dashboard
   - Navigate to your project: `wneybpjcndrjcqkspewm`
   - Click **SQL Editor** in the left sidebar
   - Click **New Query**
   - Open the file: `supabase/schema.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor
   - Click **Run** (or press Ctrl/Cmd + Enter)

3. **Enable Realtime:**
   - Go to **Database** > **Replication**
   - Enable replication for:
     - ✅ `games`
     - ✅ `players`
     - ✅ `votes`
   - Click **Save**

4. **Verify setup:**
   - Go to **Table Editor**
   - You should see 3 tables:
     - `games`
     - `players`
     - `votes`

5. **Test the app:**
   - Make sure `npm run dev` is running
   - Go to http://localhost:3000
   - Click **[ GAME MASTER ]**
   - Click **[ CREATE GAME ]**
   - You should see a 6-digit access code!

## Current Status

✅ Next.js app running
✅ Supabase credentials configured
⚠️ Database tables need to be created (see steps above)

## If You See Errors

### "relation 'public.games' does not exist"
→ You need to run the schema.sql file in Supabase SQL Editor

### "Game not found" or loading forever
→ Enable Realtime replication for all 3 tables

### Can't connect to Supabase
→ Check your internet connection
→ Verify your Supabase project is active (not paused)

---

**Once the database is set up, everything will work perfectly!**

The navigation should now work:
- ✅ Home page buttons are centered
- ✅ Clicking buttons navigates to correct pages
- ✅ No more stuck loading screens
- ⏳ Database setup needed to create/join games
