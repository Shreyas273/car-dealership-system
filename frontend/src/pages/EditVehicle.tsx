import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { vehicleApi } from '../api/vehicle.api';
import { Loader } from '../components/Loader';
import { VehicleForm } from '../components/VehicleForm';
import { useToast } from '../components/Toast';
import type { Vehicle, VehicleFormData } from '../types/vehicle';

export const EditVehicle = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: VehicleFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await vehicleApi.update(id, data);
      showToast('Vehicle updated successfully!', 'success');
      navigate('/admin');
    } catch {
      showToast('Failed to update vehicle', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader fullPage label="Loading vehicle..." />;
  }

  if (!vehicle) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-white">Vehicle not found</h1>
        <Link to="/admin" className="mt-4 inline-block text-emerald-400 hover:underline">
          Back to admin
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/admin"
        className="inline-block text-sm text-slate-400 transition hover:text-white"
      >
        &larr; Back to admin
      </Link>

      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-6 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-white">
          Edit {vehicle.make} {vehicle.model}
        </h1>
        <VehicleForm
          initialData={vehicle}
          onSubmit={handleSubmit}
          onValidationError={(message) => showToast(message, 'error')}
          submitLabel="Save Changes"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
