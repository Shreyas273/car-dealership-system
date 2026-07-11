import { useState, type FormEvent } from 'react';
import type { VehicleFormData } from '../types/vehicle';

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData>;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  submitLabel: string;
  isSubmitting?: boolean;
}

const defaultForm: VehicleFormData = {
  make: '',
  model: '',
  category: '',
  price: 0,
  quantity: 0,
  image: '',
  description: '',
};

export const VehicleForm = ({
  initialData,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}: VehicleFormProps) => {
  const [form, setForm] = useState<VehicleFormData>({
    ...defaultForm,
    ...initialData,
  });

  const handleChange = (
    field: keyof VehicleFormData,
    value: string | number,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-slate-300">Make</label>
          <input
            required
            value={form.make}
            onChange={(e) => handleChange('make', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Model</label>
          <input
            required
            value={form.model}
            onChange={(e) => handleChange('model', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Category</label>
          <input
            required
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Price ($)</label>
          <input
            required
            type="number"
            min={0}
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Quantity</label>
          <input
            required
            type="number"
            min={0}
            value={form.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Image URL</label>
          <input
            value={form.image}
            onChange={(e) => handleChange('image', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm text-slate-300">Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-emerald-500 px-6 py-2.5 font-medium text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};
