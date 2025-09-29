import { UserPreferences, KiteRecommendation } from '@/types';

export function calculateKiteSize(
  windSpeed: number,
  windGust: number,
  userPrefs: UserPreferences
): KiteRecommendation {
  const { weight, skillLevel, discipline } = userPrefs;

  const baseWindSpeed = (windSpeed + windGust) / 2;

  const skillMultipliers: Record<typeof skillLevel, number> = {
    beginner: 1.3,
    intermediate: 1.15,
    advanced: 1.0,
    expert: 0.9
  };

  const disciplineFactors: Record<typeof discipline, { power: number; range: number }> = {
    freeride: { power: 1.0, range: 0.15 },
    freestyle: { power: 1.1, range: 0.1 },
    wave: { power: 0.9, range: 0.2 },
    foil: { power: 0.8, range: 0.25 }
  };

  const skillMultiplier = skillMultipliers[skillLevel];
  const disciplineFactor = disciplineFactors[discipline];

  const windInKnots = windSpeed * 1.944;

  let recommendedSize = (weight * 0.6) / (windInKnots * 0.15) * skillMultiplier * disciplineFactor.power;

  recommendedSize = Math.round(recommendedSize * 2) / 2;
  recommendedSize = Math.max(4, Math.min(18, recommendedSize));

  const alternativeSizes = [
    Math.max(4, recommendedSize - 2),
    Math.min(18, recommendedSize + 2)
  ].filter(size => size !== recommendedSize);

  let conditions: 'perfect' | 'good' | 'marginal' | 'dangerous' = 'good';
  let warning: string | undefined;
  let confidence = 0.85;

  if (windSpeed < 10) {
    conditions = 'marginal';
    warning = 'Wind might be too light for comfortable riding';
    confidence = 0.6;
  } else if (windSpeed > 30) {
    conditions = 'dangerous';
    warning = 'Strong wind conditions - only for experienced riders';
    confidence = 0.7;
  } else if (windGust > windSpeed * 1.5) {
    conditions = 'marginal';
    warning = 'Very gusty conditions - be careful';
    confidence = 0.65;
  } else if (windSpeed >= 15 && windSpeed <= 25) {
    conditions = 'perfect';
    confidence = 0.95;
  }

  if (skillLevel === 'beginner' && windSpeed > 20) {
    conditions = 'dangerous';
    warning = 'Wind too strong for beginners - consider waiting for lighter conditions';
    confidence = 0.9;
  }

  return {
    recommendedSize,
    alternativeSizes,
    conditions,
    warning,
    confidence
  };
}

export function getWindStrengthCategory(windSpeed: number): 'light' | 'moderate' | 'strong' | 'extreme' {
  if (windSpeed < 12) return 'light';
  if (windSpeed < 20) return 'moderate';
  if (windSpeed < 28) return 'strong';
  return 'extreme';
}

export function isSpotKiteable(
  windSpeed: number,
  windDirection: number,
  spotWindDirections: string[],
  minWind: number,
  maxWind: number
): boolean {
  if (windSpeed < minWind || windSpeed > maxWind) {
    return false;
  }

  const windDirString = degreesToCardinal(windDirection);
  return spotWindDirections.includes(windDirString);
}

export function degreesToCardinal(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((degrees % 360) / 45)) % 8;
  return directions[index];
}

export function calculateKiteability(
  windSpeed: number,
  windDirection: number,
  spotWindDirections: string[],
  minWind: number,
  maxWind: number,
  gustiness: number
): number {
  let score = 0;

  const windInRange = windSpeed >= minWind && windSpeed <= maxWind;
  if (!windInRange) return 0;

  const optimalWind = (minWind + maxWind) / 2;
  const windQuality = 1 - Math.abs(windSpeed - optimalWind) / optimalWind;
  score += windQuality * 40;

  const windDirString = degreesToCardinal(windDirection);
  if (spotWindDirections.includes(windDirString)) {
    score += 40;
  } else {
    const adjacentDirs = getAdjacentDirections(windDirString);
    if (adjacentDirs.some(dir => spotWindDirections.includes(dir))) {
      score += 20;
    }
  }

  const gustinessRatio = gustiness / windSpeed;
  if (gustinessRatio < 1.2) {
    score += 20;
  } else if (gustinessRatio < 1.5) {
    score += 10;
  }

  return Math.min(100, Math.max(0, score));
}

function getAdjacentDirections(direction: string): string[] {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = directions.indexOf(direction);
  if (index === -1) return [];

  const prevIndex = (index - 1 + 8) % 8;
  const nextIndex = (index + 1) % 8;

  return [directions[prevIndex], directions[nextIndex]];
}