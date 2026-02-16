# Setup Verification Checklist

Use this checklist to verify your "2050 — The Signal We Trusted" installation is correct.

## ✅ Pre-Flight Checklist

### 1. Node.js & npm

\`\`\`bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher
\`\`\`

- [ ] Node.js 18+ installed
- [ ] npm working

---

### 2. Dependencies Installed

\`\`\`bash
ls node_modules
# Should see folders including:
# - next
# - react
# - @supabase
# - framer-motion
# - tailwindcss
\`\`\`

If missing:
\`\`\`bash
npm install
\`\`\`

- [ ] node_modules folder exists
- [ ] All dependencies installed

---

### 3. Environment Variables

\`\`\`bash
# Check file exists
ls .env.local

# On Windows:
dir .env.local
\`\`\`

Open `.env.local` and verify:
- [ ] File exists
- [ ] Contains `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Contains `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Values are not placeholders (start with `https://` and `eyJ...`)

---

### 4. Supabase Project

Log in to [supabase.com](https://supabase.com):

- [ ] Project created
- [ ] Project is active (not paused)
- [ ] Can access dashboard

---

### 5. Database Schema

In Supabase dashboard → **Table Editor**:

- [ ] `games` table exists
- [ ] `players` table exists
- [ ] `votes` table exists

If missing, run SQL from `supabase/schema.sql`:
1. Go to **SQL Editor**
2. Click **New Query**
3. Paste schema contents
4. Click **Run**

---

### 6. Realtime Enabled

In Supabase dashboard → **Database** → **Replication**:

- [ ] Replication enabled for `games`
- [ ] Replication enabled for `players`
- [ ] Replication enabled for `votes`

If not enabled:
1. Toggle each table ON
2. Click Save

---

### 7. Development Server

\`\`\`bash
npm run dev
\`\`\`

Expected output:
\`\`\`
▲ Next.js 15.2.0
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Starting...
✓ Ready in Xms
\`\`\`

- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] No console errors about Supabase

---

## 🧪 Functional Testing

### Test 1: Landing Page

1. Open http://localhost:3000
2. Should see:
   - [ ] Large "2050" title
   - [ ] "The Signal We Trusted" subtitle
   - [ ] Three navigation buttons (GAME MASTER, PLAYER, BIG SCREEN)
   - [ ] CRT scanline effect (subtle horizontal lines)
   - [ ] Terminal amber color scheme

---

### Test 2: Create Game

1. Click **[ GAME MASTER ]** or go to http://localhost:3000/admin
2. Should see:
   - [ ] "Create New Game" form
   - [ ] Feature checklist (✓ marks)
   - [ ] "[ CREATE GAME ]" button
3. Click **[ CREATE GAME ]**
4. Wait 2-3 seconds
5. Should see:
   - [ ] Lobby screen appears
   - [ ] 6-character access code displayed
   - [ ] "CONNECTED PLAYERS: 0" message
   - [ ] Three URL boxes (Access Code, Player URL, Screen URL)

**If this fails:**
- Check browser console for errors (F12)
- Verify Supabase credentials in `.env.local`
- Verify database tables exist
- Check internet connection

---

### Test 3: Big Screen

1. Copy the "SCREEN URL" from admin lobby
2. Open in **new browser window/tab**
3. Should see:
   - [ ] Large "2050" title
   - [ ] Access code displayed prominently
   - [ ] "CONNECTED: 0" message
   - [ ] "AWAITING GAME START..." message
   - [ ] Cinematic large text

**If this fails:**
- Verify game ID in URL matches
- Check Realtime is enabled in Supabase
- Refresh the page

---

### Test 4: Player Join

1. Go to http://localhost:3000/play (in **new window/tab or on mobile**)
2. Should see:
   - [ ] "ENTER ACCESS CODE" prompt
   - [ ] Input field
   - [ ] "[ CONNECT ]" button
3. Enter the 6-digit code from admin
4. Click **[ CONNECT ]**
5. Should see:
   - [ ] "ENTER YOUR NAME" screen
6. Type a name, click **[ NEXT ]**
7. Should see:
   - [ ] Grid of emoji avatars
   - [ ] 12 emoji options
8. Click any emoji
9. Should see:
   - [ ] Waiting room with your emoji and name
   - [ ] "[ YOU ]" indicator
   - [ ] "WAITING FOR GAME MASTER TO START..." message

**If this fails:**
- Verify access code is correct (case-insensitive)
- Check game is in LOBBY status (not started)
- Try a different name if "name already taken"

---

### Test 5: Trinity Sync 🔥 (Most Important!)

**This tests the core feature: realtime synchronization.**

Setup:
- Admin window (from Test 2)
- Screen window (from Test 3)
- Player window (from Test 4)

**Expected behavior:**

1. **Player joins** → Should see player appear on:
   - [ ] Admin lobby (player list updates)
   - [ ] Big screen (player grid updates)
   - **Target: Instant (sub-1 second)**

2. **Add 2nd player** (repeat Test 4 in another window/device):
   - [ ] Both players visible in admin
   - [ ] Both players visible on screen
   - [ ] Both players see each other in waiting room

3. **Click "START GAME" in admin**:
   - [ ] Admin transitions to "GAME CONTROL" screen
   - [ ] Screen transitions to "CHAPTER 1" display
   - [ ] All players see "CHAPTER 1" on their devices
   - **Target: Simultaneous (sub-1 second)**

4. **Click "[ CH1: VOTE ]" in admin**:
   - [ ] Admin shows vote tracking
   - [ ] Screen shows "DECISION IN PROGRESS"
   - [ ] Players see voting buttons
   - **Target: Simultaneous**

**If Trinity Sync fails:**
- Check Supabase Realtime is enabled
- Verify no console errors (F12 in any window)
- Check network connectivity
- Try refreshing all windows
- Verify database tables have data (check Supabase Table Editor)

---

### Test 6: Voting

With game in voting phase (from Test 5):

1. **Player 1** clicks a vote button
2. Should see:
   - [ ] Player's device shows "voted" confirmation
   - [ ] Admin shows vote count increase (1/2, 2/2, etc.)
   - [ ] Screen shows player avatar turn green
   - **Target: Instant update on all screens**

3. **Repeat for Player 2**
4. When all votes cast:
   - [ ] Admin shows 100% vote progress
   - [ ] Screen shows all avatars green

---

### Test 7: Mobile Responsiveness

Open player view on actual mobile device:

- [ ] All text readable
- [ ] Buttons large enough to tap (48px minimum)
- [ ] No horizontal scrolling
- [ ] Emoji grid fits on screen
- [ ] No text cutoff

---

### Test 8: Disconnect/Reconnect

1. **Player closes browser** (or kill tab)
2. **Player reopens** http://localhost:3000/play
3. Should see:
   - [ ] Automatically reconnects to same game
   - [ ] Shows their emoji and name
   - [ ] Doesn't need to re-join

**This tests localStorage persistence.**

If fails:
- localStorage might be disabled
- Check browser privacy settings
- Try different browser

---

## 🎨 Visual Verification

### Colors

Open any page and inspect:

- [ ] Background is near-black (`#0a0a0a`)
- [ ] Primary text is amber/orange (`#ffb000`)
- [ ] Accents are bright green (`#33ff33`)
- [ ] Buttons are amber on dark gray

### Fonts

- [ ] All text uses monospace font (JetBrains Mono)
- [ ] Characters are evenly spaced
- [ ] Numbers align properly

### Effects

- [ ] CRT scanlines visible (subtle horizontal lines)
- [ ] Headings have subtle glow
- [ ] Hover effects on buttons
- [ ] Smooth transitions when changing states

---

## 🐛 Common Issues & Fixes

### "Missing Supabase environment variables"

**Fix:**
\`\`\`bash
# Create .env.local if missing
cp .env.example .env.local

# Edit .env.local with your credentials
# Restart dev server
npm run dev
\`\`\`

---

### "Game not found" when joining

**Causes:**
- Wrong access code
- Game already started
- Game doesn't exist

**Fix:**
- Double-check access code (6 characters)
- Create a new game in admin
- Verify game exists in Supabase Table Editor

---

### Players not appearing in realtime

**Fix:**
1. Supabase → Database → Replication
2. Enable `games`, `players`, `votes`
3. Save changes
4. Refresh all browser windows
5. Try creating new game

---

### CRT effect not showing

**Fix:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Check `app/layout.tsx` has `<div className="crt-overlay" />`

---

### Build errors

**Fix:**
\`\`\`bash
# Clear .next cache
rm -rf .next

# On Windows:
rmdir /s .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
\`\`\`

---

## ✅ Final Verification

All checks passed? You're ready to play!

- [ ] All 8 functional tests passed
- [ ] Trinity Sync working (<1 second updates)
- [ ] Mobile responsive
- [ ] Visual effects present
- [ ] No console errors

## 🚀 Next Steps

1. Read **[GAME_MASTER_GUIDE.md](GAME_MASTER_GUIDE.md)** for how to run a session
2. Gather 3+ friends for testing
3. Set up a big screen for the full experience
4. Have fun with the game!

---

## 📊 Performance Benchmarks

Expected performance on modern hardware:

| Metric | Target | Acceptable |
|--------|--------|------------|
| Page load | < 1s | < 2s |
| Player join | < 2s | < 3s |
| Realtime sync | < 100ms | < 500ms |
| Vote registration | Instant | < 1s |
| State transition | Instant | < 500ms |

If slower than "Acceptable", check:
- Internet connection speed
- Supabase region (closer = faster)
- Number of browser extensions
- Device performance

---

**Setup verified?** Time to start playing! 🎮⚡

_"In 2050, we trusted the signal..."_
