'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Game, Player, Vote } from '@/lib/types/database';
import { getChapter } from '@/lib/content/chapters';
import ChapterStory from './ChapterStory';

interface ScreenStoryProps {
  game: Game;
  players: Player[];
  votes: Vote[];
}

export default function ScreenStory({ game, players, votes }: ScreenStoryProps) {
  const isStoryPhase = game.status.includes('STORY');
  const isVotePhase = game.status.includes('VOTE');
  
  const chapterContent = useMemo(() => {
    return getChapter(game.current_chapter);
  }, [game.current_chapter]);

  const currentChapterVotes = votes.filter((v) => v.chapter === game.current_chapter);
  const votePercentage = players.length > 0
    ? Math.round((currentChapterVotes.length / players.length) * 100)
    : 0;

  return (
    <div className="min-h-screen flex flex-col p-8" style={{ background: '#0a0a0a', color: '#ffb000' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-start mb-12"
      >
        <div>
          <h1 className="text-5xl font-bold crt-glow mb-2" style={{ color: '#ffb000' }}>
            CHAPTER {game.current_chapter}
          </h1>
          <div style={{ color: '#33ff33' }}>
            {isStoryPhase && '[ STORY MODE ]'}
            {isVotePhase && '[ VOTING IN PROGRESS ]'}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-sm mb-1" style={{ color: '#666666' }}>STABILITY</div>
            <div className="text-4xl font-bold" style={{ color: '#33ff33' }}>{game.stability}</div>
          </div>
          <div className="text-center">
            <div className="text-sm mb-1" style={{ color: '#666666' }}>CONFLICT</div>
            <div className="text-4xl font-bold" style={{ color: '#ff3333' }}>
              {game.conflict_score}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center">
        {isStoryPhase && chapterContent && (
          <ChapterStory chapter={chapterContent} />
        )}

        {isVotePhase && chapterContent && (
          <motion.div
            key={`vote-${game.status}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-6xl"
          >
            {/* Vote Question */}
            <div className="text-center mb-12">
              <div className="text-4xl font-bold mb-4 crt-glow" style={{ color: '#ffb000' }}>
                {chapterContent.votePhase.question}
              </div>
              <div className="text-xl" style={{ color: '#666666' }}>
                {chapterContent.votePhase.description}
              </div>
            </div>

            {/* Vote Progress */}
            <div className="mb-12">
              <div className="text-3xl text-center mb-6" style={{ color: '#ffb000' }}>
                [ DECISION IN PROGRESS ]
              </div>
              
              <div className="p-8" style={{ background: '#333333', border: '4px solid #ffb000' }}>
                <div className="flex justify-between mb-4 text-2xl" style={{ color: '#ffb000' }}>
                  <span>Votes Cast:</span>
                  <span className="font-bold">
                    {currentChapterVotes.length} / {players.length}
                  </span>
                </div>
                <div className="w-full h-8" style={{ background: '#0a0a0a', border: '2px solid #33ff33' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${votePercentage}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                    style={{ background: '#33ff33' }}
                  />
                </div>
                <div className="text-right mt-2 text-xl" style={{ color: '#33ff33' }}>
                  {votePercentage}% Complete
                </div>
              </div>
            </div>

            {/* Players Voting Status */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {players.map((player, index) => {
                const hasVoted = currentChapterVotes.some(
                  (v) => v.player_id === player.id
                );
                
                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-center p-4 border-2"
                    style={{
                      background: hasVoted ? '#33ff33' : '#333333',
                      borderColor: hasVoted ? '#33ff33' : '#666666',
                      color: hasVoted ? '#0a0a0a' : '#ffb000',
                    }}
                  >
                    <div className="text-4xl mb-2">{player.emoji}</div>
                    <div className="text-sm font-bold truncate">
                      {player.name}
                    </div>
                    {hasVoted && (
                      <div className="text-xs mt-1">✓ VOTED</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer - Players Count */}
      <div className="text-center" style={{ color: '#666666' }}>
        [ {players.length} PLAYERS CONNECTED ]
      </div>
    </div>
  );
}
