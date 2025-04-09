import { useTableState } from "@/hooks/useTableState";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Table,
} from "@tanstack/react-table";

import { UseTableConfigProps } from "@/types";

export function useTableConfig<TData>({
  data,
  columns,
  pageSize = 5,
}: UseTableConfigProps<TData>): Table<TData> {
  const tableState = useTableState(pageSize);

  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => {
      tableState.setSorting(
        typeof updater === "function" ? updater(tableState.sorting) : updater,
      );
    },
    onColumnFiltersChange: (updater) => {
      tableState.setColumnFilters(
        typeof updater === "function"
          ? updater(tableState.columnFilters)
          : updater,
      );
    },
    onColumnVisibilityChange: (updater) => {
      tableState.setColumnVisibility(
        typeof updater === "function"
          ? updater(tableState.columnVisibility)
          : updater,
      );
    },
    onPaginationChange: (updater) => {
      tableState.setPagination(
        typeof updater === "function"
          ? updater(tableState.pagination)
          : updater,
      );
    },
    state: {
      sorting: tableState.sorting,
      columnFilters: tableState.columnFilters,
      columnVisibility: tableState.columnVisibility,
      pagination: tableState.pagination,
    },
  });
}
