import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  TrendingUp,
  UsersRound,
  ClipboardCheck,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const student = {
  id: 1,
  name: "John Doe",
  tasks: [
    ...Array.from({ length: 10 }).map(() => ({
      id: Math.random().toString(36).substring(2, 10),
      lecture: `Lecture ${Math.floor(Math.random() * 10)}`,
      klas: "React",
      type: ["taak", "toets"][Math.floor(Math.random() * 2)],
      deadline: new Date(
        Date.now() + Math.floor(Math.random() * 10000000000),
      ).toLocaleDateString("nl-NL", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      status: ["Bezig", "Te laat", "Ingeleverd"][Math.floor(Math.random() * 3)],
      gottenPoints: Math.floor(Math.random() * 10),
      totalPoints: Math.floor(Math.random() * 10),
      feedback: Math.random() > 0.5 ? "Goed gedaan, John!" : "",
    })),
  ],
};

// Define columns for React Table
const columns: ColumnDef<(typeof student.tasks)[0]>[] = [
  {
    accessorKey: "lecture",
    header: "Taken",
    cell: ({ row }) => <div>{row.getValue("lecture")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "klas",
    header: "Klas",
    cell: ({ row }) => <div>{row.getValue("klas")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.getValue("status") === "Ingeleverd"
            ? "success"
            : row.getValue("status") === "Te laat"
              ? "destructive"
              : "default"
        }
      >
        {row.getValue("status")}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => <div>{row.getValue("deadline")}</div>,
    enableSorting: true,
    sortDescFirst: true,
  },
  {
    accessorKey: "gottenPoints",
    header: "Score",
    cell: ({ row }) => (
      <div>
        {row.getValue("gottenPoints")} / {row.getValue("totalPoints")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
    cell: ({ row }) => <div>{row.getValue("feedback")}</div>,
    enableSorting: true,
  },
];

const StudentTaken = () => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "deadline", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data: student.tasks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  const average =
    student.tasks.reduce((acc, curr) => acc + curr.gottenPoints, 0) /
    student.tasks.reduce((acc, curr) => acc + curr.totalPoints, 0);

  return (
    <>
      <div>
        <h1 className="ml-6 text-4xl font-bold">Taken</h1>
      </div>
      <div className="my-10 flex gap-4 px-6">
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-4">
            <TrendingUp />
            <CardTitle>Jouw gemiddelde</CardTitle>
            <CardDescription className="text-center">
              {(average * 100).toFixed(1)}%
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-4">
            <UsersRound />
            <CardTitle>Klas gemiddelde</CardTitle>
            <CardDescription className="text-center">
              {(average * 100).toFixed(1)}%
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-4">
            <ClipboardCheck />
            <CardTitle>Ingeleverde taken</CardTitle>
            <CardDescription className="text-center">
              {
                student.tasks.filter((task) => task.status === "Ingeleverd")
                  .length
              }{" "}
              / {student.tasks.length}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="mx-10">
        <h1>Overzicht taken</h1>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter taken..."
              value={
                (table.getColumn("lecture")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("lecture")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {/* Render the header rows. */}
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {/* Render the header cells. */}
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {/* Render the header content through the header hook. */}
                        <span
                          onClick={() => header.column.toggleSorting()}
                          className="flex cursor-pointer items-center gap-1"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {/* If the column is sorted, show an arrow pointing up or down. */}
                          {header.column.getIsSorted() ? (
                            <ArrowUpDown
                              className={`${
                                header.column.getIsSorted() === "desc"
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          ) : (
                            <ArrowUpDown className="opacity-0" />
                          )}
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {/* Render the data rows. */}
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {/* Render the data cells. */}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {/* Render the cell content through the cell hook. */}
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
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentTaken;
