'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useGameState } from '@/hooks/useGameState';
import AdminLobby from '@/components/admin/AdminLobby';
import AdminGameControl from '@/components/admin/AdminGameControl';
import CreateGameForm from '@/components/admin/CreateGameForm';

/**
 * Inner component that uses useSearchParams
 */
function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameIdFromUrl = searchParams.get('game');
  
  const [gameId, setGameId] = useState<string | null>(gameIdFromUrl);
  const { game, players, votes, loading, refresh } = useGameState(gameId);

  // Handle game creation
  const handleGameCreated = (newGameId: string, accessCode: string) => {
    setGameId(newGameId);
    router.push(`/admin?game=${newGameId}`);
  };

  // Show create game form if no game ID (even while loading)
  if (!gameId) {
    return <CreateGameForm onGameCreated={handleGameCreated} />;
  }

  // Show loading only when we have a gameId but data is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#ffb000' }}>
        <div className="text-center">
          <div className="text-2xl crt-glow mb-4">[ INITIALIZING ADMIN ]</div>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  // Show create game form if game not found
  if (!game) {
    return <CreateGameForm onGameCreated={handleGameCreated} />;
  }

  // Show lobby if game is in LOBBY status
  if (game.status === 'LOBBY') {
    return (
      <AdminLobby
        game={game}
        players={players}
        onRefresh={refresh}
      />
    );
  }

  // Show game control for active game
  return (
    <AdminGameControl
      game={game}
      players={players}
      votes={votes}
      onRefresh={refresh}
    />
  );
}

/**
 * /admin - Game Master Dashboard
 * Create game -> Lobby management -> Game state control
 */
export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#ffb000' }}>
          <div className="text-center">
            <div className="text-2xl crt-glow mb-4">[ INITIALIZING ADMIN ]</div>
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
