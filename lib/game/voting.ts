// Vote Tallying and Consequences Logic

import type { Vote, Player } from '@/lib/types/database';
import type { VoteChoice } from '@/lib/content/types';

export interface VoteTallyResult {
  winningChoice: string;
  voteBreakdown: Record<string, number>;
  stabilityChange: number;
  conflictChange: number;
  totalVotes: number;
}

/**
 * Tally votes and calculate consequences
 * Accounts for hacker double-vote ability
 */
export function tallyVotes(
  votes: Vote[],
  players: Player[],
  choices: VoteChoice[]
): VoteTallyResult {
  // Count votes by choice (with double-vote for hacker if ability was used)
  const voteCounts: Record<string, number> = {};
  
  votes.forEach((vote) => {
    const player = players.find((p) => p.id === vote.player_id);
    const weight = player?.is_hacker && player?.ability_used ? 2 : 1;
    
    voteCounts[vote.choice] = (voteCounts[vote.choice] || 0) + weight;
  });

  // Determine winning choice
  let winningChoice = choices[0].id;
  let maxVotes = 0;

  Object.entries(voteCounts).forEach(([choiceId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      winningChoice = choiceId;
    }
  });

  // Get consequences from winning choice
  const winningChoiceData = choices.find((c) => c.id === winningChoice);
  const stabilityChange = winningChoiceData?.consequences.stability || 0;
  const conflictChange = winningChoiceData?.consequences.conflict || 0;

  return {
    winningChoice,
    voteBreakdown: voteCounts,
    stabilityChange,
    conflictChange,
    totalVotes: votes.length,
  };
}

/**
 * Apply vote consequences to game state
 */
export function applyConsequences(
  currentStability: number,
  currentConflict: number,
  stabilityChange: number,
  conflictChange: number
): { newStability: number; newConflict: number } {
  // Apply changes with bounds (0-100)
  const newStability = Math.max(0, Math.min(100, currentStability + stabilityChange));
  const newConflict = Math.max(0, Math.min(100, currentConflict + conflictChange));

  return { newStability, newConflict };
}
