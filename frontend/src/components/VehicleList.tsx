import type { Vehicle } from '../types/vehicle';
import { VehicleCard } from './VehicleCard';

interface VehicleListProps {
  vehicles: Vehicle[];
  onPurchase?: (id: string) => void;
  purchasingId?: string | null;
  showAdminActions?: boolean;
  onDelete?: (id: string) => void;
  onRestock?: (id: string) => void;
  emptyMessage?: string;
}

export const VehicleList = ({
  vehicles,
  onPurchase,
  purchasingId,
  showAdminActions = false,
  onDelete,
  onRestock,
  emptyMessage = 'No vehicles found.',
}: VehicleListProps) => {
  if (vehicles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/30 py-16 text-center text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onPurchase={onPurchase}
          isPurchasing={purchasingId === vehicle.id}
          showAdminActions={showAdminActions}
          onDelete={onDelete}
          onRestock={onRestock}
        />
      ))}
    </div>
  );
};
