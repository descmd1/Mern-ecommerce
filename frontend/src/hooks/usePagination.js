import { useState, useMemo } from 'react';

export const usePagination = (items, pageSize = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [currentPage, items, pageSize]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
  };
};


// import { useMemo } from "react";

// const usePagination = (data, currentPage, rowsPerPage) => {
//   const totalPages = Math.ceil(data.length / rowsPerPage);

//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     return data.slice(start, start + rowsPerPage);
//   }, [data, currentPage, rowsPerPage]);

//   return { paginatedData, totalPages };
// };

// export default usePagination;
