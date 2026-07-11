const ITEMS_PER_PAGE = 6;

export const paginate = <T,>(items: T[], page: number, perPage = ITEMS_PER_PAGE) => {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const paginatedItems = items.slice(start, start + perPage);

  return { paginatedItems, totalPages, currentPage };
};

export { ITEMS_PER_PAGE };
