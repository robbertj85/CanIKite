'use client';

import React, { useState, useEffect } from 'react';
import { FilterOptions, SpotCondition } from '@/types';
import { useSpotConditions, useSpotDetail } from '@/hooks/useSpotConditions';
import SpotList from '@/components/SpotList';
import SpotDetail from '@/components/SpotDetail';
import FilterPanel from '@/components/FilterPanel';
import KiteSizeCalculator from '@/components/KiteSizeCalculator';
import SpotMap from '@/components/SpotMap';
import { Wind, MapPin, RefreshCw, Info, Map, List } from 'lucide-react';
import clsx from 'clsx';

export default function Home() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [averageWindSpeed, setAverageWindSpeed] = useState(0);
  const [averageWindGust, setAverageWindGust] = useState(0);

  const { conditions, loading, error } = useSpotConditions(filters);
  const { spotCondition } = useSpotDetail(selectedSpotId);

  useEffect(() => {
    if (conditions.length > 0) {
      const avgSpeed = conditions.reduce((sum, c) => sum + c.weather.windSpeed, 0) / conditions.length;
      const avgGust = conditions.reduce((sum, c) => sum + c.weather.windGust, 0) / conditions.length;
      setAverageWindSpeed(avgSpeed);
      setAverageWindGust(avgGust);
    }
  }, [conditions]);

  const handleRefresh = () => {
    window.location.reload();
    setLastUpdate(new Date());
  };

  const kiteableCount = conditions.filter(c => c.isKiteable).length;
  const totalCount = conditions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Can I Kite?</h1>
                <p className="text-xs text-gray-600">Real-time kitesurf conditions NL</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={clsx(
                    'px-3 py-1 rounded transition-colors flex items-center gap-1',
                    viewMode === 'map'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={clsx(
                    'px-3 py-1 rounded transition-colors flex items-center gap-1',
                    viewMode === 'list'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
              <button
                onClick={handleRefresh}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Kiteable Now</p>
                <p className="text-2xl font-bold text-green-600">{kiteableCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spots</p>
                <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Wind</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(averageWindSpeed)} kts
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Update</p>
                <p className="text-sm font-medium text-gray-700">
                  {lastUpdate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="hidden md:block">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                isOpen={true}
                onToggle={() => {}}
              />
            </div>
            <div className="mt-6 hidden md:block">
              <KiteSizeCalculator
                windSpeed={averageWindSpeed}
                windGust={averageWindGust}
              />
            </div>
          </div>

          <div className="md:col-span-3">
            {viewMode === 'map' ? (
              <div className="h-[700px] w-full relative">
                <SpotMap
                  conditions={conditions}
                  selectedSpotId={selectedSpotId}
                  onSpotClick={setSelectedSpotId}
                />
                {spotCondition && viewMode === 'map' && (
                  <SpotDetail
                    condition={spotCondition}
                    onClose={() => setSelectedSpotId(null)}
                  />
                )}
              </div>
            ) : (
              <SpotList
                conditions={conditions}
                loading={loading}
                error={error}
                onSpotClick={setSelectedSpotId}
              />
            )}
          </div>
        </div>

        <div className="md:hidden">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            isOpen={filterPanelOpen}
            onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
          />
        </div>

        <div className="md:hidden mt-6">
          <KiteSizeCalculator
            windSpeed={averageWindSpeed}
            windGust={averageWindGust}
          />
        </div>
      </div>

      {spotCondition && viewMode === 'list' && (
        <SpotDetail
          condition={spotCondition}
          onClose={() => setSelectedSpotId(null)}
        />
      )}

      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Info className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-600">
                Live weather data from Open-Meteo. Always check conditions on-site before kiting.
              </p>
            </div>
            <p className="text-xs text-gray-500">
              © 2024 Can I Kite? | Made with ❤️ for the Dutch kitesurf community | No API keys needed!
            </p>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">Data Sources & Updates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-800 mb-2">Weather Data</h4>
                <p className="text-xs text-gray-700 mb-1">
                  Source: <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Open-Meteo API</a>
                </p>
                <p className="text-xs text-gray-600">
                  Live weather conditions including wind speed, direction, temperature, and more.
                  Data refreshed every hour from meteorological stations.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Last fetched: {new Date().toLocaleString('nl-NL')}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-800 mb-2">Spot Information</h4>
                <p className="text-xs text-gray-700 mb-1">
                  Sources: Local kitesurfing communities, NKV, and spot guides
                </p>
                <p className="text-xs text-gray-600">
                  Kitespot details including facilities, restrictions, hazards, and suitable conditions
                  are curated from trusted local sources and community feedback.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Total spots: {conditions.length} | Active update: {lastUpdate.toLocaleString('nl-NL')}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenStreetMap</a> contributors
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}