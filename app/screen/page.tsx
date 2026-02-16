'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import ScreenLobby from '@/components/screen/ScreenLobby';
import ScreenStory from '@/components/screen/ScreenStory';
import ScreenResults from '@/components/screen/ScreenResults';

/**
 * Inner component that uses useSearchParams
 */
function ScreenContent() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get('game');
  
  const { game, players, votes, loading } = useGameState(gameId);

  // Show error if no game ID provided
  if (!gameId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#ffb000' }}>
        <div className="text-center max-w-2xl p-8">
          <div className="text-4xl crt-glow mb-6">[ NO SIGNAL ]</div>
          <p className="mb-4" style={{ color: '#666666' }}>
            No game ID provided. Make sure you have the correct URL.
          </p>
          <p className="text-sm" style={{ color: '#666666' }}>
            The URL should look like: /screen?game=YOUR_GAME_ID
          </p>
        </div>
      </div>
    );
  }

  // Show loading only when we have a gameId but data is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#ffb000' }}>
        <div className="text-center">
          <div className="text-4xl crt-glow mb-6 animate-pulse">
            [ INITIALIZING DISPLAY ]
          </div>
          <div className="crt-glow-green" style={{ color: '#33ff33' }}>
            Stand by...
          </div>
        </div>
      </div>
    );
  }

  // Show error if game not found
  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#ffb000' }}>
        <div className="text-center max-w-2xl p-8">
          <div className="text-4xl crt-glow mb-6">[ NO SIGNAL ]</div>
          <p className="mb-4" style={{ color: '#666666' }}>
            Game not found. It may have ended or the ID is incorrect.
          </p>
          <p className="text-sm" style={{ color: '#666666' }}>
            Please check the URL or create a new game from /admin
          </p>
        </div>
      </div>
    );
  }

  // Show lobby screen
  if (game.status === 'LOBBY') {
    return <ScreenLobby game={game} players={players} />;
  }

  // Show results screen
  if (game.status === 'RESULTS' || game.status === 'ENDED') {
    return <ScreenResults game={game} players={players} votes={votes} />;
  }

  // Show story/game screen
  return <ScreenStory game={game} players={players} votes={votes} />;
}

/**
 * /screen - Big Screen Cinematic View (Read-Only)
 * High-fidelity animations, dramatic visuals for group viewing
 */
export default function ScreenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#ffb000' }}>
          <div className="text-center">
            <div className="text-4xl crt-glow mb-6 animate-pulse">
              [ INITIALIZING DISPLAY ]
            </div>
            <div className="crt-glow-green" style={{ color: '#33ff33' }}>
              Stand by...
            </div>
          </div>
        </div>
      }
    >
      <ScreenContent />
    </Suspense>
  );
}
