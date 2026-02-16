# Game Master Quick Reference

A rapid-fire guide for running a smooth game session of "2050 — The Signal We Trusted."

## Pre-Game Checklist (5 minutes)

- [ ] Open `/admin` in your browser
- [ ] Click "Create New Game"
- [ ] Note the 6-digit access code
- [ ] Display `/screen` URL on big screen/TV
- [ ] Share player URL or access code with participants
- [ ] Wait for minimum 3 players to join
- [ ] Verify all players appear on the big screen
- [ ] Click "Start Game" when ready

## Three Views Explained

### 🖥️ Big Screen (`/screen`)
- **Purpose**: Cinematic display for the group
- **Features**: Large text, animations, CRT effects
- **Shows**: Story, voting progress, results
- **Interaction**: Read-only (no controls)

### 👑 Game Master (`/admin`)
- **Purpose**: Your control dashboard
- **Features**: Game state controls, player management
- **Shows**: All player info including secret roles
- **Interaction**: Full control over game progression

### 📱 Player (`/play`)
- **Purpose**: Individual player interface
- **Features**: Personal choices, voting, role info
- **Shows**: Only their own role and choices
- **Interaction**: Vote, make decisions

## Game Flow

### Phase 1: Lobby (Pre-Game)

**Your view (/admin):**
- See all connected players
- Remove troublemakers if needed
- Copy URLs to share

**Big screen (/screen):**
- Shows access code prominently
- Displays all connected players
- Animated "waiting" message

**Players (/play):**
- Enter access code
- Choose name and emoji
- See other connected players
- "Waiting for game master" message

**Your action:** Click "Start Game" when 3+ players ready

---

### Phase 2: Story Phases

**Your view (/admin):**
- Control panel with chapter buttons
- See current game state
- Monitor stability/conflict scores

**Big screen (/screen):**
- Large narrative text
- Cinematic presentation
- Chapter heading

**Players (/play):**
- Read story on their device
- See their secret role (if assigned)
- "Waiting for game master" message

**Your action:** Read story aloud or let players read, then click next phase button

---

### Phase 3: Voting Phases

**Your view (/admin):**
- Real-time vote tracker
- See who has/hasn't voted
- See exact choices (but don't reveal!)

**Big screen (/screen):**
- Vote progress bar
- Player avatars (green = voted)
- Percentage complete

**Players (/play):**
- See voting options
- Make their choice
- Confirmation after voting
- Can't see others' choices

**Your action:** Wait for all votes, then progress to next phase

---

### Phase 4: Results

**Your view (/admin):**
- Final statistics
- All votes visible
- "End Game" button

**Big screen (/screen):**
- Final stability score
- Final conflict score
- Hacker reveal (dramatic!)
- All players displayed

**Players (/play):**
- See the same results
- Find out who the hacker was
- See final outcome

**Your action:** Discuss results, then click "End Game" or start new game

## Control Panel Button Reference

| Button | What it Does |
|--------|-------------|
| **[ CH1: STORY ]** | Show Chapter 1 narrative |
| **[ CH1: VOTE ]** | Open Chapter 1 voting |
| **[ CH2: STORY ]** | Show Chapter 2 narrative |
| **[ CH2: VOTE ]** | Open Chapter 2 voting |
| **[ CH3: STORY ]** | Show Chapter 3 narrative |
| **[ CH3: VOTE ]** | Open Chapter 3 voting |
| **[ SHOW RESULTS ]** | Display final scores & hacker |
| **[ END GAME ]** | Finish session (can't undo!) |

## Trinity Sync: How It Works

When you click any button in `/admin`:
1. Game state updates in Supabase database (instant)
2. Supabase broadcasts change via Realtime (sub-100ms)
3. All connected devices receive update simultaneously
4. Big screen and all players update their views

**You should see**: Instant transitions across all screens. If there's lag, check internet connection.

## Troubleshooting During Game

### "Player disconnected!"

**If 1-2 players lose connection:**
- They can rejoin using the same access code
- Their role and votes are preserved
- Game continues normally

**If many players disconnect:**
- Check Wi-Fi stability
- Pause game and wait for reconnections

---

### "Votes stuck at 99%"

**Cause:** One player hasn't voted yet

**Solution:**
1. Check admin panel to see who
2. Remind them verbally
3. Check if their device is connected
4. If persistent, can skip to results

---

### "Big screen not updating"

**Immediate fixes:**
1. Refresh the screen browser
2. Check that game ID in URL is correct
3. Verify internet connection

**If problem persists:**
- Copy the screen URL again from admin
- Open in new browser window
- Check Supabase Realtime is enabled

---

### "Can't start game - need 3 players"

**Options:**
1. Wait for more players to join
2. Join yourself on another device
3. Ask someone to play multiple roles

## Best Practices

### Pacing
- **Story phases**: 2-3 minutes (read dramatically!)
- **Voting phases**: 1-2 minutes (build suspense)
- **Total game time**: 15-25 minutes for 3 chapters

### Engagement
- Read story content aloud in dramatic voice
- Add sound effects or background music
- Dim lights for atmosphere
- Build tension before vote results

### Managing Players
- Warn before starting (no going back!)
- Encourage discussion during voting
- Don't reveal who voted what
- Keep the hacker identity secret until results

## Advanced: Reading Player Roles

In admin panel, during the game, you can see:
- 🔴 **HACKER** indicator next to the infiltrator
- Each player's role
- Whether they've used abilities (future feature)

**Don't reveal this info during gameplay!** Let them figure it out socially.

## Post-Game Discussion Topics

Great debriefing questions:
1. Who suspected the hacker?
2. What clues gave them away (or didn't)?
3. Would you make different choices knowing the outcome?
4. Which chapter was most difficult?
5. Was stability or conflict more important?

## Technical Specs (For Reference)

- **Max players**: No hard limit, but 6-12 is ideal
- **Min players**: 3 (1 hacker, 2+ citizens)
- **Network**: Requires internet (Supabase hosted)
- **Devices**: Any modern browser
- **Mobile**: Fully responsive, thumb-friendly

## URLs Quick Copy

Replace `localhost:3000` with your domain if deployed:

```
Admin:   http://localhost:3000/admin
Player:  http://localhost:3000/play?code=ABC123
Screen:  http://localhost:3000/screen?game=uuid-here
```

## Emergency: Reset Everything

If something breaks catastrophically:

1. **Soft reset**: Refresh all browser windows
2. **Medium reset**: Click "End Game" and create new game
3. **Hard reset**: Go to Supabase > Table Editor > Delete game row

## Customization Ideas

Want to make it your own?

- Write custom chapter narratives
- Change vote options
- Adjust stability/conflict calculations
- Add sound effects
- Create additional roles
- Design alternate endings

---

## Final Checklist Before Starting

- [ ] All 3 views open and visible
- [ ] Big screen readable from back of room
- [ ] 3+ players connected
- [ ] Access code shared
- [ ] Everyone has their device
- [ ] Internet stable
- [ ] Atmosphere set (lights, music)
- [ ] Ready to have fun!

**Press [ START GAME ] and enjoy!** 🎮⚡🤖

---

_"In 2050, we trusted the signal. What will you trust?"_
