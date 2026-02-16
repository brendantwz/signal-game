// Content Type Definitions for 2050: The Signal We Trusted

export interface VoteChoice {
  id: string;
  label: string;
  description: string;
  consequences: {
    stability: number;      // -10 to +10
    conflict: number;       // -10 to +10
  };
}

export interface VotePhase {
  question: string;
  description: string;
  choices: VoteChoice[];
}

export interface StoryPhase {
  paragraphs: string[];           // For mobile/admin
  screenParagraphs?: string[];    // Optional: larger text for big screen
}

export interface ChapterContent {
  id: number;
  title: string;
  storyPhase: StoryPhase;
  votePhase: VotePhase;
}

export interface GameEnding {
  id: string;
  condition: (stability: number, conflict: number) => boolean;
  title: string;
  description: string;
  outcome: 'victory' | 'defeat' | 'mixed';
}
