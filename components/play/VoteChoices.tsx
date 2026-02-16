'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { VoteChoice } from '@/lib/content/types';

interface VoteChoicesProps {
  gameId: string;
  playerId: string;
  chapter: number;
  choices: VoteChoice[];
  hasVoted: boolean;
  abilityActive?: boolean; // For hacker double vote
}

export default function VoteChoices({
  gameId,
  playerId,
  chapter,
  choices,
  hasVoted,
  abilityActive = false,
}: VoteChoicesProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVote = async (choiceId: string) => {
    if (hasVoted) return;
    
    setSelectedChoice(choiceId);
    setLoading(true);
    setError('');

    try {
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          player_id: playerId,
          game_id: gameId,
          chapter: chapter,
          choice: choiceId,
        });

      if (voteError) throw voteError;

      // Success - the vote is cast!
    } catch (err: any) {
      console.error('Error casting vote:', err);
      setError(err.message);
      setSelectedChoice(null);
    } finally {
      setLoading(false);
    }
  };

  if (hasVoted) {
    const votedChoice = choices.find((c) => c.id === selectedChoice);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
        style={{ background: '#333333', border: '2px solid #33ff33' }}
      >
        <div className="text-4xl mb-4" style={{ color: '#33ff33' }}>✓</div>
        <div className="text-xl font-bold mb-2" style={{ color: '#ffb000' }}>
          VOTE CAST
        </div>
        <div className="text-sm" style={{ color: '#666666' }}>
          {votedChoice?.label || 'Your choice has been recorded'}
        </div>
        {abilityActive && (
          <div className="mt-4 text-sm" style={{ color: '#ff3333' }}>
            🔴 DOUBLE VOTE ACTIVE
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 text-center" style={{ background: '#ff3333', color: '#0a0a0a' }}>
          ⚠ {error}
        </div>
      )}

      {abilityActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 text-center font-bold"
          style={{ background: '#ff3333', color: '#0a0a0a' }}
        >
          🔴 HACKER ABILITY: YOUR VOTE COUNTS DOUBLE!
        </motion.div>
      )}

      {choices.map((choice, index) => (
        <motion.button
          key={choice.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => handleVote(choice.id)}
          disabled={loading}
          className="w-full text-left p-6 transition-all disabled:opacity-50"
          style={{
            background: '#333333',
            border: '2px solid #ffb000',
            color: '#ffb000',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#ffb000';
              e.currentTarget.style.color = '#0a0a0a';
              e.currentTarget.style.borderColor = '#33ff33';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = '#333333';
              e.currentTarget.style.color = '#ffb000';
              e.currentTarget.style.borderColor = '#ffb000';
            }
          }}
        >
          <div className="text-xl font-bold mb-2">[ {choice.label} ]</div>
          <div className="text-sm opacity-80">{choice.description}</div>
          
          {/* Subtle consequence hints */}
          <div className="mt-3 text-xs opacity-60 flex gap-4">
            {choice.consequences.stability > 0 && (
              <span style={{ color: '#33ff33' }}>↑ Increases stability</span>
            )}
            {choice.consequences.stability < 0 && (
              <span style={{ color: '#ff3333' }}>↓ Decreases stability</span>
            )}
            {choice.consequences.conflict > 0 && (
              <span style={{ color: '#ff3333' }}>⚡ Raises tension</span>
            )}
            {choice.consequences.conflict < 0 && (
              <span style={{ color: '#33ff33' }}>⚡ Eases tension</span>
            )}
          </div>
        </motion.button>
      ))}

      {loading && (
        <div className="text-center text-sm" style={{ color: '#33ff33' }}>
          Recording your choice...
        </div>
      )}
    </div>
  );
}
