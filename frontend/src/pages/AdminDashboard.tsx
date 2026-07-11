import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vehicleApi } from '../api/vehicle.api';
import { Loader } from '../components/Loader';
import { VehicleList } from '../components/VehicleList';
import { useToast } from '../components/Toast';
import type { Vehicle } from '../types/vehicle';

export const AdminDashboard = () => {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await vehicleApi.delete(id);
      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
      showToast('Vehicle deleted', 'success');
    } catch {
      showToast('Failed to delete vehicle', 'error');
    }
  };

  const handleRestock = async (id: string) => {
    const amountInput = window.prompt('Enter restock amount:', '5');
    if (!amountInput) return;

    const amount = Number(amountInput);
    if (!Number.isInteger(amount) || amount < 1) {
      showToast('Please enter a valid positive number', 'error');
      return;
    }

    try {
      const updated = await vehicleApi.restock(id, amount);
      setVehicles((prev) =>
        prev.map((vehicle) => (vehicle.id === id ? updated : vehicle)),
      );
      showToast(`Restocked ${amount} units`, 'success');
    } catch {
      showToast('Restock failed', 'error');
    }
  };

  if (isLoading) {
    return <Loader fullPage label="Loading admin dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-slate-400">
            Manage inventory, restock, and delete vehicles
          </p>
        </div>
        <Link
          to="/admin/vehicles/new"
          className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-slate-900 transition hover:bg-emerald-400"
        >
          Add Vehicle
        </Link>
      </div>

      <VehicleList
        vehicles={vehicles}
        showAdminActions
        onDelete={handleDelete}
        onRestock={handleRestock}
        emptyMessage="No vehicles in inventory. Add your first vehicle."
      />
    </div>
  );
};
