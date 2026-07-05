export function pagination(
  totalItems: number,
  currentPage: number,
  pageSize: number,
  count: number,
): {
  total: number;
  current_page: number;
  count: number;
  per_page: number;
  pages: number[];
} {
  // calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);
  // ensure current page isn't out of range
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  // calculate start and end item indexes
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
  // create an array of pages
  const pages = Array.from(Array(totalPages).keys()).map((i) => i + 1);
  // return object with all pager properties required by the view
  return {
    total: totalItems,
    current_page: currentPage,
    count,
    per_page: pageSize,
    pages,
  };
}
