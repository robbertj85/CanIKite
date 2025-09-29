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
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    if (score >= 40) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-10 z-[70] flex items-center justify-end rounded-lg" onClick={onClose}>
      <div
        className="bg-white h-full w-[90%] sm:w-[40%] overflow-y-auto shadow-2xl animate-slide-in-right relative z-[71]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-4 py-2.5 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">{spot.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-700" />
                <span className="text-sm text-gray-800 font-medium">{spot.region}</span>
              </div>
              <div className={clsx(
                'px-2.5 py-1 rounded-full text-white font-semibold text-xs',
                isKiteable ? 'bg-green-700' : 'bg-red-700'
              )}>
                {isKiteable ? 'Kiteable' : 'Not Kiteable'}
              </div>
            </div>

            <div className="mb-2.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-gray-800">Kiteability Score</span>
                <span className="text-sm font-bold text-gray-900">{Math.round(kiteability)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={clsx('h-2.5 rounded-full transition-all', getKiteabilityColor(kiteability))}
                  style={{ width: `${kiteability}%` }}
                />
              </div>
            </div>

            {spot.description && (
              <p className="text-sm text-gray-800 italic font-medium">{spot.description}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-gray-50 rounded p-2.5 border border-gray-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Wind className="w-3.5 h-3.5 text-blue-700" />
                <span className="text-xs text-gray-700 font-medium">Wind</span>
              </div>
              <p className="text-base font-bold text-gray-900">{Math.round(weather.windSpeed)} kts</p>
              <p className="text-xs text-gray-700">Gusts: {Math.round(weather.windGust)}</p>
            </div>

            <div className="bg-gray-50 rounded p-2.5 border border-gray-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Navigation className="w-3.5 h-3.5 text-blue-700" />
                <span className="text-xs text-gray-700 font-medium">Direction</span>
              </div>
              <p className="text-base font-bold text-gray-900">{degreesToCardinal(weather.windDirection)}</p>
              <p className="text-xs text-gray-700">{weather.windDirection}°</p>
            </div>

            <div className="bg-gray-50 rounded p-2.5 border border-gray-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Thermometer className="w-3.5 h-3.5 text-orange-700" />
                <span className="text-xs text-gray-700 font-medium">Temp</span>
              </div>
              <p className="text-base font-bold text-gray-900">{Math.round(weather.temperature)}°C</p>
              <p className="text-xs text-gray-700 truncate">{weather.weatherCondition}</p>
            </div>

            <div className="bg-gray-50 rounded p-2.5 border border-gray-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-700" />
                <span className="text-xs text-gray-700 font-medium">Humidity</span>
              </div>
              <p className="text-base font-bold text-gray-900">{weather.humidity}%</p>
            </div>

            <div className="bg-gray-50 rounded p-2.5 border border-gray-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Eye className="w-3.5 h-3.5 text-gray-700" />
                <span className="text-xs text-gray-700 font-medium">Visibility</span>
              </div>
              <p className="text-base font-bold text-gray-900">
                {weather.visibility ? `${(weather.visibility / 1000).toFixed(1)}` : 'N/A'}
              </p>
              <p className="text-xs text-gray-700">km</p>
            </div>

            <div className="bg-gray-50 rounded p-2.5 border border-gray-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Waves className="w-3.5 h-3.5 text-blue-700" />
                <span className="text-xs text-gray-700 font-medium">Water</span>
              </div>
              <p className="text-base font-bold capitalize text-gray-900">{spot.waterType}</p>
              {spot.tideDependent && (
                <p className="text-xs text-orange-700 font-semibold">Tide dep.</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-300 rounded p-2.5">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-yellow-900">Warnings</h4>
                    <ul className="text-xs text-yellow-900 space-y-0.5 font-medium">
                      {warnings.map((warning, idx) => (
                        <li key={idx}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5 text-gray-900">
                <Info className="w-4 h-4 text-blue-700" />
                Spot Information
              </h4>
              <div className="space-y-1.5 text-sm">
                <div>
                  <span className="text-gray-700">Suitable wind directions: </span>
                  <span className="font-semibold text-gray-900">{spot.windDirections.join(', ')}</span>
                </div>
                <div>
                  <span className="text-gray-700">Wind range: </span>
                  <span className="font-semibold text-gray-900">{spot.minWindSpeed}-{spot.maxWindSpeed} kts</span>
                </div>
                <div>
                  <span className="text-gray-700">Launch type: </span>
                  <span className="font-semibold capitalize text-gray-900">{spot.launchType}</span>
                </div>
              </div>
            </div>

            {spot.facilities && spot.facilities.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2 text-gray-900">Facilities</h4>
                <div className="flex flex-wrap gap-2">
                  {spot.facilities.map((facility, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium border border-blue-200"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {spot.restrictions && spot.restrictions.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-1.5 text-red-700">Restrictions</h4>
                <ul className="text-xs text-gray-800 space-y-0.5 font-medium">
                  {spot.restrictions.map((restriction, idx) => (
                    <li key={idx}>• {restriction}</li>
                  ))}
                </ul>
              </div>
            )}

            {spot.hazards && spot.hazards.length > 0 && (
              <div className="bg-red-50 border border-red-300 rounded p-2.5">
                <h4 className="font-semibold text-sm mb-1 text-red-800">Hazards</h4>
                <ul className="text-xs text-red-900 space-y-0.5 font-medium">
                  {spot.hazards.map((hazard, idx) => (
                    <li key={idx}>• {hazard}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-3 border-t">
            <button
              onClick={() => window.open(`https://maps.google.com/?q=${spot.coordinates.lat},${spot.coordinates.lng}`, '_blank')}
              className="w-full bg-primary-600 text-white py-2.5 rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
            >
              Open in Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}