// Database Type Definitions for 2050: The Signal We Trusted

export type GameStatus =
  | 'LOBBY'
  | 'CH1_STORY'
  | 'CH1_VOTE'
  | 'CH2_STORY'
  | 'CH2_VOTE'
  | 'CH3_STORY'
  | 'CH3_VOTE'
  | 'RESULTS'
  | 'ENDED';

export interface Game {
  id: string;
  access_code: string;
  status: GameStatus;
  current_chapter: number;
  stability: number;
  conflict_score: number;
  created_at: string;
  started_at?: string;
  ended_at?: string;
}

export interface Player {
  id: string;
  game_id: string;
  name: string;
  emoji: string;
  role?: string;
  is_hacker: boolean;
  ability_used: boolean;
  joined_at: string;
  last_seen: string;
}

export interface Vote {
  id: string;
  player_id: string;
  game_id: string;
  chapter: number;
  choice: string;
  voted_at: string;
}

// Client-side state interfaces
export interface GameState {
  game: Game | null;
  players: Player[];
  votes: Vote[];
  loading: boolean;
  error: string | null;
}

export interface LocalStorage {
  player_id?: string;
  game_id?: string;
}
