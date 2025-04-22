import { Input } from "@/components/ui/input";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Trash2 } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type FileUploadProps = {
  files: File[];
  setFiles: (files: File[]) => void;
};

export const FileUpload = ({ files, setFiles }: FileUploadProps) => {
  const isMobile = useIsMobile();

  const columns: ColumnDef<File>[] = [
    {
      accessorKey: "name",
      header: isMobile ? "Bestand" : "Filename",
      cell: ({ row }) => (
        <div className={`truncate ${isMobile ? "max-w-[120px]" : ""}`}>
          {row.original.name.replace(/\.[^.]+$/, "")}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="truncate">{row.original.type.split("/")[1]}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "size",
      header: isMobile ? "Grootte" : "Size",
      cell: ({ row }) => {
        const size = row.original.size;
        return size > 1024 * 1024 * 1024
          ? `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
          : size > 1024 * 1024
            ? `${(size / (1024 * 1024)).toFixed(2)} MB`
            : size > 1024
              ? `${(size / 1024).toFixed(2)} KB`
              : `${size} bytes`;
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          type="button"
          className="text-destructive-foreground"
          onClick={() => setFiles(files.filter((f) => f !== row.original))}
        >
          <Trash2
            className={`text-white ${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
          />
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: files,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <FormItem>
      <FormLabel className="mt-4 font-semibold">Bijlagen</FormLabel>
      <FormControl>
        <Input
          type="file"
          multiple
          onChange={(e) => {
            setFiles([...files, ...Array.from(e.target.files ?? [])]);
          }}
        />
      </FormControl>
      <FormControl>
        {files.length > 0 && (
          <div className="overflow-x-auto">
            <Table className={isMobile ? "text-sm" : ""}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={cn(
                          header.column.getCanSort() && "cursor-pointer",
                          isMobile && "px-2 py-2",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === "asc" ? (
                            <ArrowUpNarrowWide
                              className={`ml-1 ${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
                            />
                          ) : (
                            <ArrowDownWideNarrow
                              className={`ml-1 ${isMobile ? "h-3 w-3" : "h-4 w-4"}`}
                            />
                          )
                        ) : null}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={isMobile ? "px-2 py-2" : ""}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </FormControl>
    </FormItem>
  );
};
