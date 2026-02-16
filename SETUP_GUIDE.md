# Setup Guide for 2050 — The Signal We Trusted

This guide will walk you through setting up the complete infrastructure for the game, including Supabase configuration and local development.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Supabase account (free tier is sufficient)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Step 1: Install Dependencies

From the project root directory:

\`\`\`bash
npm install
\`\`\`

This will install:
- Next.js 14
- Supabase client library
- Framer Motion for animations
- Tailwind CSS v4
- TypeScript

## Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - **Name**: signal-game-2050 (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your location
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

## Step 3: Get Supabase Credentials

Once your project is ready:

1. Go to **Project Settings** (gear icon in sidebar)
2. Navigate to **API** section
3. You'll need two values:
   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`

## Step 4: Configure Environment Variables

1. In the project root, copy the example file:

\`\`\`bash
cp .env.example .env.local
\`\`\`

2. Edit `.env.local` and paste your credentials:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Important**: Never commit `.env.local` to version control!

## Step 5: Set Up Database Schema

1. In Supabase dashboard, click **SQL Editor** (in sidebar)
2. Click **New Query**
3. Open `supabase/schema.sql` from this project
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)

You should see success messages. This creates:
- `games` table
- `players` table
- `votes` table
- `game_status` enum type
- Helper functions and triggers

## Step 6: Enable Realtime

Critical for the "Trinity Sync" to work!

1. In Supabase dashboard, go to **Database** > **Replication**
2. Find the **Replication** section
3. Enable replication for these tables:
   - ✅ `games`
   - ✅ `players`
   - ✅ `votes`
4. Click **Save** or toggle each one individually

## Step 7: Verify Database Setup

1. Go to **Table Editor** in Supabase
2. You should see three tables:
   - `games` - with columns: id, access_code, status, etc.
   - `players` - with columns: id, game_id, name, emoji, etc.
   - `votes` - with columns: id, player_id, game_id, chapter, choice

If tables are missing, re-run the schema SQL.

## Step 8: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The application will start at:
- Main: http://localhost:3000
- Admin: http://localhost:3000/admin
- Player: http://localhost:3000/play
- Screen: http://localhost:3000/screen

## Step 9: Test the Trinity Sync

To verify realtime synchronization works:

1. **Open Admin** in browser window #1:
   - Navigate to http://localhost:3000/admin
   - Click "Create New Game"
   - Note the access code

2. **Open Screen** in browser window #2:
   - Navigate to http://localhost:3000/screen?game=[GAME_ID]
   - You'll see the game ID in the URL bar of the admin window
   - Should show "waiting for players"

3. **Open Player** on mobile or browser window #3:
   - Navigate to http://localhost:3000/play
   - Enter the access code
   - Fill in name and select emoji
   - **You should see the player appear on Screen instantly!**

4. **Start Game** from Admin:
   - Click "Start Game" button
   - **All three windows should update simultaneously**

If all three views update instantly, the Trinity Sync is working! 🎉

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"

**Solution**: Verify `.env.local` exists and contains:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
\`\`\`

Restart the dev server after adding the file.

---

### Issue: Players not appearing in real-time

**Solution**: 
1. Check that Realtime is enabled in Supabase
2. Go to Database > Replication
3. Ensure `games`, `players`, and `votes` are checked
4. Refresh all browser windows

---

### Issue: "Game not found" when joining

**Solution**:
- Verify the access code is correct (6 characters)
- Check that the game status is "LOBBY"
- Look in Supabase Table Editor > games to verify the game exists

---

### Issue: CRT overlay not showing

**Solution**: 
- Clear browser cache
- Check that `app/globals.css` has the `.crt-overlay` class
- Verify the overlay div is in `app/layout.tsx`

---

### Issue: Can't connect to Supabase

**Solution**:
1. Verify your Supabase project is active (not paused)
2. Check the Project URL is correct
3. Ensure anon key has no extra spaces or line breaks
4. Test connection in Supabase dashboard

## Production Deployment

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Option 2: Other Platforms

Works on any platform supporting Next.js 14:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

**Important**: Always add environment variables in your hosting platform!

## Security for Production

Before going live with real users:

1. **Enable Row Level Security (RLS)** in Supabase:
   \`\`\`sql
   ALTER TABLE games ENABLE ROW LEVEL SECURITY;
   ALTER TABLE players ENABLE ROW LEVEL SECURITY;
   ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
   \`\`\`

2. **Add RLS Policies** (example for games table):
   \`\`\`sql
   CREATE POLICY "Allow read access to all games"
   ON games FOR SELECT
   USING (true);

   CREATE POLICY "Allow insert for new games"
   ON games FOR INSERT
   WITH CHECK (true);
   \`\`\`

3. **Implement rate limiting** for game creation

4. **Add access code expiration** (games older than 24 hours)

5. **Use Edge Functions** for vote validation

## Next Steps

Once setup is complete:

1. Read the [README.md](README.md) for game instructions
2. Customize chapter content in future updates
3. Add your own narrative and choices
4. Experiment with different roles and abilities

## Need Help?

- Check Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Open an issue in the project repository

---

Happy gaming! May the signal guide you. 🤖⚡
