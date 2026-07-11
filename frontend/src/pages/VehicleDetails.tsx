import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { vehicleApi } from '../api/vehicle.api';
import { Loader } from '../components/Loader';
import { useToast } from '../components/Toast';
import type { Vehicle } from '../types/vehicle';
import { formatPrice, getVehicleImage } from '../utils/format';

export const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;

      try {
        const data = await vehicleApi.getById(id);
        setVehicle(data);
      } catch {
        showToast('Vehicle not found', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [id, showToast]);

  const handlePurchase = async () => {
    if (!vehicle) return;

    setIsPurchasing(true);
    try {
      const updated = await vehicleApi.purchase(vehicle.id);
      setVehicle(updated);
      showToast('Purchase successful!', 'success');
    } catch {
      showToast('Purchase failed. Vehicle may be out of stock.', 'error');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return <Loader fullPage label="Loading vehicle details..." />;
  }

  if (!vehicle) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-white">Vehicle not found</h1>
        <Link to="/dashboard" className="mt-4 inline-block text-emerald-400 hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const outOfStock = vehicle.quantity === 0;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/dashboard"
        className="mb-6 inline-block text-sm text-slate-400 transition hover:text-white"
      >
        &larr; Back to inventory
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-800/50">
        <img
          src={getVehicleImage(vehicle.image)}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-72 w-full object-cover sm:h-96"
        />

        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="mt-1 text-slate-400">{vehicle.category}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                outOfStock
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              {outOfStock ? 'Out of stock' : `${vehicle.quantity} available`}
            </span>
          </div>

          <p className="text-3xl font-bold text-emerald-400">
            {formatPrice(vehicle.price)}
          </p>

          {vehicle.description && (
            <p className="text-slate-300 leading-relaxed">{vehicle.description}</p>
          )}

          <button
            type="button"
            disabled={outOfStock || isPurchasing}
            onClick={handlePurchase}
            className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-slate-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPurchasing
              ? 'Processing...'
              : outOfStock
                ? 'Out of Stock'
                : 'Purchase Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
};
