import { NextRequest, NextResponse } from 'next/server';
import { kiteSpotsNL } from '@/data/spots';
import { weatherService } from '@/services/weatherService';
import { calculateKiteability, isSpotKiteable } from '@/utils/kiteCalculator';
import { SpotCondition } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region');
    const onlyKiteable = searchParams.get('kiteable') === 'true';

    let spots = kiteSpotsNL;

    if (region) {
      spots = spots.filter(spot => spot.region === region);
    }

    const weatherDataArray = await weatherService.getWeatherForMultipleSpots(spots);

    const spotConditions: SpotCondition[] = spots.map((spot, index) => {
      const weather = weatherDataArray[index];

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

      return {
        spot,
        weather,
        isKiteable,
        kiteability,
        warnings
      };
    });

    const filteredConditions = onlyKiteable
      ? spotConditions.filter(sc => sc.isKiteable)
      : spotConditions;

    const sortedConditions = filteredConditions.sort((a, b) => b.kiteability - a.kiteability);

    return NextResponse.json({
      data: sortedConditions,
      status: 200
    });
  } catch (error) {
    console.error('Error fetching spot conditions:', error);
    return NextResponse.json({
      error: 'Failed to fetch spot conditions',
      status: 500
    }, { status: 500 });
  }
}