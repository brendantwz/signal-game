'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Game, Player, Vote } from '@/lib/types/database';
import { determineEnding } from '@/lib/content/chapters';

interface ScreenResultsProps {
  game: Game;
  players: Player[];
  votes: Vote[];
}

export default function ScreenResults({ game, players, votes }: ScreenResultsProps) {
  const hacker = players.find((p) => p.is_hacker);
  const ending = useMemo(() => {
    return determineEnding(game.stability, game.conflict_score);
  }, [game.stability, game.conflict_score]);

  return (
    <div className="min-h-screen bg-terminal-black flex flex-col items-center justify-center p-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <h1 className="text-8xl font-bold crt-glow mb-6">
          {game.status === 'ENDED' ? 'GAME OVER' : 'RESULTS'}
        </h1>
        <div className="text-4xl text-terminal-green crt-glow-green">
          2050 — The Signal We Trusted
        </div>
      </motion.div>

      {/* Final Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 gap-12 mb-16"
      >
        <div className="bg-terminal-gray border-4 border-terminal-green p-12 text-center min-w-[300px]">
          <div className="text-2xl text-terminal-gray-light mb-4">
            FINAL STABILITY
          </div>
          <div className="text-8xl font-bold">{game.stability}</div>
        </div>

        <div className="bg-terminal-gray border-4 border-terminal-red p-12 text-center min-w-[300px]">
          <div className="text-2xl text-terminal-gray-light mb-4">
            TOTAL CONFLICT
          </div>
          <div className="text-8xl font-bold text-terminal-red">
            {game.conflict_score}
          </div>
        </div>
      </motion.div>

      {/* Outcome Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mb-16 max-w-4xl"
      >
        <div className="text-5xl mb-8 font-bold">
          {ending.outcome === 'victory' && (
            <span className="crt-glow-green" style={{ color: '#33ff33' }}>
              [ {ending.title} ]
            </span>
          )}
          {ending.outcome === 'defeat' && (
            <span style={{ color: '#ff3333' }}>
              [ {ending.title} ]
            </span>
          )}
          {ending.outcome === 'mixed' && (
            <span className="crt-glow" style={{ color: '#ffb000' }}>
              [ {ending.title} ]
            </span>
          )}
        </div>
        
        <p className="text-2xl leading-relaxed" style={{ color: '#666666' }}>
          {ending.description}
        </p>
      </motion.div>

      {/* Reveal Hacker */}
      {hacker && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 }}
          className="bg-terminal-red border-4 border-terminal-red p-12 text-center"
        >
          <div className="text-3xl mb-6 text-terminal-black font-bold">
            [ THE HACKER WAS... ]
          </div>
          <div className="text-8xl mb-4">{hacker.emoji}</div>
          <div className="text-5xl font-bold text-terminal-black">
            {hacker.name}
          </div>
        </motion.div>
      )}

      {/* All Players */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="mt-16 w-full max-w-6xl"
      >
        <div className="text-3xl text-center mb-8 text-terminal-green">
          [ PARTICIPANTS ]
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-6">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 + index * 0.1 }}
              className={`text-center p-6 border-2 ${
                player.is_hacker
                  ? 'bg-terminal-red border-terminal-red'
                  : 'bg-terminal-gray border-terminal-green'
              }`}
            >
              <div className="text-5xl mb-2">{player.emoji}</div>
              <div className="text-sm font-bold">{player.name}</div>
              {player.is_hacker && (
                <div className="text-xs mt-1 text-terminal-black">HACKER</div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Thank You Message */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, delay: 3 }}
        className="mt-16 text-3xl text-terminal-green"
      >
        [ THANK YOU FOR PLAYING ]
      </motion.div>
    </div>
  );
}
