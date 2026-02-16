'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { Game, Player, Vote } from '@/lib/types/database';
import type { GameStatus } from '@/lib/types/database';

interface AdminGameControlProps {
  game: Game;
  players: Player[];
  votes: Vote[];
  onRefresh: () => void;
}

export default function AdminGameControl({
  game,
  players,
  votes,
  onRefresh,
}: AdminGameControlProps) {
  const [loading, setLoading] = useState(false);

  const handleTallyVotes = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/game/tally-votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          chapter: game.current_chapter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to tally votes');
      }

      alert(
        `Votes tallied!\n\n` +
        `Winning choice: ${data.tallyResult.winningChoice}\n` +
        `Stability: ${game.stability} → ${data.newStability} (${data.tallyResult.stabilityChange > 0 ? '+' : ''}${data.tallyResult.stabilityChange})\n` +
        `Conflict: ${game.conflict_score} → ${data.newConflict} (${data.tallyResult.conflictChange > 0 ? '+' : ''}${data.tallyResult.conflictChange})`
      );

      onRefresh();
    } catch (err: any) {
      console.error('Error tallying votes:', err);
      alert('Error tallying votes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: GameStatus) => {
    setLoading(true);

    try {
      const updates: any = { status: newStatus };

      // Update chapter number based on status
      if (newStatus.includes('CH1')) updates.current_chapter = 1;
      else if (newStatus.includes('CH2')) updates.current_chapter = 2;
      else if (newStatus.includes('CH3')) updates.current_chapter = 3;

      const { error } = await supabase
        .from('games')
        .update(updates)
        .eq('id', game.id);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating game status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndGame = async () => {
    if (!confirm('Are you sure you want to end this game?')) return;

    setLoading(true);
    try {
      await supabase
        .from('games')
        .update({
          status: 'ENDED',
          ended_at: new Date().toISOString(),
        })
        .eq('id', game.id);
    } catch (err: any) {
      console.error('Error ending game:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentChapterVotes = votes.filter((v) => v.chapter === game.current_chapter);
  const votePercentage = players.length > 0
    ? Math.round((currentChapterVotes.length / players.length) * 100)
    : 0;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold crt-glow mb-2">GAME CONTROL</h1>
            <div className="text-terminal-green">
              Game ID: {game.id.slice(0, 8)}...
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-terminal-gray text-terminal-amber hover:bg-terminal-gray-light transition-colors"
          >
            [ REFRESH ]
          </button>
        </div>

        {/* Game State */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-terminal-gray border-2 border-terminal-amber p-4">
            <div className="text-sm text-terminal-gray-light mb-2">STATUS</div>
            <div className="text-xl font-bold">{game.status}</div>
          </div>

          <div className="bg-terminal-gray border-2 border-terminal-green p-4">
            <div className="text-sm text-terminal-gray-light mb-2">CHAPTER</div>
            <div className="text-xl font-bold">{game.current_chapter}</div>
          </div>

          <div className="bg-terminal-gray border-2 border-terminal-green p-4">
            <div className="text-sm text-terminal-gray-light mb-2">STABILITY</div>
            <div className="text-xl font-bold">{game.stability}</div>
          </div>

          <div className="bg-terminal-gray border-2 border-terminal-red p-4">
            <div className="text-sm text-terminal-gray-light mb-2">CONFLICT</div>
            <div className="text-xl font-bold text-terminal-red">
              {game.conflict_score}
            </div>
          </div>
        </div>

        {/* Vote Progress */}
        {game.status.includes('VOTE') && (
          <div className="bg-terminal-gray border-2 border-terminal-amber p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">[ VOTE PROGRESS ]</h2>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Votes: {currentChapterVotes.length} / {players.length}</span>
                <span>{votePercentage}%</span>
              </div>
              <div className="w-full h-4 bg-terminal-black">
                <div
                  className="h-full bg-terminal-green transition-all"
                  style={{ width: `${votePercentage}%` }}
                />
              </div>
            </div>

            {/* Vote Summary */}
            <div className="space-y-2">
              {players.map((player) => {
                const playerVote = currentChapterVotes.find(
                  (v) => v.player_id === player.id
                );
                return (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-2 bg-terminal-black"
                  >
                    <span className="text-xl">{player.emoji}</span>
                    <span className="flex-1">{player.name}</span>
                    {playerVote ? (
                      <span className="text-terminal-green">
                        ✓ {playerVote.choice}
                      </span>
                    ) : (
                      <span className="text-terminal-gray-light">Waiting...</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Players */}
        <div className="bg-terminal-gray border-2 border-terminal-green p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            [ PLAYERS: {players.length} ]
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-terminal-black"
              >
                <span className="text-2xl">{player.emoji}</span>
                <div className="flex-1">
                  <div className="font-bold">{player.name}</div>
                  <div className="text-xs text-terminal-gray-light">
                    {player.role || 'No role'}
                    {player.is_hacker && ' 🔴 HACKER'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tally Votes Button (show during vote phases) */}
        {game.status.includes('VOTE') && (
          <div className="mb-8">
            <button
              onClick={handleTallyVotes}
              disabled={loading || currentChapterVotes.length === 0}
              className="w-full py-4 text-xl font-bold transition-colors disabled:opacity-50"
              style={{
                background: currentChapterVotes.length === 0 ? '#666666' : '#33ff33',
                color: '#0a0a0a',
              }}
            >
              [ TALLY VOTES & APPLY CONSEQUENCES ]
            </button>
            <div className="text-center text-sm mt-2" style={{ color: '#666666' }}>
              This will calculate the winning choice and update stability/conflict scores
            </div>
          </div>
        )}

        {/* Control Panel */}
        <div className="p-6" style={{ background: '#333333', border: '4px solid #ffb000' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#ffb000' }}>[ GAME CONTROLS ]</h2>

          <div className="grid md:grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleStatusChange('CH1_STORY')}
              disabled={loading}
              className="py-3 font-bold transition-colors disabled:opacity-50"
              style={{ background: loading ? '#666666' : '#ffb000', color: '#0a0a0a' }}
            >
              [ CH1: STORY ]
            </button>
            <button
              onClick={() => handleStatusChange('CH1_VOTE')}
              disabled={loading}
              className="py-3 font-bold transition-colors disabled:opacity-50"
              style={{ background: loading ? '#666666' : '#ffb000', color: '#0a0a0a' }}
            >
              [ CH1: VOTE ]
            </button>
            <button
              onClick={() => handleStatusChange('CH2_STORY')}
              disabled={loading}
              className="py-3 font-bold transition-colors disabled:opacity-50"
              style={{ background: loading ? '#666666' : '#ffb000', color: '#0a0a0a' }}
            >
              [ CH2: STORY ]
            </button>
            <button
              onClick={() => handleStatusChange('CH2_VOTE')}
              disabled={loading}
              className="py-3 font-bold transition-colors disabled:opacity-50"
              style={{ background: loading ? '#666666' : '#ffb000', color: '#0a0a0a' }}
            >
              [ CH2: VOTE ]
            </button>
            <button
              onClick={() => handleStatusChange('CH3_STORY')}
              disabled={loading}
              className="py-3 font-bold transition-colors disabled:opacity-50"
              style={{ background: loading ? '#666666' : '#ffb000', color: '#0a0a0a' }}
            >
              [ CH3: STORY ]
            </button>
            <button
              onClick={() => handleStatusChange('CH3_VOTE')}
              disabled={loading}
              className="py-3 font-bold transition-colors disabled:opacity-50"
              style={{ background: loading ? '#666666' : '#ffb000', color: '#0a0a0a' }}
            >
              [ CH3: VOTE ]
            </button>
            <button
              onClick={() => handleStatusChange('RESULTS')}
              disabled={loading}
              className="py-3 font-bold transition-colors disabled:opacity-50"
              style={{ background: loading ? '#666666' : '#33ff33', color: '#0a0a0a' }}
            >
              [ SHOW RESULTS ]
            </button>
            <button
              onClick={handleEndGame}
              disabled={loading}
              className="py-3 font-bold transition-colors disabled:opacity-50"
              style={{ background: loading ? '#666666' : '#ff3333', color: '#0a0a0a' }}
            >
              [ END GAME ]
            </button>
          </div>

          <div className="text-sm text-terminal-gray-light">
            <p>Click buttons to progress the game state.</p>
            <p>All connected views will update automatically via Realtime sync.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
