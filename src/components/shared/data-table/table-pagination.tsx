import { Button } from "../../ui/button";
import { DataTableProps } from "@/types";

interface TablePaginationProps {
  table: DataTableProps["table"];
  isMobile: boolean;
}

/**
 * Pagination controls for data tables
 */
export const TablePagination = ({ table, isMobile }: TablePaginationProps) => (
  <div className="flex items-center justify-between py-4">
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
      className={isMobile ? "w-20" : ""}
    >
      {isMobile ? "Prev" : "Previous"}
    </Button>
    <span className="text-sm font-medium">
      {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
    </span>
    <Button
      variant="outline"
      size="sm"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
      className={isMobile ? "w-20" : ""}
    >
      Next
    </Button>
  </div>
);
