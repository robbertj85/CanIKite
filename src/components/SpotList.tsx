'use client';

import React from 'react';
import { SpotCondition } from '@/types';
import SpotCard from './SpotCard';
import { Loader2 } from 'lucide-react';

interface SpotListProps {
  conditions: SpotCondition[];
  loading: boolean;
  error: string | null;
  onSpotClick: (spotId: string) => void;
}

export default function SpotList({ conditions, loading, error, onSpotClick }: SpotListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (conditions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No spots match your criteria</p>
      </div>
    );
  }

  const kiteableSpots = conditions.filter(c => c.isKiteable);
  const nonKiteableSpots = conditions.filter(c => !c.isKiteable);

  return (
    <div className="space-y-6">
      {kiteableSpots.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Kiteable Now ({kiteableSpots.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kiteableSpots.map((condition) => (
              <SpotCard
                key={condition.spot.id}
                condition={condition}
                onClick={() => onSpotClick(condition.spot.id)}
              />
            ))}
          </div>
        </div>
      )}

      {nonKiteableSpots.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-600 mb-3">
            Not Kiteable ({nonKiteableSpots.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 opacity-75">
            {nonKiteableSpots.map((condition) => (
              <SpotCard
                key={condition.spot.id}
                condition={condition}
                onClick={() => onSpotClick(condition.spot.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}