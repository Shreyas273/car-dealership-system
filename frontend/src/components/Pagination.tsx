interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`rounded-lg px-3 py-1.5 text-sm transition ${
            page === currentPage
              ? 'bg-emerald-500 font-medium text-slate-900'
              : 'border border-slate-600 text-slate-300 hover:border-slate-500'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};
