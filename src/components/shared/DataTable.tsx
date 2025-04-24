import { useCallback, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { DataTableProps } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  TableControls,
  TablePagination,
  MobileCardView,
  DesktopTableView,
} from "./data-table";

/**
 * DataTable component that adapts to mobile and desktop views
 * Uses a card-based layout on mobile and traditional table on desktop
 */
export const DataTable = ({
  table,
  filterColumn = "name",
  filterPlaceholder = "Filter...",
  emptyMessage = "No data found.",
}: DataTableProps) => {
  const isMobile = useIsMobile();
  const [filterValue, setFilterValue] = useState("");

  // Debounce the filter change handler
  const debouncedFilterChange = useMemo(
    () =>
      debounce((value: string) => {
        table.getColumn(filterColumn)?.setFilterValue(value);
      }, 300),
    [table, filterColumn],
  );

  // Memoized handler for filter input changes
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFilterValue(value);
      debouncedFilterChange(value);
    },
    [debouncedFilterChange],
  );

  const handleClearFilter = useCallback(() => {
    setFilterValue("");
    table.getColumn(filterColumn)?.setFilterValue("");
  }, [table, filterColumn]);

  return (
    <div className="w-full">
      <TableControls
        filterValue={filterValue}
        handleFilterChange={handleFilterChange}
        filterPlaceholder={filterPlaceholder}
        table={table}
        isMobile={isMobile}
        handleClearFilter={handleClearFilter}
      />

      {isMobile ? (
        <MobileCardView table={table} emptyMessage={emptyMessage} />
      ) : (
        <DesktopTableView table={table} emptyMessage={emptyMessage} />
      )}

      <TablePagination table={table} isMobile={isMobile} />
    </div>
  );
};
