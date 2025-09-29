import { NextRequest, NextResponse } from 'next/server';
import { calculateKiteSize } from '@/utils/kiteCalculator';
import { UserPreferences } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { windSpeed, windGust, userPreferences } = body;

    if (!windSpeed || !userPreferences) {
      return NextResponse.json({
        error: 'Missing required parameters',
        status: 400
      }, { status: 400 });
    }

    const prefs: UserPreferences = {
      weight: userPreferences.weight || 75,
      skillLevel: userPreferences.skillLevel || 'intermediate',
      discipline: userPreferences.discipline || 'freeride',
      kiteRange: userPreferences.kiteRange
    };

    const recommendation = calculateKiteSize(
      windSpeed,
      windGust || windSpeed,
      prefs
    );

    return NextResponse.json({
      data: recommendation,
      status: 200
    });
  } catch (error) {
    console.error('Error calculating kite size:', error);
    return NextResponse.json({
      error: 'Failed to calculate kite size',
      status: 500
    }, { status: 500 });
  }
}