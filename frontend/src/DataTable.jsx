// import React, { useState, useMemo } from 'react';
// import './DataTable.css'; // Or use Tailwind CSS classes directly

// // Custom hook for sorting
// const useSortableData = (items, config = null) => {
//   const [sortConfig, setSortConfig] = useState(config);

//   const sortedItems = useMemo(() => {
//     let sortableItems = [...items];
//     if (sortConfig !== null) {
//       sortableItems.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableItems;
//   }, [items, sortConfig]);

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   return { items: sortedItems, requestSort, sortConfig };
// };

// // Custom hook for pagination
// const usePagination = (items, pageSize = 10) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(items.length / pageSize);
//   const paginatedItems = useMemo(() => {
//     const startIndex = (currentPage - 1) * pageSize;
//     return items.slice(startIndex, startIndex + pageSize);
//   }, [currentPage, items, pageSize]);

//   return {
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     paginatedItems,
//   };
// };

// // Custom hook for filtering
// const useFilter = (items, filterKeys) => {
//   const [filters, setFilters] = useState({});

//   const filteredItems = useMemo(() => {
//     return items.filter((item) => {
//       return Object.entries(filters).every(([key, value]) => {
//         if (!value) return true;
//         return String(item[key])
//           .toLowerCase()
//           .includes(value.toLowerCase());
//       });
//     });
//   }, [items, filters]);

//   const updateFilter = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   return { filteredItems, updateFilter, filters };
// };

// const DataTable = ({
//   data,
//   columns,
//   pageSizeOptions = [10, 25, 50],
//   defaultPageSize = 10,
// }) => {
//   const [pageSize, setPageSize] = useState(defaultPageSize);
//   const [globalFilter, setGlobalFilter] = useState('');

//   // Apply global filter first
//   const globallyFilteredData = useMemo(() => {
//     if (!globalFilter) return data;
//     return data.filter((item) =>
//       columns.some((column) =>
//         String(item[column.key])
//           .toLowerCase()
//           .includes(globalFilter.toLowerCase())
//       )
//     );
//   }, [data, globalFilter, columns]);

//   // Then apply column-specific filters
//   const { filteredItems, updateFilter, filters } = useFilter(
//     globallyFilteredData,
//     columns.map((col) => col.key)
//   );

//   // Then apply sorting
//   const { items, requestSort, sortConfig } = useSortableData(filteredItems);

//   // Then apply pagination
//   const {
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     paginatedItems,
//   } = usePagination(items, pageSize);

//   const handlePageSizeChange = (e) => {
//     setPageSize(Number(e.target.value));
//     setCurrentPage(1); // Reset to first page when page size changes
//   };

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="data-table-container">
//       {/* Global Filter */}
//       <div className="global-filter">
//         <input
//           type="text"
//           placeholder="Search across all columns..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//         />
//       </div>

//       {/* Column Filters */}
//       <div className="column-filters">
//         {columns.map((column) => (
//           <div key={column.key} className="column-filter">
//             <input
//               type="text"
//               placeholder={`Filter ${column.title}...`}
//               value={filters[column.key] || ''}
//               onChange={(e) => updateFilter(column.key, e.target.value)}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="table-wrapper">
//         <table className="data-table">
//           <thead>
//             <tr>
//               {columns.map((column) => (
//                 <th key={column.key}>
//                   <div className="header-content">
//                     <span
//                       onClick={() => requestSort(column.key)}
//                       className="sortable-header"
//                     >
//                       {column.title}
//                     </span>
//                     {sortConfig?.key === column.key && (
//                       <span className="sort-indicator">
//                         {sortConfig.direction === 'ascending' ? '↑' : '↓'}
//                       </span>
//                     )}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedItems.length > 0 ? (
//               paginatedItems.map((item, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {columns.map((column) => (
//                     <td key={`${rowIndex}-${column.key}`}>
//                       {column.render
//                         ? column.render(item[column.key], item)
//                         : item[column.key]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length} className="no-data">
//                   No data found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="pagination-controls">
//         <div className="rows-per-page">
//           <span>Rows per page:</span>
//           <select value={pageSize} onChange={handlePageSizeChange}>
//             {pageSizeOptions.map((size) => (
//               <option key={size} value={size}>
//                 {size}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="page-navigation">
//           <button
//             onClick={() => goToPage(1)}
//             disabled={currentPage === 1}
//           >
//             «
//           </button>
//           <button
//             onClick={() => goToPage(currentPage - 1)}
//             disabled={currentPage === 1}
//           >
//             ‹
//           </button>

//           <span className="page-info">
//             Page {currentPage} of {totalPages}
//           </span>

//           <button
//             onClick={() => goToPage(currentPage + 1)}
//             disabled={currentPage === totalPages || totalPages === 0}
//           >
//             ›
//           </button>
//           <button
//             onClick={() => goToPage(totalPages)}
//             disabled={currentPage === totalPages || totalPages === 0}
//           >
//             »
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;




// import React, { useState, useMemo, useEffect } from 'react';
// import './DataTable.css';

// // Custom hook for sorting (unchanged)
// const useSortableData = (items, config = null) => {
//   const [sortConfig, setSortConfig] = useState(config);

//   const sortedItems = useMemo(() => {
//     let sortableItems = [...items];
//     if (sortConfig !== null) {
//       sortableItems.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableItems;
//   }, [items, sortConfig]);

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   return { items: sortedItems, requestSort, sortConfig };
// };

// // Custom hook for pagination (unchanged)
// const usePagination = (items, pageSize = 10) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(items.length / pageSize);
//   const paginatedItems = useMemo(() => {
//     const startIndex = (currentPage - 1) * pageSize;
//     return items.slice(startIndex, startIndex + pageSize);
//   }, [currentPage, items, pageSize]);

//   return {
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     paginatedItems,
//   };
// };

// // Custom hook for filtering (unchanged)
// const useFilter = (items, filterKeys) => {
//   const [filters, setFilters] = useState({});

//   const filteredItems = useMemo(() => {
//     return items.filter((item) => {
//       return Object.entries(filters).every(([key, value]) => {
//         if (!value) return true;
//         return String(item[key])
//           .toLowerCase()
//           .includes(value.toLowerCase());
//       });
//     });
//   }, [items, filters]);

//   const updateFilter = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   return { filteredItems, updateFilter, filters };
// };

// const DataTable = ({
//   data,
//   columns,
//   pageSizeOptions = [10, 25, 50],
//   defaultPageSize = 10,
// }) => {
//   const [pageSize, setPageSize] = useState(defaultPageSize);
//   const [globalFilter, setGlobalFilter] = useState('');
//   const [isMobile, setIsMobile] = useState(false);

//   // Check for mobile viewport
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Apply global filter first
//   const globallyFilteredData = useMemo(() => {
//     if (!globalFilter) return data;
//     return data.filter((item) =>
//       columns.some((column) =>
//         String(item[column.key])
//           .toLowerCase()
//           .includes(globalFilter.toLowerCase())
//       )
//     );
//   }, [data, globalFilter, columns]);

//   // Then apply column-specific filters
//   const { filteredItems, updateFilter, filters } = useFilter(
//     globallyFilteredData,
//     columns.map((col) => col.key)
//   );

//   // Then apply sorting
//   const { items, requestSort, sortConfig } = useSortableData(filteredItems);

//   // Then apply pagination
//   const {
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     paginatedItems,
//   } = usePagination(items, pageSize);

//   const handlePageSizeChange = (e) => {
//     setPageSize(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   // Mobile-friendly render: card view for each row
//   const renderMobileRow = (item, rowIndex) => (
//     <div key={rowIndex} className="mobile-row">
//       {columns.map((column) => (
//         <div key={`${rowIndex}-${column.key}`} className="mobile-cell">
//           <div className="mobile-cell-header">{column.title}</div>
//           <div className="mobile-cell-content">
//             {column.render ? column.render(item[column.key], item) : item[column.key]}
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="data-table-container">
//       {/* Global Filter */}
//       <div className="global-filter">
//         <input
//           type="text"
//           placeholder="Search across all columns..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//         />
//       </div>

//       {/* Column Filters - hidden on mobile */}
//       {!isMobile && (
//         <div className="column-filters">
//           {columns.map((column) => (
//             <div key={column.key} className="column-filter">
//               <input
//                 type="text"
//                 placeholder={`Filter ${column.title}...`}
//                 value={filters[column.key] || ''}
//                 onChange={(e) => updateFilter(column.key, e.target.value)}
//               />
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Table - desktop view */}
//       {!isMobile ? (
//         <div className="table-wrapper">
//           <table className="data-table">
//             <thead>
//               <tr>
//                 {columns.map((column) => (
//                   <th key={column.key}>
//                     <div className="header-content">
//                       <span
//                         onClick={() => requestSort(column.key)}
//                         className="sortable-header"
//                       >
//                         {column.title}
//                       </span>
//                       {sortConfig?.key === column.key && (
//                         <span className="sort-indicator">
//                           {sortConfig.direction === 'ascending' ? '↑' : '↓'}
//                         </span>
//                       )}
//                     </div>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedItems.length > 0 ? (
//                 paginatedItems.map((item, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {columns.map((column) => (
//                       <td key={`${rowIndex}-${column.key}`}>
//                         {column.render
//                           ? column.render(item[column.key], item)
//                           : item[column.key]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={columns.length} className="no-data">
//                     No data found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         // Mobile view - card layout
//         <div className="mobile-table">
//           {paginatedItems.length > 0 ? (
//             paginatedItems.map((item, rowIndex) => renderMobileRow(item, rowIndex))
//           ) : (
//             <div className="no-data">No data found</div>
//           )}
//         </div>
//       )}

//       {/* Pagination Controls - simplified on mobile */}
//       <div className={`pagination-controls ${isMobile ? 'mobile' : ''}`}>
//         <div className="rows-per-page">
//           {!isMobile && <span>Rows per page:</span>}
//           <select 
//             value={pageSize} 
//             onChange={handlePageSizeChange}
//             aria-label="Rows per page"
//           >
//             {pageSizeOptions.map((size) => (
//               <option key={size} value={size}>
//                 {isMobile ? size : `Show ${size}`}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="page-navigation">
//           <button
//             onClick={() => goToPage(1)}
//             disabled={currentPage === 1}
//             aria-label="First page"
//           >
//             {isMobile ? '«' : 'First'}
//           </button>
//           <button
//             onClick={() => goToPage(currentPage - 1)}
//             disabled={currentPage === 1}
//             aria-label="Previous page"
//           >
//             {isMobile ? '‹' : 'Prev'}
//           </button>

//           {!isMobile && (
//             <span className="page-info">
//               Page {currentPage} of {totalPages}
//             </span>
//           )}

//           <button
//             onClick={() => goToPage(currentPage + 1)}
//             disabled={currentPage === totalPages || totalPages === 0}
//             aria-label="Next page"
//           >
//             {isMobile ? '›' : 'Next'}
//           </button>
//           <button
//             onClick={() => goToPage(totalPages)}
//             disabled={currentPage === totalPages || totalPages === 0}
//             aria-label="Last page"
//           >
//             {isMobile ? '»' : 'Last'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;








// import React, { useState, useMemo, useEffect } from 'react';
// import './DataTable.css';

// // Custom hook for sorting
// const useSortableData = (items, config = null) => {
//   const [sortConfig, setSortConfig] = useState(config);

//   const sortedItems = useMemo(() => {
//     let sortableItems = [...items];
//     if (sortConfig !== null) {
//       sortableItems.sort((a, b) => {
//         if (a[sortConfig.key] < b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? -1 : 1;
//         }
//         if (a[sortConfig.key] > b[sortConfig.key]) {
//           return sortConfig.direction === 'ascending' ? 1 : -1;
//         }
//         return 0;
//       });
//     }
//     return sortableItems;
//   }, [items, sortConfig]);

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (
//       sortConfig &&
//       sortConfig.key === key &&
//       sortConfig.direction === 'ascending'
//     ) {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   return { items: sortedItems, requestSort, sortConfig };
// };

// // Custom hook for pagination
// const usePagination = (items, pageSize = 10) => {
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(items.length / pageSize);
//   const paginatedItems = useMemo(() => {
//     const startIndex = (currentPage - 1) * pageSize;
//     return items.slice(startIndex, startIndex + pageSize);
//   }, [currentPage, items, pageSize]);

//   return {
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     paginatedItems,
//   };
// };

// // Custom hook for filtering
// const useFilter = (items, filterKeys) => {
//   const [filters, setFilters] = useState({});

//   const filteredItems = useMemo(() => {
//     return items.filter((item) => {
//       return Object.entries(filters).every(([key, value]) => {
//         if (!value) return true;
//         return String(item[key])
//           .toLowerCase()
//           .includes(value.toLowerCase());
//       });
//     });
//   }, [items, filters]);

//   const updateFilter = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   return { filteredItems, updateFilter, filters };
// };

// const DataTable = ({
//   data,
//   columns,
//   pageSizeOptions = [10, 25, 50],
//   defaultPageSize = 10,
// }) => {
//   const [pageSize, setPageSize] = useState(defaultPageSize);
//   const [globalFilter, setGlobalFilter] = useState('');
//   const [isSmallScreen, setIsSmallScreen] = useState(false);

//   // Check for small screens
//   useEffect(() => {
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth < 992);
//     };
    
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Apply global filter first
//   const globallyFilteredData = useMemo(() => {
//     if (!globalFilter) return data;
//     return data.filter((item) =>
//       columns.some((column) =>
//         String(item[column.key])
//           .toLowerCase()
//           .includes(globalFilter.toLowerCase())
//       )
//     );
//   }, [data, globalFilter, columns]);

//   // Then apply column-specific filters
//   const { filteredItems, updateFilter, filters } = useFilter(
//     globallyFilteredData,
//     columns.map((col) => col.key)
//   );

//   // Then apply sorting
//   const { items, requestSort, sortConfig } = useSortableData(filteredItems);

//   // Then apply pagination
//   const {
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     paginatedItems,
//   } = usePagination(items, pageSize);

//   const handlePageSizeChange = (e) => {
//     setPageSize(Number(e.target.value));
//     setCurrentPage(1);
//   };

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="data-table-container">
//       {/* Global Filter */}
//       <div className="global-filter">
//         <input
//           type="text"
//           placeholder="Search across all columns..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//         />
//       </div>

//       {/* Column Filters - simplified on small screens */}
//       <div className={`column-filters ${isSmallScreen ? 'small-screen' : ''}`}>
//         {columns.map((column) => (
//           <div key={column.key} className="column-filter">
//             {!isSmallScreen && (
//               <input
//                 type="text"
//                 placeholder={`Filter ${column.title}...`}
//                 value={filters[column.key] || ''}
//                 onChange={(e) => updateFilter(column.key, e.target.value)}
//               />
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Table - always remains as table */}
//       <div className="table-wrapper">
//         <table className="data-table">
//           <thead>
//             <tr>
//               {columns.map((column) => (
//                 <th key={column.key}>
//                   <div className="header-content">
//                     <span
//                       onClick={() => requestSort(column.key)}
//                       className="sortable-header"
//                     >
//                       {isSmallScreen ? column.shortTitle || column.title : column.title}
//                     </span>
//                     {sortConfig?.key === column.key && (
//                       <span className="sort-indicator">
//                         {sortConfig.direction === 'ascending' ? '↑' : '↓'}
//                       </span>
//                     )}
//                   </div>
//                   {isSmallScreen && (
//                     <input
//                       type="text"
//                       placeholder={`Filter...`}
//                       value={filters[column.key] || ''}
//                       onChange={(e) => updateFilter(column.key, e.target.value)}
//                       className="small-screen-filter"
//                     />
//                   )}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedItems.length > 0 ? (
//               paginatedItems.map((item, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {columns.map((column) => (
//                     <td key={`${rowIndex}-${column.key}`} data-label={column.title}>
//                       {column.render
//                         ? column.render(item[column.key], item)
//                         : item[column.key]}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length} className="no-data">
//                   No data found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//      {/* Pagination Controls - visible on all screens */}
// <div className={`pagination-controls ${isSmallScreen ? 'small-screen' : ''}`}>
//   <div className="rows-per-page">
//     {!isSmallScreen && <span>Rows per page:</span>}
//     <select 
//       value={pageSize} 
//       onChange={handlePageSizeChange}
//       aria-label="Rows per page"
//     >
//       {pageSizeOptions.map((size) => (
//         <option key={size} value={size}>
//           {size}
//         </option>
//       ))}
//     </select>
//   </div>

//   <div className="page-navigation">
//     <button
//       onClick={() => goToPage(1)}
//       disabled={currentPage === 1}
//       aria-label="First page"
//     >
//       {isSmallScreen ? '«' : 'First'}
//     </button>
//     <button
//       onClick={() => goToPage(currentPage - 1)}
//       disabled={currentPage === 1}
//       aria-label="Previous page"
//     >
//       {isSmallScreen ? '‹' : 'Prev'}
//     </button>

//     <span className="page-info">
//       Page {currentPage} of {totalPages}
//     </span>

//     <button
//       onClick={() => goToPage(currentPage + 1)}
//       disabled={currentPage === totalPages || totalPages === 0}
//       aria-label="Next page"
//     >
//       {isSmallScreen ? '›' : 'Next'}
//     </button>
//     <button
//       onClick={() => goToPage(totalPages)}
//       disabled={currentPage === totalPages || totalPages === 0}
//       aria-label="Last page"
//     >
//       {isSmallScreen ? '»' : 'Last'}
//     </button>
//   </div>

//       </div>
//     </div>
//   );
// };

// export default DataTable;






// import React, { useState } from "react";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import useSort from "./hooks/useSort";
// import usePagination from "./hooks/usePagination";
// import useFilter from "./hooks/useFilter";

// const DataTable = ({ data, columns, filterKey, rowsPerPageOptions = [10, 25, 50] }) => {
//   const [filter, setFilter] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredData = useFilter(data, filterKey, filter);
//   const { sortedData, sortConfig, handleSort } = useSort(filteredData);
//   const { paginatedData, totalPages } = usePagination(sortedData, currentPage, rowsPerPage);

//   return (
//     <div className="p-4 max-w-full">
//       {filterKey && (
//         <input
//           type="text"
//           className="border p-2 mb-4 w-full rounded shadow-sm"
//           placeholder={`Filter by ${filterKey}`}
//           value={filter}
//           onChange={(e) => {
//             setFilter(e.target.value);
//             setCurrentPage(1);
//           }}
//         />
//       )}

//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="bg-gray-100 text-left">
//             {columns.map((col) => (
//               <th
//                 key={col.key}
//                 className="p-3 cursor-pointer select-none"
//                 onClick={() => handleSort(col.key)}
//               >
//                 <div className="flex items-center gap-1">
//                   {col.label}
//                   {sortConfig.key === col.key && (
//                     sortConfig.direction === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
//                   )}
//                 </div>
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedData.map((row, i) => (
//             <tr key={i} className="border-b hover:bg-gray-50">
//               {columns.map((col) => (
//                 <td key={col.key} className="p-3">
//                   {row[col.key]}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex justify-between items-center mt-4">
//         <div className="flex items-center gap-2">
//           <label>Rows per page:</label>
//           <select
//             value={rowsPerPage}
//             onChange={(e) => {
//               setRowsPerPage(parseInt(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="border p-1 rounded"
//           >
//             {rowsPerPageOptions.map((num) => (
//               <option key={num} value={num}>{num}</option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataTable;







import React, { useState, useMemo, useEffect } from 'react';
import { useSortableData } from './hooks/useSorTableData';
import { usePagination } from './hooks/usePagination';
import { useFilter } from './hooks/useFilter';

const DataTable = ({
  data,
  columns,
  pageSizeOptions = [10, 25, 50],
  defaultPageSize = 10,
}) => {
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply global filter first
  const globallyFilteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((item) =>
      columns.some((column) =>
        String(item[column.key])
          .toLowerCase()
          .includes(globalFilter.toLowerCase())
      )
    );
  }, [data, globalFilter, columns]);

  // Then apply column-specific filters
  const { filteredItems, updateFilter, filters } = useFilter(
    globallyFilteredData,
    columns.map((col) => col.key)
  );

  // Then apply sorting
  const { items, requestSort, sortConfig } = useSortableData(filteredItems);

  // Then apply pagination
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
  } = usePagination(items, pageSize);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-full mx-4 my-6 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Global Filter */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search across all columns..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Column Filters - hidden on mobile */}
      {!isSmallScreen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-4 bg-gray-50">
          {columns.map((column) => (
            <div key={column.key} className="col-span-1">
              <input
                type="text"
                placeholder={`Filter ${column.title}...`}
                value={filters[column.key] || ''}
                onChange={(e) => updateFilter(column.key, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort(column.key)}
                >
                  <div className="flex items-center justify-between">
                    <span>{isSmallScreen ? column.shortTitle || column.title : column.title}</span>
                    {sortConfig?.key === column.key ? (
                      sortConfig.direction === 'ascending' ? (
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )
                    ) : (
                      <svg className="w-4 h-4 ml-2 opacity-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                  {isSmallScreen && (
                    <input
                      type="text"
                      placeholder={`Filter...`}
                      value={filters[column.key] || ''}
                      onChange={(e) => updateFilter(column.key, e.target.value)}
                      className="w-full mt-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      data-label={column.title}
                    >
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="ml-2 pl-3 pr-8 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              First
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Next
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;