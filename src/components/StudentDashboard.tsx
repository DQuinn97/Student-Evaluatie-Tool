import { ChartConfig } from "@/components/ui/chart";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { mockStudents } from "@/data/mockStudents";

// Dashboard components
import { DashboardCards } from "./dashboard/DashboardCards";
import { TasksTable } from "./dashboard/TasksTable";
import { FilterSection } from "./dashboard/FilterSection";
import { PerformanceChart } from "./dashboard/PerformanceChart";

// Update chartData mapping to include totalPoints
const chartData = mockStudents[0].tasks
  .sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
  )
  .map((task) => ({
    id: task.id,
    name: task.lecture,
    points: task.gottenPoints,
    totalPoints: task.totalPoints,
    type: task.type,
    klas: task.klas,
    deadline: task.deadline,
    status: task.status,
    feedback: task.feedback,
  }));

const chartConfig = {
  name: {
    label: "Naam",
  },
  points: {
    label: "Punten",
  },
  klas: {
    label: "Klas",
  },
  deadline: {
    label: "Deadline",
  },
  status: {
    label: "Status",
  },
  feedback: {
    label: "Feedback",
  },
} satisfies ChartConfig;

const columns: ColumnDef<(typeof chartData)[number]>[] = [
  {
    accessorKey: "name",
    header: "Taken",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
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
    cell: ({ row }) => {
      try {
        const date = new Date(row.getValue("deadline"));
        return (
          <div>
            {new Intl.DateTimeFormat("nl-NL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(date)}
          </div>
        );
      } catch (e) {
        return <div>{row.getValue("deadline")}</div>;
      }
    },
    enableSorting: true,
    sortDescFirst: false,
  },
  {
    accessorKey: "points",
    header: "Score",
    cell: ({ row }) => (
      <div>{`${row.getValue("points")} / ${row.original.totalPoints}`}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
    cell: ({ row }) => <div>{row.getValue("feedback")}</div>,
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const taskId = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acties</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link to={`/student/taken/${taskId}`} className="block w-full">
                Bekijk in detail
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const StudentDashboard = () => {
  const [klas, setKlas] = useState<string | null>("alle");
  const [type, setType] = useState<string | null>("alle");
  const currentStudent = mockStudents[0];

  const personalAverage = useMemo(
    () =>
      currentStudent.tasks.length > 0
        ? currentStudent.tasks.reduce(
            (acc, curr) => acc + curr.gottenPoints,
            0,
          ) / currentStudent.tasks.length
        : 0,
    [currentStudent.tasks],
  );

  const { classAverage, averageTotalPoints } = useMemo(
    () => ({
      classAverage:
        mockStudents.length > 0
          ? mockStudents
              .flatMap((student) => student.tasks)
              .reduce((acc, curr) => acc + curr.gottenPoints, 0) /
            mockStudents.flatMap((student) => student.tasks).length
          : 0,
      averageTotalPoints:
        mockStudents.length > 0
          ? mockStudents
              .flatMap((student) => student.tasks)
              .reduce((acc, curr) => acc + curr.totalPoints, 0) /
            mockStudents.flatMap((student) => student.tasks).length
          : 0,
    }),
    [],
  );

  const [sorting, setSorting] = useState<SortingState>([
    { id: "deadline", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data: chartData,
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

  return (
    <div>
      <h1 className="ml-4 text-4xl font-bold">
        {currentStudent.name.split(" ")[0]}'s Dashboard
      </h1>
      <DashboardCards
        personalAverage={personalAverage}
        classAverage={classAverage}
        averageTotalPoints={averageTotalPoints}
        completedTasks={
          currentStudent.tasks.filter((task) => task.status === "Ingeleverd")
            .length
        }
        totalTasks={currentStudent.tasks.length}
      />

      <div className="mx-10">
        <h1>Snel overzicht taken</h1>
        <TasksTable table={table} />
      </div>

      <FilterSection
        klas={klas}
        setKlas={setKlas}
        type={type}
        setType={setType}
        tasks={currentStudent.tasks}
      />

      <PerformanceChart
        data={chartData}
        klas={klas}
        type={type}
        config={chartConfig}
      />
    </div>
  );
};
export default StudentDashboard;
