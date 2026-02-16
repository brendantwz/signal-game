'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { Game, Player } from '@/lib/types/database';

interface AdminLobbyProps {
  game: Game;
  players: Player[];
  onRefresh: () => void;
}

export default function AdminLobby({ game, players, onRefresh }: AdminLobbyProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartGame = async () => {
    if (players.length < 3) {
      setError('Need at least 3 players to start');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update game status to first chapter story
      const { error: updateError } = await supabase
        .from('games')
        .update({
          status: 'CH1_STORY',
          current_chapter: 1,
          started_at: new Date().toISOString(),
        })
        .eq('id', game.id);

      if (updateError) throw updateError;

      // Assign random roles to players
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      const hackerIndex = Math.floor(Math.random() * shuffledPlayers.length);

      for (let i = 0; i < shuffledPlayers.length; i++) {
        const player = shuffledPlayers[i];
        const isHacker = i === hackerIndex;
        
        await supabase
          .from('players')
          .update({
            is_hacker: isHacker,
            role: isHacker ? 'HACKER' : 'CITIZEN',
          })
          .eq('id', player.id);
      }

      // The Trinity Sync will automatically update all views via Realtime
    } catch (err: any) {
      console.error('Error starting game:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      await supabase
        .from('players')
        .delete()
        .eq('id', playerId);
    } catch (err: any) {
      console.error('Error removing player:', err);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold crt-glow mb-2">GAME MASTER LOBBY</h1>
          <div className="text-terminal-green crt-glow-green">
            2050 — The Signal We Trusted
          </div>
        </div>

        {/* Access Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-terminal-gray border-2 border-terminal-amber p-4">
            <div className="text-sm text-terminal-gray-light mb-2">ACCESS CODE</div>
            <div className="text-3xl font-bold mb-2">{game.access_code}</div>
            <button
              onClick={() => copyToClipboard(game.access_code, 'Access code')}
              className="text-sm text-terminal-green hover:text-terminal-amber transition-colors"
            >
              [ COPY CODE ]
            </button>
          </div>

          <div className="bg-terminal-gray border-2 border-terminal-green p-4">
            <div className="text-sm text-terminal-gray-light mb-2">PLAYER URL</div>
            <div className="text-sm mb-2 break-all">
              {typeof window !== 'undefined' && `${window.location.origin}/play?code=${game.access_code}`}
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  `${window.location.origin}/play?code=${game.access_code}`,
                  'Player URL'
                )
              }
              className="text-sm text-terminal-green hover:text-terminal-amber transition-colors"
            >
              [ COPY URL ]
            </button>
          </div>

          <div className="bg-terminal-gray border-2 border-terminal-green p-4">
            <div className="text-sm text-terminal-gray-light mb-2">SCREEN URL</div>
            <div className="text-sm mb-2 break-all">
              {typeof window !== 'undefined' && `${window.location.origin}/screen?game=${game.id}`}
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  `${window.location.origin}/screen?game=${game.id}`,
                  'Screen URL'
                )
              }
              className="text-sm text-terminal-green hover:text-terminal-amber transition-colors"
            >
              [ COPY URL ]
            </button>
          </div>
        </div>

        {/* Players List */}
        <div className="bg-terminal-gray border-2 border-terminal-amber p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              [ CONNECTED PLAYERS: {players.length} ]
            </h2>
            <button
              onClick={onRefresh}
              className="text-terminal-green hover:text-terminal-amber transition-colors"
            >
              [ REFRESH ]
            </button>
          </div>

          {players.length === 0 ? (
            <div className="text-center py-12 text-terminal-gray-light">
              <p className="mb-2">No players connected yet.</p>
              <p className="text-sm">Share the access code or player URL above.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-terminal-black"
                >
                  <span className="text-3xl">{player.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold">{player.name}</div>
                    <div className="text-xs text-terminal-gray-light">
                      Joined {new Date(player.joined_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePlayer(player.id)}
                    className="text-terminal-red hover:text-terminal-amber transition-colors text-sm"
                  >
                    [ REMOVE ]
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-terminal-red text-terminal-black font-bold">
            ⚠ {error}
          </div>
        )}

        {/* Start Game Button */}
        <div className="text-center">
          <button
            onClick={handleStartGame}
            disabled={players.length < 3 || loading}
            className="px-12 py-6 text-2xl bg-terminal-amber text-terminal-black font-bold hover:bg-terminal-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '[ STARTING... ]' : '[ START GAME ]'}
          </button>
          
          {players.length < 3 && (
            <div className="mt-4 text-terminal-red text-sm">
              Minimum 3 players required to start
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 border-2 border-terminal-gray">
          <h3 className="text-lg font-bold mb-3">[ GAME MASTER INSTRUCTIONS ]</h3>
          <ul className="space-y-2 text-sm text-terminal-gray-light">
            <li>1. Share the access code or player URL with participants</li>
            <li>2. Display the screen URL on a big screen for everyone to see</li>
            <li>3. Wait for at least 3 players to join</li>
            <li>4. Click "START GAME" to begin Chapter 1</li>
            <li>5. Use the admin controls to progress through the story</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
