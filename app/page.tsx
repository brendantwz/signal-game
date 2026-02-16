'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0a0a0a' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center w-full max-w-4xl mx-auto"
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-8xl md:text-9xl font-bold crt-glow mb-6" style={{ color: '#ffb000' }}>
            2050
          </h1>
          <p className="text-3xl md:text-4xl crt-glow-green" style={{ color: '#33ff33' }}>
            The Signal We Trusted
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xl md:text-2xl mb-16 max-w-2xl mx-auto"
          style={{ color: '#666666' }}
        >
          A dystopian local-multiplayer simulation.
          <br />
          Three views. One synchronized reality.
        </motion.p>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-4 w-full max-w-md mx-auto"
        >
          <Link
            href="/admin"
            className="block w-full py-4 px-8 text-xl font-bold transition-colors text-center"
            style={{ 
              background: '#ffb000', 
              color: '#0a0a0a',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#33ff33';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffb000';
            }}
          >
            [ GAME MASTER ]
          </Link>

          <Link
            href="/play"
            className="block w-full py-4 px-8 text-xl font-bold transition-colors text-center"
            style={{ 
              background: '#333333', 
              color: '#ffb000',
              border: '2px solid #ffb000',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffb000';
              e.currentTarget.style.color = '#0a0a0a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#333333';
              e.currentTarget.style.color = '#ffb000';
            }}
          >
            [ PLAYER ]
          </Link>

          <Link
            href="/screen"
            className="block w-full py-4 px-8 text-xl font-bold transition-colors text-center"
            style={{ 
              background: '#333333', 
              color: '#33ff33',
              border: '2px solid #33ff33',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#33ff33';
              e.currentTarget.style.color = '#0a0a0a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#333333';
              e.currentTarget.style.color = '#33ff33';
            }}
          >
            [ BIG SCREEN ]
          </Link>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-16 grid md:grid-cols-3 gap-6 text-sm"
        >
          <div className="p-6" style={{ background: '#333333', border: '1px solid #666666' }}>
            <div className="text-3xl mb-3" style={{ color: '#33ff33' }}>⚡</div>
            <div className="font-bold mb-2" style={{ color: '#ffb000' }}>Sub-100ms Sync</div>
            <div style={{ color: '#666666' }}>
              Realtime state across all devices
            </div>
          </div>

          <div className="p-6" style={{ background: '#333333', border: '1px solid #666666' }}>
            <div className="text-3xl mb-3" style={{ color: '#ffb000' }}>🎭</div>
            <div className="font-bold mb-2" style={{ color: '#ffb000' }}>Secret Roles</div>
            <div style={{ color: '#666666' }}>
              Hidden identities & abilities
            </div>
          </div>

          <div className="p-6" style={{ background: '#333333', border: '1px solid #666666' }}>
            <div className="text-3xl mb-3" style={{ color: '#ff3333' }}>🎮</div>
            <div className="font-bold mb-2" style={{ color: '#ffb000' }}>Mobile-First</div>
            <div style={{ color: '#666666' }}>
              Thumb-friendly touch controls
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, delay: 2 }}
          className="mt-16 text-sm"
          style={{ color: '#666666' }}
        >
          [ BUILT WITH NEXT.JS × SUPABASE × FRAMER MOTION ]
        </motion.div>
      </motion.div>
    </div>
  );
}
