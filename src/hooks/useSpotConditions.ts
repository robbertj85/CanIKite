import { useState, useEffect } from 'react';
import axios from 'axios';
import { SpotCondition, FilterOptions } from '@/types';

export function useSpotConditions(filters?: FilterOptions) {
  const [conditions, setConditions] = useState<SpotCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters?.regions?.length) {
          params.append('region', filters.regions[0]);
        }
        if (filters?.minKiteability !== undefined) {
          params.append('kiteable', 'true');
        }

        const response = await axios.get(`/api/spots?${params.toString()}`);

        let filteredData = response.data.data || [];

        if (filters?.windDirections?.length) {
          filteredData = filteredData.filter((sc: SpotCondition) =>
            sc.spot.windDirections.some(dir => filters.windDirections?.includes(dir))
          );
        }

        if (filters?.tideIndependent) {
          filteredData = filteredData.filter((sc: SpotCondition) => !sc.spot.tideDependent);
        }

        if (filters?.waterType?.length) {
          filteredData = filteredData.filter((sc: SpotCondition) =>
            filters.waterType?.includes(sc.spot.waterType)
          );
        }

        if (filters?.minKiteability !== undefined) {
          filteredData = filteredData.filter((sc: SpotCondition) =>
            sc.kiteability >= filters.minKiteability!
          );
        }

        setConditions(filteredData);
      } catch (err) {
        console.error('Failed to fetch spot conditions:', err);
        setError('Failed to load spot conditions');
      } finally {
        setLoading(false);
      }
    };

    fetchConditions();
    const interval = setInterval(fetchConditions, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [filters]);

  return { conditions, loading, error };
}

export function useSpotDetail(spotId: string | null) {
  const [spotCondition, setSpotCondition] = useState<SpotCondition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spotId) {
      setSpotCondition(null);
      return;
    }

    const fetchSpotDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`/api/spots/${spotId}`);
        setSpotCondition(response.data.data);
      } catch (err) {
        console.error('Failed to fetch spot detail:', err);
        setError('Failed to load spot details');
      } finally {
        setLoading(false);
      }
    };

    fetchSpotDetail();
  }, [spotId]);

  return { spotCondition, loading, error };
}