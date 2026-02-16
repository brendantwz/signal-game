'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase, getGameChannel } from '@/lib/supabase/client';
import type { Game, Player, Vote, GameState } from '@/lib/types/database';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Central Game State Hook - The "Trinity Sync" Core
 * Provides sub-100ms synchronization across /screen, /admin, and /play
 */
export function useGameState(gameId: string | null) {
  const [state, setState] = useState<GameState>({
    game: null,
    players: [],
    votes: [],
    loading: true,
    error: null,
  });

  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Fetch initial game state
  const fetchGameState = useCallback(async () => {
    if (!gameId) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Fetch game data
      const { data: game, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();

      if (gameError) throw gameError;

      // Fetch players
      const { data: players, error: playersError } = await supabase
        .from('players')
        .select('*')
        .eq('game_id', gameId)
        .order('joined_at', { ascending: true });

      if (playersError) throw playersError;

      // Fetch votes
      const { data: votes, error: votesError } = await supabase
        .from('votes')
        .select('*')
        .eq('game_id', gameId);

      if (votesError) throw votesError;

      setState({
        game,
        players: players || [],
        votes: votes || [],
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Error fetching game state:', error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error?.message || 'Failed to fetch game state',
      }));
    }
  }, [gameId]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!gameId) return;

    fetchGameState();

    const gameChannel = getGameChannel(gameId);

    // Subscribe to game table changes
    gameChannel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          console.log('Game update:', payload);
          setState((prev) => ({
            ...prev,
            game: payload.new as Game,
          }));
        }
      )
      // Subscribe to players table changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          console.log('Players update:', payload);
          if (payload.eventType === 'INSERT') {
            setState((prev) => ({
              ...prev,
              players: [...prev.players, payload.new as Player],
            }));
          } else if (payload.eventType === 'UPDATE') {
            setState((prev) => ({
              ...prev,
              players: prev.players.map((p) =>
                p.id === payload.new.id ? (payload.new as Player) : p
              ),
            }));
          } else if (payload.eventType === 'DELETE') {
            setState((prev) => ({
              ...prev,
              players: prev.players.filter((p) => p.id !== payload.old.id),
            }));
          }
        }
      )
      // Subscribe to votes table changes
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          console.log('Votes update:', payload);
          if (payload.eventType === 'INSERT') {
            setState((prev) => ({
              ...prev,
              votes: [...prev.votes, payload.new as Vote],
            }));
          } else if (payload.eventType === 'UPDATE') {
            setState((prev) => ({
              ...prev,
              votes: prev.votes.map((v) =>
                v.id === payload.new.id ? (payload.new as Vote) : v
              ),
            }));
          } else if (payload.eventType === 'DELETE') {
            setState((prev) => ({
              ...prev,
              votes: prev.votes.filter((v) => v.id !== payload.old.id),
            }));
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    setChannel(gameChannel);

    return () => {
      gameChannel.unsubscribe();
    };
  }, [gameId, fetchGameState]);

  return {
    ...state,
    refresh: fetchGameState,
  };
}

/**
 * LocalStorage Persistence Helper
 * Handles mobile browser disconnects/refreshes
 */
export function useLocalGameStorage() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    // Load from localStorage on mount
    const storedPlayerId = localStorage.getItem('signal_player_id');
    const storedGameId = localStorage.getItem('signal_game_id');
    
    if (storedPlayerId) setPlayerId(storedPlayerId);
    if (storedGameId) setGameId(storedGameId);
  }, []);

  const savePlayerId = useCallback((id: string) => {
    localStorage.setItem('signal_player_id', id);
    setPlayerId(id);
  }, []);

  const saveGameId = useCallback((id: string) => {
    localStorage.setItem('signal_game_id', id);
    setGameId(id);
  }, []);

  const clearStorage = useCallback(() => {
    localStorage.removeItem('signal_player_id');
    localStorage.removeItem('signal_game_id');
    setPlayerId(null);
    setGameId(null);
  }, []);

  return {
    playerId,
    gameId,
    savePlayerId,
    saveGameId,
    clearStorage,
  };
}
