import { NextRequest, NextResponse } from 'next/server';
import { kiteSpotsNL } from '@/data/spots';
import { weatherService } from '@/services/weatherService';
import { calculateKiteability, isSpotKiteable } from '@/utils/kiteCalculator';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spot = kiteSpotsNL.find(s => s.id === params.id);

    if (!spot) {
      return NextResponse.json({
        error: 'Spot not found',
        status: 404
      }, { status: 404 });
    }

    const weather = await weatherService.getWeatherForSpot(spot);

    const isKiteable = isSpotKiteable(
      weather.windSpeed,
      weather.windDirection,
      spot.windDirections,
      spot.minWindSpeed,
      spot.maxWindSpeed
    );

    const kiteability = calculateKiteability(
      weather.windSpeed,
      weather.windDirection,
      spot.windDirections,
      spot.minWindSpeed,
      spot.maxWindSpeed,
      weather.windGust
    );

    const warnings: string[] = [];

    if (weather.windGust > weather.windSpeed * 1.5) {
      warnings.push('Very gusty conditions');
    }

    if (weather.windSpeed > 25) {
      warnings.push('Strong wind conditions');
    }

    if (weather.windSpeed < spot.minWindSpeed) {
      warnings.push('Wind below minimum for this spot');
    }

    if (spot.tideDependent) {
      warnings.push('Check tide conditions before going');
    }

    return NextResponse.json({
      data: {
        spot,
        weather,
        isKiteable,
        kiteability,
        warnings
      },
      status: 200
    });
  } catch (error) {
    console.error('Error fetching spot details:', error);
    return NextResponse.json({
      error: 'Failed to fetch spot details',
      status: 500
    }, { status: 500 });
  }
}