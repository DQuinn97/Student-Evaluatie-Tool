import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Link } from "react-router";

export type StudentRow = {
  taakId: string;
  lecture: string;
  type: string;
  klas?: string;
  deadline: string;
  status: string;
  hasGradering: boolean;
  gottenPoints: number;
  totalPoints: number;
  feedback: string;
};

export const studentColumns = (isDocent: boolean): ColumnDef<StudentRow>[] => [
  {
    accessorKey: "lecture",
    header: "Taken",
    cell: ({ row }: { row: Row<StudentRow> }) => (
      <div>{row.getValue("lecture")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }: { row: Row<StudentRow> }) => (
      <div>{row.getValue("type")}</div>
    ),
    enableSorting: true,
  },
  ...(isDocent
    ? [
        {
          accessorKey: "klas",
          header: "Klas",
          cell: ({ row }: { row: Row<StudentRow> }) => (
            <div>{row.getValue("klas")}</div>
          ),
          enableSorting: true,
        },
      ]
    : []),
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: Row<StudentRow> }) => (
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
    cell: ({ row }: { row: Row<StudentRow> }) => {
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
    accessorKey: "score",
    header: "Score",
    cell: ({ row }: { row: Row<StudentRow> }) => {
      const hasScore = row.original.hasGradering;
      const points = row.original.gottenPoints;
      const total = row.original.totalPoints;

      if (!hasScore) {
        return <div>-/-</div>;
      }

      const percentage = total > 0 ? ((points / total) * 100).toFixed(1) : 0;
      return (
        <div className="flex items-center gap-2">
          <span>
            {points}/{total}
          </span>
          <span className="text-muted-foreground text-sm">({percentage}%)</span>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
    cell: ({ row }: { row: Row<StudentRow> }) => (
      <div>{row.getValue("feedback")}</div>
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }: { row: Row<StudentRow> }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acties</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              to={`/student/taken/${row.original.taakId}`}
              className="block w-full"
            >
              Bekijk in detail
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
