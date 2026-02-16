'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useGameState, useLocalGameStorage } from '@/hooks/useGameState';
import JoinFlow from '@/components/play/JoinFlow';
import WaitingRoom from '@/components/play/WaitingRoom';
import GameView from '@/components/play/GameView';

/**
 * /play - Player View (Mobile-Optimized)
 * Join flow -> Waiting room -> Game play with secret roles and voting
 */
export default function PlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessCode = searchParams.get('code');
  
  const { playerId, gameId, savePlayerId, saveGameId } = useLocalGameStorage();
  const { game, players, votes, loading } = useGameState(gameId);
  
  const [currentPlayer, setCurrentPlayer] = useState<any>(null);

  // Load current player data
  useEffect(() => {
    if (playerId && players.length > 0) {
      const player = players.find((p) => p.id === playerId);
      setCurrentPlayer(player);
    }
  }, [playerId, players]);

  // Handle join complete
  const handleJoinComplete = async (newPlayerId: string, newGameId: string) => {
    savePlayerId(newPlayerId);
    saveGameId(newGameId);
    
    // Update URL with game code if not already present
    if (!accessCode && game?.access_code) {
      router.replace(`/play?code=${game.access_code}`);
    }
  };

  // Show join flow if no player ID or game ID (even while loading)
  if (!playerId || !gameId) {
    return (
      <JoinFlow 
        initialAccessCode={accessCode || undefined}
        onJoinComplete={handleJoinComplete}
      />
    );
  }

  // Show loading only when we have IDs but data is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#ffb000' }}>
        <div className="text-center">
          <div className="text-2xl crt-glow mb-4">[ INITIALIZING ]</div>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  // Show join flow if current player not found
  if (!currentPlayer) {
    return (
      <JoinFlow 
        initialAccessCode={accessCode || undefined}
        onJoinComplete={handleJoinComplete}
      />
    );
  }

  // Show waiting room if game is in lobby
  if (game?.status === 'LOBBY') {
    return (
      <WaitingRoom 
        game={game}
        players={players}
        currentPlayer={currentPlayer}
      />
    );
  }

  // Show game view for active gameplay
  return (
    <GameView 
      game={game}
      players={players}
      currentPlayer={currentPlayer}
      votes={votes}
    />
  );
}
