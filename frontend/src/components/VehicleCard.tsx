import { Link } from 'react-router-dom';
import type { Vehicle } from '../types/vehicle';
import { formatPrice, getVehicleImage } from '../utils/format';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase?: (id: string) => void;
  isPurchasing?: boolean;
  showAdminActions?: boolean;
  onDelete?: (id: string) => void;
  onRestock?: (id: string) => void;
}

export const VehicleCard = ({
  vehicle,
  onPurchase,
  isPurchasing = false,
  showAdminActions = false,
  onDelete,
  onRestock,
}: VehicleCardProps) => {
  const outOfStock = vehicle.quantity === 0;

  return (
    <article className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/50 transition hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5">
      <Link to={`/vehicles/${vehicle.id}`}>
        <img
          src={getVehicleImage(vehicle.image)}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-48 w-full object-cover"
        />
      </Link>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-white">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-slate-400">{vehicle.category}</p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              outOfStock
                ? 'bg-red-500/20 text-red-300'
                : 'bg-emerald-500/20 text-emerald-300'
            }`}
          >
            {outOfStock ? 'Out of stock' : `${vehicle.quantity} in stock`}
          </span>
        </div>

        <p className="text-xl font-bold text-emerald-400">
          {formatPrice(vehicle.price)}
        </p>

        {vehicle.description && (
          <p className="line-clamp-2 text-sm text-slate-400">
            {vehicle.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to={`/vehicles/${vehicle.id}`}
            className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500"
          >
            View Details
          </Link>

          {onPurchase && (
            <button
              type="button"
              disabled={outOfStock || isPurchasing}
              onClick={() => onPurchase(vehicle.id)}
              className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPurchasing ? 'Processing...' : 'Purchase'}
            </button>
          )}

          {showAdminActions && (
            <>
              <Link
                to={`/admin/vehicles/${vehicle.id}/edit`}
                className="rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500"
              >
                Edit
              </Link>
              {onRestock && (
                <button
                  type="button"
                  onClick={() => onRestock(vehicle.id)}
                  className="rounded-lg border border-emerald-600/50 px-3 py-2 text-sm text-emerald-300 transition hover:bg-emerald-500/10"
                >
                  Restock
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(vehicle.id)}
                  className="rounded-lg border border-red-600/50 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
};
