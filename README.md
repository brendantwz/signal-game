# 2050 — The Signal We Trusted

A dystopian local-multiplayer simulation game built with Next.js 14, Supabase Realtime, and Framer Motion. Experience sub-100ms synchronization across three distinct views: Big Screen, Game Master Dashboard, and Player Devices.

![Terminal Noir Theme](https://img.shields.io/badge/theme-Terminal%20Noir-ffb000)
![Next.js 14](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E)

## NOTE TO SELF
- always plan the full project before starting to code

## 🎮 Game Overview

Set in a dystopian 2050, players navigate through three chapters of moral choices while an AI signal promises peace. One player is secretly a "hacker" trying to destabilize the system. Every choice affects the world's stability and conflict scores.

### The Trinity Sync

Three synchronized views provide a seamless multiplayer experience:

- **🖥️ /screen** - Cinematic big screen display (read-only, high-fidelity)
- **👑 /admin** - Game Master control dashboard (full control)
- **📱 /play** - Mobile-optimized player interface (voting & choices)

## ✨ Features

- ⚡ **Sub-100ms Realtime Sync** - All devices update instantly via Supabase Realtime
- 🎨 **Terminal Noir Aesthetic** - CRT scanlines, phosphor glow, monospace fonts
- 📱 **Mobile-First Player UI** - Thumb-friendly buttons, touch-optimized
- 🎭 **Secret Roles** - Hidden hacker role adds social deduction
- 📊 **Live Vote Tracking** - Real-time voting progress on all screens
- 💾 **Auto-Reconnect** - localStorage persistence survives disconnects
- 🎬 **Framer Motion** - Smooth, cinematic animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)

### Installation

1. **Clone and install dependencies:**

\`\`\`bash
cd signal-game-2050
npm install
\`\`\`

2. **Set up Supabase:**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your project URL and anon key
   - Run the SQL from `supabase/schema.sql` in the SQL Editor

3. **Configure environment variables:**

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` and add your Supabase credentials:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
\`\`\`

4. **Start the development server:**

\`\`\`bash
npm run dev
\`\`\`

5. **Open the application:**

   - Admin: http://localhost:3000/admin
   - Player: http://localhost:3000/play
   - Screen: http://localhost:3000/screen

## 🎯 How to Play

### Setup (5 minutes)

1. **Game Master opens /admin**
   - Click "Create New Game"
   - Share the 6-digit access code with players
   - Display /screen URL on a big screen/TV

2. **Players join on mobile**
   - Navigate to /play
   - Enter access code
   - Choose name and emoji avatar
   - Wait in lobby

3. **Start the game**
   - Once 3+ players are connected, click "Start Game"
   - All devices transition instantly (Trinity Sync!)

### Gameplay

1. **Story Phase**
   - Big screen displays narrative
   - Players read on their devices
   - Game Master progresses when ready

2. **Voting Phase**
   - Players make secret choices on their devices
   - Big screen shows live vote progress
   - Game Master advances after all votes

3. **Results**
   - Final stability and conflict scores revealed
   - The hacker's identity is exposed
   - Thank you screen

## 🏗️ Project Structure

\`\`\`
signal-game-2050/
├── app/
│   ├── admin/          # Game Master dashboard
│   ├── play/           # Player interface
│   ├── screen/         # Big screen display
│   ├── globals.css     # Terminal Noir theme
│   └── layout.tsx      # Root layout with CRT overlay
├── components/
│   ├── admin/          # Admin components
│   ├── play/           # Player components
│   └── screen/         # Screen components
├── hooks/
│   └── useGameState.ts # Realtime sync hook (Trinity core)
├── lib/
│   ├── supabase/       # Supabase client
│   └── types/          # TypeScript interfaces
└── supabase/
    └── schema.sql      # Database schema
\`\`\`

## 🔧 Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + Realtime)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Fonts**: JetBrains Mono
- **TypeScript**: Strict mode

## 🎨 Design System

### Terminal Noir Color Palette

- **Terminal Black**: `#0a0a0a` - Background
- **Terminal Amber**: `#ffb000` - Primary UI, text
- **Phosphor Green**: `#33ff33` - Accents, success states
- **Terminal Red**: `#ff3333` - Danger, conflict
- **Terminal Gray**: `#333333` - Panels, borders

### Typography

- **Font Family**: JetBrains Mono (monospace)
- **Weights**: 400 (regular), 500, 600, 700 (bold)

### Effects

- **CRT Scanlines**: Animated scanline overlay on all pages
- **Phosphor Glow**: Text-shadow on key elements
- **Glitch Transitions**: Quick position shifts for state changes

## 🔐 Security Notes

This is a **local multiplayer game** designed for trusted participants in the same physical space. The current implementation:

- ✅ Uses Supabase Realtime for instant synchronization
- ✅ Validates data client-side
- ⚠️ Does NOT implement Row Level Security (RLS) policies
- ⚠️ Assumes all participants are trustworthy

**For production use**, implement:
- Supabase RLS policies
- Server-side vote validation via Edge Functions
- Rate limiting
- Access code expiration

## 📝 Supabase Setup Guide

### Enable Realtime

1. Go to Database > Replication
2. Enable replication for:
   - `games`
   - `players`
   - `votes`

### Run Schema

1. Go to SQL Editor
2. Create a new query
3. Paste contents from `supabase/schema.sql`
4. Click "Run"

### Verify Setup

Check that these tables exist:
- ✓ games
- ✓ players
- ✓ votes

And that the `game_status` enum is created.

## 🎭 Game Design

### Roles

- **Citizen** (majority): Vote for stability
- **Hacker** (1 player): Secret role, can destabilize

### Scoring

- **Stability**: Starts at 50, affected by choices
- **Conflict**: Starts at 0, increases with poor decisions

### Chapters

1. **Chapter 1**: Introduction to the Signal
2. **Chapter 2**: The Glitch
3. **Chapter 3**: The Choice

Each chapter has:
- Story phase (narrative exposition)
- Vote phase (player decisions)

## 🔮 Future Enhancements

Phase 2 ideas:
- [ ] Actual chapter content and branching narratives
- [ ] Special abilities for the hacker role
- [ ] More player roles (Analyst, Guard, etc.)
- [ ] Voice narration for big screen
- [ ] Sound effects and music
- [ ] Multiple language support
- [ ] Game replay/spectator mode
- [ ] Analytics dashboard

## 🤝 Contributing

This is a personal project, but suggestions are welcome! Open an issue for:
- Bug reports
- Feature requests
- Narrative content ideas

## 📜 License

MIT License - Feel free to use this as a base for your own multiplayer games!

## 🙏 Credits

- **Font**: JetBrains Mono
- **Inspiration**: Dystopian sci-fi, social deduction games
- **Tech**: Next.js, Supabase, Framer Motion teams

---

Built with ⚡ by a human who trusts the signal... or do they? 🤖
