'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';

interface CreateGameFormProps {
  onGameCreated: (gameId: string, accessCode: string) => void;
}

export default function CreateGameForm({ onGameCreated }: CreateGameFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateGame = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('games')
        .insert({
          status: 'LOBBY',
          current_chapter: 0,
          stability: 50,
          conflict_score: 0,
        })
        .select()
        .single();

      if (error) throw error;

      onGameCreated(data.id, data.access_code);
    } catch (err: any) {
      console.error('Error creating game:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0a', color: '#ffb000' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl text-center"
      >
        <div className="mb-12">
          <h1 className="text-5xl font-bold crt-glow mb-4" style={{ color: '#ffb000' }}>2050</h1>
          <p className="crt-glow-green text-xl" style={{ color: '#33ff33' }}>
            The Signal We Trusted
          </p>
          <div className="mt-4" style={{ color: '#666666' }}>
            [ GAME MASTER CONTROL ]
          </div>
        </div>

        <div className="p-8" style={{ background: '#333333', border: '4px solid #ffb000' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#ffb000' }}>[ CREATE NEW GAME ]</h2>
          
          <div className="mb-8 text-left space-y-3" style={{ color: '#ffb000' }}>
            <div className="flex items-center gap-3">
              <span style={{ color: '#33ff33' }}>✓</span>
              <span>Realtime synchronization across all devices</span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: '#33ff33' }}>✓</span>
              <span>3 chapters with branching choices</span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: '#33ff33' }}>✓</span>
              <span>Secret roles and hidden abilities</span>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ color: '#33ff33' }}>✓</span>
              <span>Stability & conflict tracking</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3" style={{ background: '#ff3333', color: '#0a0a0a' }}>
              ⚠ {error}
            </div>
          )}

          <button
            onClick={handleCreateGame}
            disabled={loading}
            className="w-full py-4 text-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: loading ? '#666666' : '#ffb000', 
              color: '#0a0a0a',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = '#33ff33';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.background = '#ffb000';
            }}
          >
            {loading ? '[ CREATING... ]' : '[ CREATE GAME ]'}
          </button>
        </div>

        <div className="mt-8 text-sm" style={{ color: '#666666' }}>
          <p>Once created, players can join using the access code.</p>
          <p className="mt-2">Display the /screen URL on a big screen for cinematic viewing.</p>
        </div>
      </motion.div>
    </div>
  );
}
