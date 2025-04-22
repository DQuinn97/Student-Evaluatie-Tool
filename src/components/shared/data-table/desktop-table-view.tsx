import { DataTableProps } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { flexRender } from "@tanstack/react-table";
import { ArrowUpNarrowWide, ArrowDownWideNarrow } from "lucide-react";

interface DesktopTableViewProps {
  table: DataTableProps["table"];
  emptyMessage: string;
}

/**
 * Traditional table view for desktop screens
 */
export const DesktopTableView = ({
  table,
  emptyMessage,
}: DesktopTableViewProps) => (
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
              className="hover:bg-muted/50"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className="text-muted-foreground h-24 text-center"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
