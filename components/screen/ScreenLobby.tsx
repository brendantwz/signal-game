'use client';

import { motion } from 'framer-motion';
import type { Game, Player } from '@/lib/types/database';

interface ScreenLobbyProps {
  game: Game;
  players: Player[];
}

export default function ScreenLobby({ game, players }: ScreenLobbyProps) {
  return (
    <div className="min-h-screen bg-terminal-black flex flex-col items-center justify-center p-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <h1 className="text-8xl font-bold crt-glow mb-6">2050</h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-4xl text-terminal-green crt-glow-green"
        >
          The Signal We Trusted
        </motion.p>
      </motion.div>

      {/* Access Code */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mb-16 text-center"
      >
        <div className="text-2xl text-terminal-gray-light mb-4">
          [ JOIN CODE ]
        </div>
        <div className="text-7xl font-bold tracking-widest bg-terminal-gray border-4 border-terminal-amber px-12 py-8">
          {game.access_code}
        </div>
      </motion.div>

      {/* Players Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="w-full max-w-6xl"
      >
        <div className="text-3xl text-center mb-8 text-terminal-green">
          [ CONNECTED: {players.length} ]
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.1 }}
              className="bg-terminal-gray border-2 border-terminal-green p-6 text-center"
            >
              <div className="text-6xl mb-3">{player.emoji}</div>
              <div className="text-xl font-bold">{player.name}</div>
            </motion.div>
          ))}
        </div>

        {players.length === 0 && (
          <div className="text-center text-terminal-gray-light text-2xl">
            Waiting for players to join...
          </div>
        )}
      </motion.div>

      {/* Waiting Message */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-16 text-2xl text-terminal-green"
      >
        [ AWAITING GAME START... ]
      </motion.div>
    </div>
  );
}
