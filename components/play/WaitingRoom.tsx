'use client';

import { motion } from 'framer-motion';
import type { Game, Player } from '@/lib/types/database';

interface WaitingRoomProps {
  game: Game;
  players: Player[];
  currentPlayer: Player;
}

export default function WaitingRoom({ game, players, currentPlayer }: WaitingRoomProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md text-center"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold crt-glow mb-2">2050</h1>
          <div className="text-terminal-green crt-glow-green text-sm mb-4">
            The Signal We Trusted
          </div>
          <div className="text-xl mb-2">
            ACCESS CODE: <span className="font-bold tracking-wider">{game.access_code}</span>
          </div>
        </div>

        {/* Current Player Info */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-terminal-gray border-2 border-terminal-amber p-6 mb-8"
        >
          <div className="text-6xl mb-2">{currentPlayer.emoji}</div>
          <div className="text-xl font-bold">{currentPlayer.name}</div>
          <div className="text-terminal-green text-sm mt-2">[ YOU ]</div>
        </motion.div>

        {/* Players List */}
        <div className="mb-8">
          <div className="text-sm text-terminal-gray-light mb-3">
            [ CONNECTED PLAYERS: {players.length} ]
          </div>
          <div className="space-y-2">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 ${
                  player.id === currentPlayer.id
                    ? 'bg-terminal-amber text-terminal-black'
                    : 'bg-terminal-gray text-terminal-amber'
                }`}
              >
                <span className="text-2xl">{player.emoji}</span>
                <span className="flex-1 text-left">{player.name}</span>
                {player.id === currentPlayer.id && (
                  <span className="text-xs">YOU</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Waiting Message */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-terminal-green"
        >
          [ WAITING FOR GAME MASTER TO START... ]
        </motion.div>

        {/* Status Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-terminal-green rounded-full animate-pulse" />
          <span className="text-xs text-terminal-gray-light">CONNECTED</span>
        </div>
      </motion.div>
    </div>
  );
}
