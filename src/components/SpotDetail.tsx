'use client';

import React from 'react';
import { SpotCondition } from '@/types';
import {
  Wind,
  MapPin,
  AlertTriangle,
  Droplets,
  Thermometer,
  Eye,
  X,
  Navigation,
  Waves,
  Info
} from 'lucide-react';
import { degreesToCardinal } from '@/utils/kiteCalculator';
import clsx from 'clsx';

interface SpotDetailProps {
  condition: SpotCondition;
  onClose: () => void;
}

export default function SpotDetail({ condition, onClose }: SpotDetailProps) {
  const { spot, weather, isKiteable, kiteability, warnings } = condition;

  const getKiteabilityColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-bold">{spot.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{spot.region}</span>
              </div>
              <div className={clsx(
                'px-3 py-1 rounded-full text-white font-medium',
                isKiteable ? 'bg-green-500' : 'bg-red-500'
              )}>
                {isKiteable ? 'Kiteable' : 'Not Kiteable'}
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Kiteability Score</span>
                <span className="text-sm font-bold">{Math.round(kiteability)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={clsx('h-3 rounded-full transition-all', getKiteabilityColor(kiteability))}
                  style={{ width: `${kiteability}%` }}
                />
              </div>
            </div>

            {spot.description && (
              <p className="text-sm text-gray-700 italic">{spot.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Wind className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Wind Speed</span>
              </div>
              <p className="text-lg font-bold">{Math.round(weather.windSpeed)} kts</p>
              <p className="text-xs text-gray-500">Gusts: {Math.round(weather.windGust)} kts</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Direction</span>
              </div>
              <p className="text-lg font-bold">{degreesToCardinal(weather.windDirection)}</p>
              <p className="text-xs text-gray-500">{weather.windDirection}°</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Thermometer className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-600">Temperature</span>
              </div>
              <p className="text-lg font-bold">{Math.round(weather.temperature)}°C</p>
              <p className="text-xs text-gray-500">{weather.weatherCondition}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Humidity</span>
              </div>
              <p className="text-lg font-bold">{weather.humidity}%</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="text-xs text-gray-600">Visibility</span>
              </div>
              <p className="text-lg font-bold">
                {weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : 'N/A'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Waves className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Water Type</span>
              </div>
              <p className="text-lg font-bold capitalize">{spot.waterType}</p>
              {spot.tideDependent && (
                <p className="text-xs text-orange-600">Tide dependent</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Warnings</h4>
                    <ul className="text-xs text-yellow-800 space-y-1">
                      {warnings.map((warning, idx) => (
                        <li key={idx}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Spot Information
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Suitable wind directions: </span>
                  <span className="font-medium">{spot.windDirections.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Wind range: </span>
                  <span className="font-medium">{spot.minWindSpeed}-{spot.maxWindSpeed} kts</span>
                </div>
                <div>
                  <span className="text-gray-600">Launch type: </span>
                  <span className="font-medium capitalize">{spot.launchType}</span>
                </div>
              </div>
            </div>

            {spot.facilities && spot.facilities.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Facilities</h4>
                <div className="flex flex-wrap gap-2">
                  {spot.facilities.map((facility, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {spot.restrictions && spot.restrictions.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2 text-red-600">Restrictions</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                  {spot.restrictions.map((restriction, idx) => (
                    <li key={idx}>• {restriction}</li>
                  ))}
                </ul>
              </div>
            )}

            {spot.hazards && spot.hazards.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-1 text-red-600">Hazards</h4>
                <ul className="text-xs text-red-700 space-y-1">
                  {spot.hazards.map((hazard, idx) => (
                    <li key={idx}>• {hazard}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={() => window.open(`https://maps.google.com/?q=${spot.coordinates.lat},${spot.coordinates.lng}`, '_blank')}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Open in Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}