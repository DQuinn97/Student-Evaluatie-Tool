import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Student } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Link } from "react-router";

export const studentColumns: ColumnDef<Student>[] = [
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
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const hasScore = row.original.hasGradering; // This will be true if there's a grading
      const points = row.original.gottenPoints;
      const total = row.original.totalPoints;

      // Only show -/- if there's no grading
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
    cell: ({ row }) => <div>{row.getValue("feedback")}</div>,
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }) => (
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
