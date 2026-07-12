import { useState, type FormEvent } from 'react';
import type { VehicleSearchParams } from '../types/vehicle';

interface SearchBarProps {
  onSearch: (params: VehicleSearchParams) => void;
  onReset: () => void;
  onValidationError?: (message: string) => void;
  isLoading?: boolean;
}

const initialFilters: VehicleSearchParams = {
  make: '',
  model: '',
  category: '',
  minPrice: '',
  maxPrice: '',
};

export const SearchBar = ({
  onSearch,
  onReset,
  onValidationError,
  isLoading = false,
}: SearchBarProps) => {
  const [filters, setFilters] = useState<VehicleSearchParams>(initialFilters);

  const handleChange = (field: keyof VehicleSearchParams, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    handleChange(field, value.replace(/\D/g, ''));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const minPrice = filters.minPrice?.trim() ?? '';
    const maxPrice = filters.maxPrice?.trim() ?? '';

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      onValidationError?.('Min price must be less than or equal to max price');
      return;
    }

    onSearch(filters);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    onReset();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="text"
          placeholder="Make"
          value={filters.make}
          onChange={(e) => handleChange('make', e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Model"
          value={filters.model}
          onChange={(e) => handleChange('model', e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Min Price"
          title="Min price must contain numbers only"
          value={filters.minPrice}
          onChange={(e) => handlePriceChange('minPrice', e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Max Price"
          title="Max price must contain numbers only"
          value={filters.maxPrice}
          onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
          className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500"
        >
          Reset
        </button>
      </div>
    </form>
  );
};
