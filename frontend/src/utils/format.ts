const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&auto=format&fit=crop';

export const getVehicleImage = (image?: string) => image || PLACEHOLDER_IMAGE;

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
