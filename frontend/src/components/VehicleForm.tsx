import { useState, type FormEvent } from 'react';
import type { VehicleFormData } from '../types/vehicle';

const TEXT_PATTERN = /^[A-Za-z\s'-]+$/;
const DIGITS_PATTERN = /^\d+$/;

const textFields = ['make', 'model', 'category'] as const;
const numericFields = ['price', 'quantity'] as const;

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData>;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onCancel?: () => void;
  onValidationError?: (message: string) => void;
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
  onCancel,
  onValidationError,
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

  const handleTextChange = (field: 'make' | 'model' | 'category', value: string) => {
    handleChange(field, value.replace(/\d/g, ''));
  };

  const handleNumericChange = (field: 'price' | 'quantity', value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    handleChange(field, digitsOnly === '' ? 0 : Number(digitsOnly));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    for (const field of textFields) {
      if (!TEXT_PATTERN.test(form[field].trim())) {
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        onValidationError?.(`${label} must contain letters only`);
        return;
      }
    }

    for (const field of numericFields) {
      const value = String(form[field]);
      if (!DIGITS_PATTERN.test(value)) {
        const label = field.charAt(0).toUpperCase() + field.slice(1);
        onValidationError?.(`${label} must contain numbers only`);
        return;
      }
    }

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
            pattern="[A-Za-z\s'-]+"
            title="Make must contain letters only"
            onChange={(e) => handleTextChange('make', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Model</label>
          <input
            required
            value={form.model}
            pattern="[A-Za-z\s'-]+"
            title="Model must contain letters only"
            onChange={(e) => handleTextChange('model', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Category</label>
          <input
            required
            value={form.category}
            pattern="[A-Za-z\s'-]+"
            title="Category must contain letters only"
            onChange={(e) => handleTextChange('category', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Price ($)</label>
          <input
            required
            type="text"
            inputMode="numeric"
            pattern="[0-9]+"
            title="Price must contain numbers only"
            value={form.price}
            onChange={(e) => handleNumericChange('price', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-300">Quantity</label>
          <input
            required
            type="text"
            inputMode="numeric"
            pattern="[0-9]+"
            title="Quantity must contain numbers only"
            value={form.quantity}
            onChange={(e) => handleNumericChange('quantity', e.target.value)}
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

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-emerald-500 px-6 py-2.5 font-medium text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-600 px-6 py-2.5 font-medium text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
