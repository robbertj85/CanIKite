'use client';

import React, { useEffect, useRef } from 'react';
import { SpotCondition } from '@/types';
import { MapPin, Wind, CheckCircle, XCircle } from 'lucide-react';
import { degreesToCardinal } from '@/utils/kiteCalculator';
import clsx from 'clsx';
import dynamic from 'next/dynamic';

interface SpotMapProps {
  conditions: SpotCondition[];
  selectedSpotId: string | null;
  onSpotClick: (spotId: string) => void;
}

function SpotMapComponent({ conditions, selectedSpotId, onSpotClick }: SpotMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((L) => {
      // @ts-ignore - CSS imports don't have type declarations
      import('leaflet/dist/leaflet.css');

      if (!mapRef.current && mapContainerRef.current) {
        // Initialize map centered on the Netherlands
        mapRef.current = L.map(mapContainerRef.current, {
          center: [52.3676, 4.9041], // Center of Netherlands
          zoom: 7,
          zoomControl: true,
        });

        // Add OpenStreetMap tiles (free, no API key needed)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapRef.current);
      }

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add markers for each spot
      conditions.forEach(condition => {
        const { spot, weather, isKiteable, kiteability } = condition;

        // Create custom icon HTML
        const iconHtml = `
          <div class="relative">
            <div class="${clsx(
              'rounded-full p-2 shadow-lg border-2 cursor-pointer transform transition-all hover:scale-110',
              isKiteable
                ? 'bg-green-500 border-green-600'
                : 'bg-gray-400 border-gray-500',
              selectedSpotId === spot.id && 'ring-4 ring-blue-500 scale-110'
            )}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
                <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
                <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
              </svg>
            </div>
            <div class="absolute -bottom-1 -right-1 bg-white rounded-full px-1 text-xs font-bold ${
              kiteability >= 80 ? 'text-green-600' :
              kiteability >= 60 ? 'text-yellow-600' :
              kiteability >= 40 ? 'text-orange-600' :
              'text-red-600'
            }">
              ${Math.round(weather.windSpeed)}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([spot.coordinates.lat, spot.coordinates.lng], {
          icon: customIcon
        }).addTo(mapRef.current);

        // Create popup content
        const popupContent = `
          <div class="p-2 min-w-[200px]">
            <h3 class="font-bold text-lg mb-1">${spot.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${spot.region}</p>
            <div class="space-y-1 text-sm">
              <div class="flex justify-between">
                <span>Wind:</span>
                <span class="font-medium">${Math.round(weather.windSpeed)} kts ${degreesToCardinal(weather.windDirection)}</span>
              </div>
              <div class="flex justify-between">
                <span>Kiteability:</span>
                <span class="font-medium">${Math.round(kiteability)}%</span>
              </div>
              <div class="flex justify-between">
                <span>Status:</span>
                <span class="font-medium ${isKiteable ? 'text-green-600' : 'text-red-600'}">
                  ${isKiteable ? 'Kiteable' : 'Not Kiteable'}
                </span>
              </div>
            </div>
            <button class="mt-3 w-full bg-blue-500 text-white py-1 px-2 rounded text-sm hover:bg-blue-600 transition-colors">
              View Details
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        // Handle click events
        marker.on('click', () => {
          onSpotClick(spot.id);
        });

        // Handle popup click on button
        marker.on('popupopen', () => {
          const button = document.querySelector('.leaflet-popup-content button');
          if (button) {
            button.addEventListener('click', () => {
              onSpotClick(spot.id);
            });
          }
        });

        markersRef.current.push(marker);

        // Open popup for selected spot
        if (selectedSpotId === spot.id) {
          marker.openPopup();
        }
      });
    });

    return () => {
      // Cleanup on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [conditions, selectedSpotId, onSpotClick]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="text-sm font-semibold mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Kiteable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            <span>Not Kiteable</span>
          </div>
        </div>
      </div>

      {/* Wind info overlay */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <div className="flex items-center gap-2 text-sm">
          <Wind className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Click spots for details</span>
        </div>
      </div>

      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}

// Export with dynamic import to avoid SSR issues
export default dynamic(() => Promise.resolve(SpotMapComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});