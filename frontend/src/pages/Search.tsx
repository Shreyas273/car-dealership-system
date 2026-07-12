import { useCallback, useEffect, useState } from 'react';
import { vehicleApi } from '../api/vehicle.api';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';
import { VehicleList } from '../components/VehicleList';
import { useToast } from '../components/Toast';
import type { Vehicle, VehicleSearchParams } from '../types/vehicle';
import { paginate } from '../utils/pagination';

export const Search = () => {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await vehicleApi.getAll();
      setVehicles(data);
    } catch {
      showToast('Failed to load vehicles', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleSearch = async (params: VehicleSearchParams) => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentPage(1);

    try {
      const cleanedParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== ''),
      ) as VehicleSearchParams;

      const data = Object.keys(cleanedParams).length
        ? await vehicleApi.search(cleanedParams)
        : await vehicleApi.getAll();

      setVehicles(data);
    } catch {
      showToast('Search failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setHasSearched(false);
    setCurrentPage(1);
    fetchAll();
  };

  const handlePurchase = async (id: string) => {
    setPurchasingId(id);
    try {
      const updated = await vehicleApi.purchase(id);
      setVehicles((prev) =>
        prev.map((vehicle) => (vehicle.id === id ? updated : vehicle)),
      );
      showToast('Purchase successful!', 'success');
    } catch {
      showToast('Purchase failed. Vehicle may be out of stock.', 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  const { paginatedItems, totalPages } = paginate(vehicles, currentPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Search Vehicles</h1>
        <p className="mt-1 text-slate-400">
          Filter by make, model, category, or price range
        </p>
      </div>

      <SearchBar
        onSearch={handleSearch}
        onReset={handleReset}
        onValidationError={(message) => showToast(message, 'error')}
        isLoading={isLoading}
      />

      {isLoading ? (
        <Loader label="Searching vehicles..." />
      ) : (
        <>
          <VehicleList
            vehicles={paginatedItems}
            onPurchase={handlePurchase}
            purchasingId={purchasingId}
            emptyMessage={
              hasSearched
                ? 'No vehicles match your search criteria.'
                : 'No vehicles available.'
            }
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};
