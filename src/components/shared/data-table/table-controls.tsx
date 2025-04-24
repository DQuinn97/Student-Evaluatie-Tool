import { DataTableProps } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { TableSearch } from "./table-search";

interface TableControlsProps {
  filterValue: string;
  handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterPlaceholder: string;
  table: DataTableProps["table"];
  isMobile: boolean;
  handleClearFilter: () => void;
}

/**
 * Table controls component for filtering and page size selection
 */
export const TableControls = ({
  filterValue,
  handleFilterChange,
  filterPlaceholder,
  table,
  isMobile,
  handleClearFilter,
}: TableControlsProps) => (
  <div
    className={`${isMobile ? "flex flex-col gap-4" : "flex items-center justify-between"} py-4`}
  >
    <TableSearch
      value={filterValue}
      onChange={handleFilterChange}
      placeholder={filterPlaceholder}
      className={`${isMobile ? "w-full" : "max-w-sm"}`}
      onClear={handleClearFilter}
    />

    <Select
      value={table.getState().pagination.pageSize.toString()}
      onValueChange={(value) => {
        table.setPageSize(Number(value));
      }}
    >
      <SelectTrigger className="h-8 w-[70px]">
        <SelectValue placeholder={table.getState().pagination.pageSize} />
      </SelectTrigger>
      <SelectContent side="top">
        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
          <SelectItem key={pageSize} value={pageSize.toString()}>
            {pageSize}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
