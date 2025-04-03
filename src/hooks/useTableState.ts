import { useState } from "react";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

export interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  pagination: PaginationState;
  setSorting: (value: SortingState) => void;
  setColumnFilters: (value: ColumnFiltersState) => void;
  setColumnVisibility: (value: VisibilityState) => void;
  setPagination: (value: PaginationState) => void;
}

export const useTableState = (defaultPageSize = 5): TableState => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "deadline", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  return {
    sorting,
    columnFilters,
    columnVisibility,
    pagination,
    setSorting,
    setColumnFilters,
    setColumnVisibility,
    setPagination,
  };
};
