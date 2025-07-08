// import { useMemo } from "react";

// const useFilter = (data, filterKey, filterValue) => {
//   return useMemo(() => {
//     if (!filterKey || !filterValue) return data;
//     return data.filter((item) =>
//       item[filterKey]?.toString().toLowerCase().includes(filterValue.toLowerCase())
//     );
//   }, [data, filterKey, filterValue]);
// };

// export default useFilter;

import { useState, useMemo } from 'react';

export const useFilter = (items, filterKeys) => {
  const [filters, setFilters] = useState({});

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key])
          .toLowerCase()
          .includes(value.toLowerCase());
      });
    });
  }, [items, filters]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return { filteredItems, updateFilter, filters };
};