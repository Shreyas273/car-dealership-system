interface LoaderProps {
  fullPage?: boolean;
  label?: string;
}

export const Loader = ({ fullPage = false, label = 'Loading...' }: LoaderProps) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-600 border-t-emerald-400" />
      <p className="text-sm text-slate-400">{label}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-12">{spinner}</div>;
};
