'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

interface JoinFlowProps {
  initialAccessCode?: string;
  onJoinComplete: (playerId: string, gameId: string) => void;
}

const EMOJI_OPTIONS = ['🤖', '👾', '🎮', '🕹️', '💀', '👻', '🔮', '⚡', '🌟', '🎯', '🔥', '💥'];

export default function JoinFlow({ initialAccessCode, onJoinComplete }: JoinFlowProps) {
  const [step, setStep] = useState<'code' | 'name' | 'emoji'>('code');
  const [accessCode, setAccessCode] = useState(initialAccessCode || '');
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Enter access code
  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('access_code', accessCode.toUpperCase())
        .eq('status', 'LOBBY')
        .single();

      if (error || !data) {
        throw new Error('Game not found or already started');
      }

      setStep('name');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Enter name
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    setError('');
    setStep('emoji');
  };

  // Step 3: Select emoji and join game
  const handleEmojiSelect = async (emoji: string) => {
    setSelectedEmoji(emoji);
    setError('');
    setLoading(true);

    try {
      // Get game ID
      const { data: gameData, error: gameError } = await supabase
        .from('games')
        .select('id')
        .eq('access_code', accessCode.toUpperCase())
        .single();

      if (gameError || !gameData) {
        throw new Error('Game not found');
      }

      // Check if name is already taken
      const { data: existingPlayer } = await supabase
        .from('players')
        .select('id')
        .eq('game_id', gameData.id)
        .eq('name', name)
        .single();

      if (existingPlayer) {
        throw new Error('Name already taken. Please choose another name.');
      }

      // Create player
      const { data: player, error: playerError } = await supabase
        .from('players')
        .insert({
          game_id: gameData.id,
          name: name,
          emoji: emoji,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      onJoinComplete(player.id, gameData.id);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0a', color: '#ffb000' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold crt-glow mb-2" style={{ color: '#ffb000' }}>2050</h1>
          <p className="crt-glow-green" style={{ color: '#33ff33' }}>The Signal We Trusted</p>
        </div>

        {/* Step 1: Access Code */}
        {step === 'code' && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleAccessCodeSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm mb-2" style={{ color: '#ffb000' }}>[ ENTER ACCESS CODE ]</label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full px-4 py-3 text-2xl text-center uppercase tracking-widest"
                style={{
                  background: '#0a0a0a',
                  border: '2px solid #333333',
                  color: '#ffb000',
                  fontFamily: 'inherit'
                }}
                placeholder="ABC123"
                autoFocus
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-sm text-center" style={{ color: '#ff3333' }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={accessCode.length !== 6 || loading}
              className="w-full py-3 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: (accessCode.length !== 6 || loading) ? '#666666' : '#ffb000',
                color: '#0a0a0a',
                cursor: (accessCode.length !== 6 || loading) ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (accessCode.length === 6 && !loading) {
                  e.currentTarget.style.background = '#33ff33';
                }
              }}
              onMouseLeave={(e) => {
                if (accessCode.length === 6 && !loading) {
                  e.currentTarget.style.background = '#ffb000';
                }
              }}
            >
              {loading ? '[ CONNECTING... ]' : '[ CONNECT ]'}
            </button>
          </motion.form>
        )}

        {/* Step 2: Name */}
        {step === 'name' && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleNameSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm mb-2">[ ENTER YOUR NAME ]</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                className="w-full px-4 py-3 text-xl text-center"
                placeholder="Your Name"
                autoFocus
              />
            </div>

            {error && (
              <div className="text-terminal-red text-sm text-center">
                ⚠ {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('code')}
                className="flex-1 py-3 bg-terminal-gray text-terminal-amber hover:bg-terminal-gray-light transition-colors"
              >
                [ BACK ]
              </button>
              <button
                type="submit"
                disabled={name.trim().length < 2}
                className="flex-1 py-3 bg-terminal-amber text-terminal-black font-bold hover:bg-terminal-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                [ NEXT ]
              </button>
            </div>
          </motion.form>
        )}

        {/* Step 3: Emoji */}
        {step === 'emoji' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm mb-4 text-center">
                [ SELECT YOUR AVATAR ]
              </label>
              <div className="grid grid-cols-4 gap-3">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    disabled={loading}
                    className="aspect-square text-4xl bg-terminal-gray hover:bg-terminal-amber hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-terminal-red text-sm text-center">
                ⚠ {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep('name')}
              disabled={loading}
              className="w-full py-3 bg-terminal-gray text-terminal-amber hover:bg-terminal-gray-light transition-colors"
            >
              [ BACK ]
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
