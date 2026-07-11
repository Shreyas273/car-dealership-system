import { useCallback, useEffect, useState } from 'react';
import { vehicleApi } from '../api/vehicle.api';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import { VehicleList } from '../components/VehicleList';
import { useToast } from '../components/Toast';
import type { Vehicle } from '../types/vehicle';
import { paginate } from '../utils/pagination';

export const Dashboard = () => {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchVehicles = useCallback(async () => {
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
    fetchVehicles();
  }, [fetchVehicles]);

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

  if (isLoading) {
    return <Loader fullPage label="Loading vehicles..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Vehicle Inventory</h1>
        <p className="mt-1 text-slate-400">
          Browse our available vehicles and purchase directly
        </p>
      </div>

      <VehicleList
        vehicles={paginatedItems}
        onPurchase={handlePurchase}
        purchasingId={purchasingId}
        emptyMessage="No vehicles available right now. Check back soon!"
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
