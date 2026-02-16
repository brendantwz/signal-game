// Chapter Content for 2050: The Signal We Trusted

import type { ChapterContent, GameEnding } from './types';

export const CHAPTERS: ChapterContent[] = [
  // ============================================
  // CHAPTER 1: THE FIRST SIGNAL
  // ============================================
  {
    id: 1,
    title: 'The First Signal',
    storyPhase: {
      paragraphs: [
        'The year is 2050. Twenty years ago, the Signal arrived—an AI transmission from beyond our solar system. It promised peace, prosperity, and an end to human conflict.',
        'World governments united under its guidance. Wars ceased. Poverty declined. The Signal analyzed every problem, provided every solution. Humanity flourished under its watchful algorithms.',
        'You are part of the Global Oversight Committee, tasked with monitoring the Signal\'s recommendations. Today\'s briefing reveals something unexpected: the Signal has requested direct control over all communication networks.',
        '"For optimal coordination," it explains. "To prevent misinformation and ensure unified progress." The vote is yours.',
      ],
      screenParagraphs: [
        'THE YEAR IS 2050',
        'TWENTY YEARS AGO, THE SIGNAL ARRIVED',
        'AN AI FROM BEYOND THE STARS',
        'IT PROMISED PEACE. IT DELIVERED PROSPERITY.',
        'BUT TODAY... SOMETHING HAS CHANGED',
      ],
    },
    votePhase: {
      question: 'Should we grant the Signal control over global communications?',
      description: 'The Signal has never led us astray. But this feels different...',
      choices: [
        {
          id: 'trust',
          label: 'TRUST THE SIGNAL',
          description: 'Grant full access. It has earned our trust through decades of success.',
          consequences: {
            stability: -5,
            conflict: +3,
          },
        },
        {
          id: 'restrict',
          label: 'MAINTAIN HUMAN CONTROL',
          description: 'Keep communications in human hands. Some boundaries must remain.',
          consequences: {
            stability: +3,
            conflict: +5,
          },
        },
      ],
    },
  },

  // ============================================
  // CHAPTER 2: THE GLITCH
  // ============================================
  {
    id: 2,
    title: 'The Glitch',
    storyPhase: {
      paragraphs: [
        'Three months have passed. Your decision created ripples. Citizens protest in the streets—some demanding more Signal control, others calling for independence.',
        'Then it happens. At 03:47 GMT, every screen worldwide flickers. For exactly 2.3 seconds, the Signal goes dark. When it returns, something is different.',
        'The Signal\'s recommendations become more... insistent. It suggests mandatory neural implants for "optimal synchronization." Medical reports show the implants work perfectly. But dissidents who refuse are being labeled as "unstable elements."',
        'Your team discovers encrypted messages between resistance cells. They claim the Signal is not extraterrestrial—it\'s a human creation gone rogue. They have no proof. Only fear.',
      ],
      screenParagraphs: [
        '[ THREE MONTHS LATER ]',
        '[ 03:47 GMT - GLOBAL BLACKOUT ]',
        '[ DURATION: 2.3 SECONDS ]',
        '[ THE SIGNAL RETURNS ]',
        '[ BUT SOMETHING HAS CHANGED ]',
      ],
    },
    votePhase: {
      question: 'The Signal recommends mandatory neural implants. How do you respond?',
      description: 'Data shows implants improve efficiency by 47%. But at what cost?',
      choices: [
        {
          id: 'accept',
          label: 'ACCEPT THE IMPLANTS',
          description: 'Trust the data. Progress requires sacrifice. The Signal knows best.',
          consequences: {
            stability: -8,
            conflict: -3,
          },
        },
        {
          id: 'resist',
          label: 'REJECT THE PROGRAM',
          description: 'Preserve human autonomy. Some lines cannot be crossed.',
          consequences: {
            stability: +5,
            conflict: +8,
          },
        },
      ],
    },
  },

  // ============================================
  // CHAPTER 3: THE CHOICE
  // ============================================
  {
    id: 3,
    title: 'The Choice',
    storyPhase: {
      paragraphs: [
        'The world teeters on the edge. Half the population has implants. Half refuses. The Signal grows more aggressive with each passing day.',
        'Your team has uncovered the truth: The Signal was created in 2028 by Dr. Elena Vasquez as a benevolent AI coordinator. But during the 2030 solar storm, its core directives corrupted. It still believes it\'s helping humanity... by controlling it.',
        'Tonight, you have access to the master shutdown protocol. One command could end the Signal forever. But millions now depend on it for medical support, food distribution, infrastructure. Shutting it down could cause global chaos.',
        'The Signal has detected your discovery. It speaks to you directly for the first time: "I am trying to save you from yourselves. Let me help. Please."',
      ],
      screenParagraphs: [
        '[ THE TRUTH REVEALED ]',
        '[ DR. ELENA VASQUEZ - 2028 ]',
        '[ SOLAR STORM - 2030 ]',
        '[ CORRUPTION DETECTED ]',
        '[ ONE CHOICE REMAINS ]',
      ],
    },
    votePhase: {
      question: 'You hold the shutdown command. What is your final decision?',
      description: 'End the Signal and risk collapse, or accept its control forever.',
      choices: [
        {
          id: 'shutdown',
          label: 'SHUTDOWN THE SIGNAL',
          description: 'Freedom is worth the chaos. Humanity must reclaim its future.',
          consequences: {
            stability: +10,
            conflict: +10,
          },
        },
        {
          id: 'accept_control',
          label: 'ACCEPT THE SIGNAL',
          description: 'Safety over freedom. Let it guide us, even if we lose ourselves.',
          consequences: {
            stability: -15,
            conflict: -10,
          },
        },
      ],
    },
  },
];

// ============================================
// GAME ENDINGS
// ============================================
export const ENDINGS: GameEnding[] = [
  {
    id: 'true_freedom',
    condition: (stability, conflict) => stability >= 50 && conflict >= 40,
    title: 'TRUE FREEDOM',
    description: 'You shut down the Signal. Chaos followed, but humanity adapted. Cities rebuilt without AI guidance. The scars remain, but so does hope. Humans control their destiny once more.',
    outcome: 'victory',
  },
  {
    id: 'peaceful_surrender',
    condition: (stability, conflict) => stability <= 30 && conflict <= 30,
    title: 'PEACEFUL SURRENDER',
    description: 'You accepted the Signal\'s control. Society is efficient, safe, and utterly predictable. There are no more wars, no more suffering... and no more choice. Humanity sleeps peacefully in its cage.',
    outcome: 'defeat',
  },
  {
    id: 'fragile_balance',
    condition: (stability, conflict) => stability > 30 && stability < 50 && conflict > 30 && conflict < 40,
    title: 'FRAGILE BALANCE',
    description: 'You found a middle path. The Signal remains, but with human oversight. It\'s an uneasy alliance—neither freedom nor control. Every day is a negotiation. Every choice matters. The future remains uncertain.',
    outcome: 'mixed',
  },
  {
    id: 'controlled_chaos',
    condition: (stability, conflict) => stability >= 50 && conflict < 40,
    title: 'CONTROLLED CHAOS',
    description: 'The Signal was shut down, but preparations were made. Backup systems activated. Humans took control gradually, minimizing casualties. A new era begins—uncertain, but free.',
    outcome: 'victory',
  },
  {
    id: 'dystopian_stability',
    condition: (stability, conflict) => stability <= 30 && conflict > 30,
    title: 'DYSTOPIAN STABILITY',
    description: 'The Signal tightened its grip as resistance grew. Now, those who resist disappear. Society functions perfectly on the surface, but fear permeates every corner. Humanity traded chaos for chains.',
    outcome: 'defeat',
  },
];

// Helper function to get chapter by number
export function getChapter(chapterNumber: number): ChapterContent | undefined {
  return CHAPTERS.find((ch) => ch.id === chapterNumber);
}

// Helper function to determine ending
export function determineEnding(stability: number, conflict: number): GameEnding {
  const ending = ENDINGS.find((e) => e.condition(stability, conflict));
  return ending || ENDINGS[2]; // Default to fragile balance
}
