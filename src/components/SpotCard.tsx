'use client';

import React from 'react';
import { SpotCondition } from '@/types';
import { Wind, MapPin, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { degreesToCardinal } from '@/utils/kiteCalculator';
import clsx from 'clsx';

interface SpotCardProps {
  condition: SpotCondition;
  onClick: () => void;
}

export default function SpotCard({ condition, onClick }: SpotCardProps) {
  const { spot, weather, isKiteable, kiteability, warnings } = condition;

  const getKiteabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getWindStrengthColor = (speed: number) => {
    if (speed < 12) return 'text-gray-500';
    if (speed < 20) return 'text-green-600';
    if (speed < 28) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all hover:shadow-lg border-2',
        isKiteable ? 'border-green-400' : 'border-gray-200'
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{spot.name}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {spot.region}
          </p>
        </div>
        <div className={clsx('px-3 py-1 rounded-full text-sm font-medium', getKiteabilityColor(kiteability))}>
          {Math.round(kiteability)}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Wind className={clsx('w-5 h-5', getWindStrengthColor(weather.windSpeed))} />
          <div>
            <p className="text-sm font-medium">{Math.round(weather.windSpeed)} kts</p>
            <p className="text-xs text-gray-500">
              {degreesToCardinal(weather.windDirection)} ({weather.windDirection}°)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isKiteable ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          <p className="text-sm font-medium">
            {isKiteable ? 'Kiteable' : 'Not Kiteable'}
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-600">
        <p>
          Gusts: {Math.round(weather.windGust)} kts |
          Temp: {Math.round(weather.temperature)}°C |
          {weather.weatherCondition}
        </p>
      </div>

      {warnings.length > 0 && (
        <div className="mt-3 flex items-start gap-1">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-700">
            {warnings[0]}
          </div>
        </div>
      )}

      {spot.waterType === 'lake' && (
        <div className="mt-2 inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
          Lake spot
        </div>
      )}
    </div>
  );
}