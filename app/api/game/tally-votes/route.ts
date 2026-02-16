import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getChapter } from '@/lib/content/chapters';
import { tallyVotes, applyConsequences } from '@/lib/game/voting';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { gameId, chapter } = await request.json();

    if (!gameId || !chapter) {
      return NextResponse.json(
        { error: 'Missing gameId or chapter' },
        { status: 400 }
      );
    }

    // Fetch game
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError || !game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Fetch votes for this chapter
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('*')
      .eq('game_id', gameId)
      .eq('chapter', chapter);

    if (votesError) {
      return NextResponse.json(
        { error: 'Failed to fetch votes' },
        { status: 500 }
      );
    }

    // Fetch players
    const { data: players, error: playersError } = await supabase
      .from('players')
      .select('*')
      .eq('game_id', gameId);

    if (playersError) {
      return NextResponse.json(
        { error: 'Failed to fetch players' },
        { status: 500 }
      );
    }

    // Get chapter content
    const chapterContent = getChapter(chapter);
    if (!chapterContent) {
      return NextResponse.json(
        { error: 'Invalid chapter' },
        { status: 400 }
      );
    }

    // Tally votes
    const tallyResult = tallyVotes(votes || [], players || [], chapterContent.votePhase.choices);

    // Apply consequences
    const { newStability, newConflict } = applyConsequences(
      game.stability,
      game.conflict_score,
      tallyResult.stabilityChange,
      tallyResult.conflictChange
    );

    // Update game with new scores
    const { error: updateError } = await supabase
      .from('games')
      .update({
        stability: newStability,
        conflict_score: newConflict,
      })
      .eq('id', gameId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update game' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tallyResult,
      newStability,
      newConflict,
    });
  } catch (error: any) {
    console.error('Error tallying votes:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
