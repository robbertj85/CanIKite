export interface KiteSpot {
  id: string;
  name: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  windDirections: WindDirection[];
  tideDependent: boolean;
  minWindSpeed: number;
  maxWindSpeed: number;
  description?: string;
  restrictions?: string[];
  facilities?: string[];
  waterType: 'sea' | 'lake' | 'river';
  launchType: 'beach' | 'grass' | 'concrete';
  hazards?: string[];
}

export type WindDirection = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

export interface WeatherData {
  spotId: string;
  timestamp: Date;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  temperature: number;
  pressure: number;
  humidity: number;
  weatherCondition: string;
  weatherIcon: string;
  visibility?: number;
}

export interface TideData {
  spotId: string;
  timestamp: Date;
  height: number;
  type: 'high' | 'low';
  next?: {
    time: Date;
    type: 'high' | 'low';
    height: number;
  };
}

export interface UserPreferences {
  weight: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  discipline: 'freeride' | 'freestyle' | 'wave' | 'foil';
  kiteRange?: number[];
}

export interface KiteRecommendation {
  recommendedSize: number;
  alternativeSizes: number[];
  conditions: 'perfect' | 'good' | 'marginal' | 'dangerous';
  warning?: string;
  confidence: number;
}

export interface SpotCondition {
  spot: KiteSpot;
  weather: WeatherData;
  tide?: TideData;
  isKiteable: boolean;
  kiteability: number;
  warnings: string[];
  recommendation?: KiteRecommendation;
}

export interface FilterOptions {
  regions?: string[];
  windDirections?: WindDirection[];
  tideIndependent?: boolean;
  minKiteability?: number;
  waterType?: ('sea' | 'lake' | 'river')[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}