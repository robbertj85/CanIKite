import axios from 'axios';
import { WeatherData, KiteSpot } from '@/types';

export class WeatherService {
  private static instance: WeatherService;
  private cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getWeatherForSpot(spot: KiteSpot): Promise<WeatherData> {
    const cacheKey = spot.id;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Try Open-Meteo API first (completely free, no API key needed)
      const weatherData = await this.fetchOpenMeteoData(spot);

      if (weatherData) {
        this.cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
        return weatherData;
      }
    } catch (error) {
      console.error(`Failed to fetch weather for ${spot.name}:`, error);
    }

    // Fallback to mock data
    return this.getMockWeatherData(spot);
  }

  private async fetchOpenMeteoData(spot: KiteSpot): Promise<WeatherData | null> {
    try {
      // Open-Meteo API - completely free, no signup required
      const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: spot.coordinates.lat,
          longitude: spot.coordinates.lng,
          current: 'temperature_2m,relative_humidity_2m,surface_pressure,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
          wind_speed_unit: 'kn', // knots
          timezone: 'Europe/Amsterdam'
        }
      });

      const current = response.data.current;

      // Map weather codes to conditions
      const weatherCondition = this.mapWeatherCode(current.weather_code);

      return {
        spotId: spot.id,
        timestamp: new Date(),
        windSpeed: current.wind_speed_10m || 0,
        windDirection: current.wind_direction_10m || 0,
        windGust: current.wind_gusts_10m || current.wind_speed_10m || 0,
        temperature: current.temperature_2m || 15,
        pressure: current.surface_pressure || 1013,
        humidity: current.relative_humidity_2m || 70,
        weatherCondition: weatherCondition,
        weatherIcon: this.getWeatherIcon(current.weather_code),
        visibility: 10000 // Open-Meteo doesn't provide visibility
      };
    } catch (error) {
      console.error('Open-Meteo API error:', error);
      return null;
    }
  }

  private mapWeatherCode(code: number): string {
    // WMO Weather interpretation codes
    // https://open-meteo.com/en/docs
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 57) return 'Drizzle';
    if (code <= 67) return 'Rain';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  }

  private getWeatherIcon(code: number): string {
    if (code === 0) return '01d';
    if (code <= 3) return '02d';
    if (code <= 48) return '50d';
    if (code <= 67) return '10d';
    if (code <= 77) return '13d';
    if (code <= 99) return '11d';
    return '01d';
  }

  async getWeatherForMultipleSpots(spots: KiteSpot[]): Promise<WeatherData[]> {
    // Batch request to reduce API calls
    const uniqueCoordinates = new Map<string, KiteSpot[]>();

    // Group spots by similar coordinates (within 0.1 degrees)
    spots.forEach(spot => {
      const key = `${Math.round(spot.coordinates.lat * 10) / 10}_${Math.round(spot.coordinates.lng * 10) / 10}`;
      if (!uniqueCoordinates.has(key)) {
        uniqueCoordinates.set(key, []);
      }
      uniqueCoordinates.get(key)!.push(spot);
    });

    const weatherDataArray: WeatherData[] = [];

    // Fetch weather for each unique coordinate group
    for (const [_, spotsGroup] of Array.from(uniqueCoordinates)) {
      const representativeSpot = spotsGroup[0];
      const weatherData = await this.getWeatherForSpot(representativeSpot);

      // Apply the same weather to all spots in the group
      spotsGroup.forEach(spot => {
        weatherDataArray.push({
          ...weatherData,
          spotId: spot.id
        });
      });
    }

    return weatherDataArray;
  }

  private getMockWeatherData(spot: KiteSpot): WeatherData {
    // Enhanced mock data that varies by spot location
    const latFactor = spot.coordinates.lat / 52; // Normalize around Dutch latitude
    const lngFactor = spot.coordinates.lng / 5; // Normalize around Dutch longitude

    const baseWindSpeed = 10 + (latFactor * 8) + (Math.sin(Date.now() / 3600000) * 5);
    const mockWindSpeed = Math.max(5, Math.min(30, baseWindSpeed + Math.random() * 10));

    // Prevailing winds in NL are SW
    const baseDirection = 225; // SW
    const mockWindDirection = (baseDirection + (lngFactor * 45) + Math.random() * 90) % 360;

    return {
      spotId: spot.id,
      timestamp: new Date(),
      windSpeed: mockWindSpeed,
      windDirection: Math.round(mockWindDirection),
      windGust: mockWindSpeed + Math.random() * 5,
      temperature: 12 + Math.random() * 10 + (Math.sin(Date.now() / 3600000) * 5),
      pressure: 1010 + Math.random() * 20,
      humidity: 60 + Math.random() * 30,
      weatherCondition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
      weatherIcon: '02d',
      visibility: 10000
    };
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const weatherService = WeatherService.getInstance();