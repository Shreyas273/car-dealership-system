import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vehicleApi } from '../api/vehicle.api';
import { VehicleForm } from '../components/VehicleForm';
import { useToast } from '../components/Toast';
import type { VehicleFormData } from '../types/vehicle';

export const AddVehicle = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);
    try {
      await vehicleApi.create(data);
      showToast('Vehicle added successfully!', 'success');
      navigate('/admin');
    } catch {
      showToast('Failed to add vehicle', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/admin"
        className="inline-block text-sm text-slate-400 transition hover:text-white"
      >
        &larr; Back to admin
      </Link>

      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/50 p-6 sm:p-8">
        <h1 className="mb-6 text-2xl font-bold text-white">Add New Vehicle</h1>
        <VehicleForm
          onSubmit={handleSubmit}
          submitLabel="Add Vehicle"
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};
