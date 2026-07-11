export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-700/60 bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
        Car Dealership Inventory System &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
};
