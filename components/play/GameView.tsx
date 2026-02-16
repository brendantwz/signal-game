'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Game, Player, Vote } from '@/lib/types/database';
import { getChapter } from '@/lib/content/chapters';
import ChapterStory from './ChapterStory';
import VoteChoices from './VoteChoices';

interface GameViewProps {
  game: Game | null;
  players: Player[];
  currentPlayer: Player;
  votes: Vote[];
}

/**
 * GameView - Active gameplay for player
 * Shows chapter content, choices, voting UI based on game status
 */
export default function GameView({ game, players, currentPlayer, votes }: GameViewProps) {
  const chapterContent = useMemo(() => {
    if (!game) return null;
    return getChapter(game.current_chapter);
  }, [game?.current_chapter]);

  const hasVoted = useMemo(() => {
    if (!game) return false;
    return votes.some(
      (v) => v.player_id === currentPlayer.id && v.chapter === game.current_chapter
    );
  }, [votes, currentPlayer.id, game?.current_chapter]);

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#ffb000' }}>
        <div className="text-center">
          <div className="text-2xl crt-glow mb-4">[ ERROR ]</div>
          <div>Game data not found</div>
        </div>
      </div>
    );
  }

  const isStoryPhase = game.status.includes('STORY');
  const isVotePhase = game.status.includes('VOTE');

  return (
    <div className="min-h-screen p-4" style={{ background: '#0a0a0a', color: '#ffb000' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{currentPlayer.emoji}</div>
            <div>
              <div className="font-bold" style={{ color: '#ffb000' }}>{currentPlayer.name}</div>
              {currentPlayer.is_hacker && (
                <div className="text-xs" style={{ color: '#ff3333' }}>🔴 HACKER</div>
              )}
            </div>
          </div>
          <div className="text-xs" style={{ color: '#666666' }}>
            CHAPTER {game.current_chapter}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 mb-6" style={{ background: '#333333', border: '2px solid #ffb000' }}>
          {/* Story Phase */}
          {isStoryPhase && chapterContent && (
            <ChapterStory chapter={chapterContent} />
          )}

          {/* Voting Phase */}
          {isVotePhase && chapterContent && (
            <div>
              <div className="mb-6 text-center">
                <div className="text-xl font-bold mb-2 crt-glow" style={{ color: '#ffb000' }}>
                  {chapterContent.votePhase.question}
                </div>
                <div className="text-sm" style={{ color: '#666666' }}>
                  {chapterContent.votePhase.description}
                </div>
              </div>
              
              <VoteChoices
                gameId={game.id}
                playerId={currentPlayer.id}
                chapter={game.current_chapter}
                choices={chapterContent.votePhase.choices}
                hasVoted={hasVoted}
              />
            </div>
          )}

          {/* Results Phase */}
          {game.status === 'RESULTS' && (
            <div className="text-center">
              <div className="text-2xl font-bold mb-4 crt-glow-green" style={{ color: '#33ff33' }}>
                [ CALCULATING RESULTS ]
              </div>
              <div className="text-sm" style={{ color: '#666666' }}>
                The consequences of your choices are being processed...
              </div>
            </div>
          )}
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 text-center" style={{ background: '#333333', border: '2px solid #33ff33' }}>
            <div className="text-xs mb-2" style={{ color: '#666666' }}>STABILITY</div>
            <div className="text-4xl font-bold" style={{ color: '#33ff33' }}>{game.stability}</div>
          </div>
          <div className="p-4 text-center" style={{ background: '#333333', border: '2px solid #ff3333' }}>
            <div className="text-xs mb-2" style={{ color: '#666666' }}>CONFLICT</div>
            <div className="text-4xl font-bold" style={{ color: '#ff3333' }}>{game.conflict_score}</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
