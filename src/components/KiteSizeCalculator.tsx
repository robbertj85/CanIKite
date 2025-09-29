'use client';

import React, { useState } from 'react';
import { UserPreferences, KiteRecommendation } from '@/types';
import axios from 'axios';
import { Calculator, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface KiteSizeCalculatorProps {
  windSpeed: number;
  windGust: number;
}

export default function KiteSizeCalculator({ windSpeed, windGust }: KiteSizeCalculatorProps) {
  const [userPrefs, setUserPrefs] = useState<UserPreferences>({
    weight: 75,
    skillLevel: 'intermediate',
    discipline: 'freeride',
  });
  const [recommendation, setRecommendation] = useState<KiteRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const calculateSize = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/kite-size', {
        windSpeed,
        windGust,
        userPreferences: userPrefs,
      });
      setRecommendation(response.data.data);
    } catch (error) {
      console.error('Failed to calculate kite size:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'perfect': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'marginal': return 'text-yellow-600 bg-yellow-50';
      case 'dangerous': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Kite Size Calculator</h3>
        </div>
        <span className="text-sm text-gray-700">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={userPrefs.weight}
                onChange={(e) => setUserPrefs({ ...userPrefs, weight: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                min="40"
                max="150"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Skill Level
              </label>
              <select
                value={userPrefs.skillLevel}
                onChange={(e) => setUserPrefs({
                  ...userPrefs,
                  skillLevel: e.target.value as UserPreferences['skillLevel']
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Discipline
              </label>
              <select
                value={userPrefs.discipline}
                onChange={(e) => setUserPrefs({
                  ...userPrefs,
                  discipline: e.target.value as UserPreferences['discipline']
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
              >
                <option value="freeride">Freeride</option>
                <option value="freestyle">Freestyle</option>
                <option value="wave">Wave</option>
                <option value="foil">Foil</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-900">
              <p>Current conditions:</p>
              <p className="font-medium">
                Wind: {Math.round(windSpeed)} kts (gusts {Math.round(windGust)} kts)
              </p>
            </div>
          </div>

          <button
            onClick={calculateSize}
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4" />
                Calculate Kite Size
              </>
            )}
          </button>

          {recommendation && (
            <div className="border-t pt-4 space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-900 mb-1">Recommended Kite Size</p>
                <p className="text-3xl font-bold text-primary-600">
                  {recommendation.recommendedSize}m²
                </p>
                {recommendation.alternativeSizes.length > 0 && (
                  <p className="text-sm text-gray-700 mt-1">
                    Alternatives: {recommendation.alternativeSizes.join('m, ')}m
                  </p>
                )}
              </div>

              <div className={clsx(
                'rounded-lg px-3 py-2 text-sm font-medium text-center',
                getConditionColor(recommendation.conditions)
              )}>
                <div className="flex items-center justify-center gap-1">
                  {recommendation.conditions === 'perfect' || recommendation.conditions === 'good' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  {recommendation.conditions.charAt(0).toUpperCase() + recommendation.conditions.slice(1)} Conditions
                </div>
              </div>

              {recommendation.warning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">{recommendation.warning}</p>
                  </div>
                </div>
              )}

              <div className="text-center">
                <p className="text-xs text-gray-700">
                  Confidence: {Math.round(recommendation.confidence * 100)}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}