import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCallback, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { DataTableProps } from "@/types";

export const DataTable = ({
  table,
  filterColumn = "name",
  filterPlaceholder = "Filter...",
  emptyMessage = "No data found.",
}: DataTableProps) => {
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

  // Memoized pagination controls
  const paginationControls = useMemo(() => {
    const totalPages = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex + 1;

    return (
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    );
  }, [table]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={filterPlaceholder}
            value={filterValue}
            onChange={handleFilterChange}
            className="max-w-sm"
          />
        </div>

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-2 ${
                          header.column.getCanSort() ? "cursor-pointer" : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <span>
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUpNarrowWide className="h-4 w-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDownWideNarrow className="h-4 w-4" />
                            ) : (
                              <ArrowUpNarrowWide className="h-4 w-4 opacity-0" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {paginationControls}
    </div>
  );
};
