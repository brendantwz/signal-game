# Phase 2: Game Content & Mechanics - Implementation Plan

## 🎯 Overview

Transform the infrastructure into a complete, playable game with:
- Full narrative content for 3 chapters
- Working role abilities (Hacker + Citizens)
- Vote consequences affecting game outcomes
- Enhanced UI for story presentation

---

## 📋 Architecture Decisions

### 1. Content Storage Strategy

**Decision**: Store chapter content in TypeScript constants (not database)
**Rationale**:
- Narratives are static content (not user-generated)
- No need for real-time updates on story text
- Easier version control and editing
- Better TypeScript type safety

**Structure**:
```typescript
// lib/content/chapters.ts
interface ChapterContent {
  id: number;
  title: string;
  storyPhase: {
    text: string[];  // Array for paragraph breaks
    screenText: string[];  // Alternative text for big screen
  };
  votePhase: {
    question: string;
    description: string;
    choices: {
      id: string;
      label: string;
      description: string;
      consequences: {
        stability: number;
        conflict: number;
      };
    }[];
  };
}
```

### 2. Abilities System

**Decision**: Use database column `ability_used` + client-side ability definitions
**Rationale**:
- Database tracks if ability was used (prevents double-use)
- Ability logic lives in code (more flexible)
- Admin can see who used abilities

**Abilities Structure**:
```typescript
// lib/abilities/roles.ts
interface RoleAbility {
  roleId: string;
  name: string;
  description: string;
  timing: 'once' | 'per-chapter' | 'unlimited';
  execute: (gameState, playerId) => Promise<void>;
}
```

**Phase 2 Abilities**:
1. **Hacker**: "Double Vote" - Vote counts 2x on one chapter
2. **Citizen**: No special ability (default role)

### 3. Vote Consequences System

**Decision**: Calculate outcomes on server when admin progresses phase
**Rationale**:
- Prevents client-side tampering
- Centralized logic for consistency
- Admin controls when consequences apply

**Implementation**: API route `/api/game/tally-votes`

---

## 🎮 Game Flow Enhancement

### Current Flow (Phase 1)
```
Admin: Create → Start → Manual phase changes
Players: Join → Wait → See basic UI
Screen: Show players → Show status
```

### Enhanced Flow (Phase 2)
```
Admin: Create → Start → Read story → Trigger vote → See results → Apply consequences
Players: Join → Wait → Read story → Vote with descriptions → See ability UI → Results
Screen: Cinematic story display → Live vote drama → Consequences animation → Results
```

---

## 📝 Implementation Tasks

### Task 1: Chapter Content System (30 min)
**Priority**: High
**Files**:
- `lib/content/chapters.ts` - Chapter definitions
- `lib/content/types.ts` - Content interfaces

**Content**:
- Chapter 1: "The First Signal" - Introduction to the AI, first doubt
- Chapter 2: "The Glitch" - System shows cracks, trust breaks
- Chapter 3: "The Choice" - Final decision, revelation

**Each chapter**:
- 3-5 paragraphs of story (150-200 words)
- 2 meaningful choices with clear consequences
- Stability/conflict modifiers

### Task 2: Enhanced Story Display Components (20 min)
**Priority**: High
**Files**:
- `components/screen/ChapterStory.tsx` - Cinematic story display
- `components/play/ChapterStory.tsx` - Mobile-friendly story
- `components/admin/ChapterControl.tsx` - Story admin view

**Features**:
- Auto-advance paragraphs (or manual for admin)
- Text animations (typewriter effect optional)
- Chapter headers with atmospheric styling

### Task 3: Vote Choices UI (20 min)
**Priority**: High
**Files**:
- `components/play/VoteChoices.tsx` - Replace placeholder buttons
- `components/screen/VoteProgress.tsx` - Enhanced progress display

**Features**:
- Show choice descriptions
- Indicate consequences (vague hints, not exact numbers)
- Confirmation after vote
- Visual feedback

### Task 4: Vote Tallying Logic (25 min)
**Priority**: High
**Files**:
- `app/api/game/tally-votes/route.ts` - Server-side calculation
- `lib/game/voting.ts` - Vote counting utilities

**Logic**:
```typescript
function tallyVotes(votes: Vote[], players: Player[]) {
  // Count votes per choice
  // Apply hacker double-vote if used
  // Determine winning choice
  // Calculate stability/conflict changes
  // Update game table
}
```

### Task 5: Hacker Ability System (25 min)
**Priority**: Medium
**Files**:
- `components/play/AbilityUI.tsx` - Ability activation button
- `lib/abilities/hacker.ts` - Hacker ability logic
- Database: Use existing `ability_used` column

**Features**:
- Show ability to hacker only (check `is_hacker`)
- "Double Vote" button during vote phase
- Visual indicator when ability is active
- Disable after use

### Task 6: Consequences & Scoring (20 min)
**Priority**: Medium
**Files**:
- `lib/game/consequences.ts` - Apply vote outcomes
- `components/screen/ConsequenceAnimation.tsx` - Visual feedback

**Features**:
- Update stability/conflict based on vote results
- Show changes with animation (+/- indicators)
- Threshold checks (stability < 30 = bad ending)

### Task 7: Enhanced Results Screen (15 min)
**Priority**: Medium
**Files**:
- Update `components/screen/ScreenResults.tsx`
- Add scoring breakdown

**Features**:
- Show choice history for each chapter
- Explain how scores were calculated
- Different endings based on final stability

### Task 8: Game State Management Helper (15 min)
**Priority**: Low (Nice to have)
**Files**:
- `lib/game/stateManager.ts` - Helper functions

**Utilities**:
- `getCurrentChapterContent(gameStatus)`
- `getAvailableChoices(chapter)`
- `canUseAbility(player, game)`

---

## 🎨 UX Improvements

### Admin Enhancements
1. "Read Story Aloud" mode - auto-advance with timing
2. Vote summary with choice descriptions
3. Ability usage indicators
4. Undo last action (optional)

### Player Enhancements
1. Story text with better formatting
2. Choice cards instead of plain buttons
3. Ability tutorial/tooltip
4. Vote history (what they voted in previous chapters)

### Screen Enhancements
1. Chapter transitions with glitch effect
2. Consequence reveals with dramatic pause
3. Vote tally animation (counting up)
4. Cinematic ending sequences

---

## 📊 Data Schema Additions

**No new tables needed!** ✅

Existing schema supports everything:
- `games.status` - Tracks chapter/phase
- `games.stability` + `conflict_score` - Outcome tracking
- `players.role` + `is_hacker` - Role system
- `players.ability_used` - Ability tracking
- `votes.choice` - Vote storage

**Possible optimization**: Add `vote_weight` column to votes table for double-vote
```sql
ALTER TABLE votes ADD COLUMN vote_weight INTEGER DEFAULT 1;
```

---

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Create game, join with 3+ players
- [ ] One player gets hacker role
- [ ] Story displays correctly on all views
- [ ] Vote choices show with descriptions
- [ ] Hacker can activate double-vote
- [ ] Vote tallying calculates correctly
- [ ] Stability/conflict updates based on votes
- [ ] Results show accurate breakdown
- [ ] Can play through all 3 chapters

### Edge Cases to Handle
- Player disconnects mid-vote
- Hacker leaves game
- All players vote same choice
- Stability reaches 0 or 100
- Ability used but vote not cast

---

## 📦 File Organization

```
lib/
  content/
    chapters.ts          (NEW) - Chapter content
    types.ts             (NEW) - Content interfaces
  abilities/
    hacker.ts            (NEW) - Hacker ability
    types.ts             (NEW) - Ability interfaces
  game/
    voting.ts            (NEW) - Vote logic
    consequences.ts      (NEW) - Outcome calculations
    stateManager.ts      (NEW) - Helper utilities

app/api/
  game/
    tally-votes/
      route.ts           (NEW) - Vote tallying endpoint

components/
  play/
    VoteChoices.tsx      (NEW) - Replace GameView voting
    AbilityUI.tsx        (NEW) - Ability activation
    ChapterStory.tsx     (NEW) - Story display for players
  
  screen/
    ChapterStory.tsx     (NEW) - Replace ScreenStory
    ConsequenceAnimation.tsx (NEW) - Visual feedback
  
  admin/
    ChapterControl.tsx   (NEW) - Better admin controls
```

---

## 🚀 Implementation Order

### Phase 2A: Core Content (1 hour)
1. ✅ Create chapter content system
2. ✅ Write all 3 chapters
3. ✅ Build vote choices UI
4. ✅ Implement vote tallying

### Phase 2B: Abilities (45 min)
5. ✅ Build ability UI
6. ✅ Implement hacker double-vote
7. ✅ Add ability indicators

### Phase 2C: Polish (45 min)
8. ✅ Enhance story displays
9. ✅ Add consequence animations
10. ✅ Improve results screen

**Total Estimated Time**: 2.5 - 3 hours

---

## 💡 Future Enhancements (Phase 3+)

### Additional Roles (Post-Phase 2)
- **Analyst**: See one player's vote before casting own
- **Guard**: Protect stability from negative consequences (once)
- **Infiltrator**: Change one vote after it's cast

### Advanced Features (Post-Phase 2)
- Multiple narrative paths (branches)
- Random events between chapters
- Player-to-player interactions
- Voice narration support
- Save/load game states

---

## ✅ Success Criteria

Phase 2 is complete when:
1. ✅ All 3 chapters have full narrative content
2. ✅ Voting affects stability/conflict scores
3. ✅ Hacker ability works and is tracked
4. ✅ Game has clear win/lose conditions
5. ✅ Results screen shows meaningful breakdown
6. ✅ Can play full game from start to finish
7. ✅ No redundant code, optimized implementations

---

## 🎯 Ready to Implement?

**Review this plan and confirm:**
- Content strategy (TypeScript constants vs database)?
- Ability system approach?
- Implementation order?
- Any features to add/remove/modify?

Once approved, I'll proceed with implementation in the order specified above.
