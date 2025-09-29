'use client';

import React from 'react';
import { FilterOptions, WindDirection } from '@/types';
import { Filter, X } from 'lucide-react';
import clsx from 'clsx';

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const regions = [
  'Zuid-Holland',
  'Noord-Holland',
  'Zeeland',
  'Friesland',
  'Flevoland'
];

const windDirections: WindDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export default function FilterPanel({ filters, onFilterChange, isOpen, onToggle }: FilterPanelProps) {
  const handleRegionToggle = (region: string) => {
    const currentRegions = filters.regions || [];
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter(r => r !== region)
      : [...currentRegions, region];
    onFilterChange({ ...filters, regions: newRegions });
  };

  const handleWindDirectionToggle = (direction: WindDirection) => {
    const currentDirs = filters.windDirections || [];
    const newDirs = currentDirs.includes(direction)
      ? currentDirs.filter(d => d !== direction)
      : [...currentDirs, direction];
    onFilterChange({ ...filters, windDirections: newDirs });
  };

  const handleWaterTypeToggle = (type: 'sea' | 'lake' | 'river') => {
    const currentTypes = filters.waterType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onFilterChange({ ...filters, waterType: newTypes });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters =
    (filters.regions?.length || 0) > 0 ||
    (filters.windDirections?.length || 0) > 0 ||
    (filters.waterType?.length || 0) > 0 ||
    filters.tideIndependent ||
    filters.minKiteability !== undefined;

  return (
    <>
      <button
        onClick={onToggle}
        className={clsx(
          'fixed bottom-4 right-4 z-40 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors md:hidden',
          hasActiveFilters && 'ring-2 ring-yellow-400'
        )}
      >
        <Filter className="w-6 h-6" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
            !
          </span>
        )}
      </button>

      <div className={clsx(
        'fixed md:relative inset-0 md:inset-auto z-30 md:z-auto bg-white md:bg-transparent',
        'transform transition-transform md:transform-none',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="h-full md:h-auto bg-white md:rounded-lg md:shadow-md p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex gap-2">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onToggle}
                className="md:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-sm mb-2 text-gray-900">Region</h4>
              <div className="space-y-2">
                {regions.map(region => (
                  <label key={region} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.regions?.includes(region) || false}
                      onChange={() => handleRegionToggle(region)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-900">{region}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2 text-gray-900">Wind Direction</h4>
              <div className="grid grid-cols-4 gap-2">
                {windDirections.map(dir => (
                  <button
                    key={dir}
                    onClick={() => handleWindDirectionToggle(dir)}
                    className={clsx(
                      'py-1 px-2 text-xs rounded transition-colors font-medium',
                      filters.windDirections?.includes(dir)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    )}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2 text-gray-900">Water Type</h4>
              <div className="space-y-2">
                {(['sea', 'lake', 'river'] as const).map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.waterType?.includes(type) || false}
                      onChange={() => handleWaterTypeToggle(type)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm capitalize text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2 text-gray-900">Other</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.tideIndependent || false}
                    onChange={(e) => onFilterChange({ ...filters, tideIndependent: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-900">Tide Independent Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.minKiteability || 0) > 0}
                    onChange={(e) => onFilterChange({
                      ...filters,
                      minKiteability: e.target.checked ? 50 : undefined
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-900">Kiteable Spots Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}