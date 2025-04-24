import { TaskDetail } from "@/types";
import { DataTable } from "../shared/DataTable";
import { useTableConfig } from "@/hooks/useTableConfig";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface SubmissionsTableProps {
  submissions: TaskDetail["inzendingen"];
  maxScore: number;
  onReviewClick?: (index: number) => void;
}

export const SubmissionsTable = ({
  submissions,
  maxScore,
  onReviewClick,
}: SubmissionsTableProps) => {
  const columns: ColumnDef<TaskDetail["inzendingen"][number]>[] = [
    {
      id: "student",
      header: "Student",
      cell: ({ row }) => {
        const student = row.original.student;
        if (student?.naam && student?.achternaam) {
          return `${student.naam} ${student.achternaam}`;
        }
        return student?.email;
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const hasGradering = row.original.gradering;
        return (
          <Badge variant={hasGradering ? "success" : "default"}>
            {hasGradering ? "Beoordeeld" : "Niet beoordeeld"}
          </Badge>
        );
      },
    },
    {
      id: "score",
      header: "Score",
      cell: ({ row }) => {
        const score = row.original.gradering?.score;
        if (score === undefined) return "-/-";
        return `${score}/${maxScore}`;
      },
    },
    {
      id: "feedback",
      header: "Feedback",
      cell: ({ row }) => {
        const feedback = row.original.gradering?.feedback;
        if (feedback) {
          return feedback.length > 50
            ? `${feedback.slice(0, 50)}...`
            : feedback;
        }
        return "-";
      },
    },
    {
      id: "actions",
      header: "Acties",
      cell: ({ row }) => {
        const rowIndex = row.index;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReviewClick?.(rowIndex)}
          >
            {row.original.gradering ? "Bekijk" : "Beoordelen"}
          </Button>
        );
      },
    },
  ];

  const table = useTableConfig({
    data: submissions,
    columns,
    pageSize: 10,
  });

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Inzendingen</h2>
      <DataTable
        table={table}
        filterColumn="student"
        filterPlaceholder="Filter op student..."
        showRowSelection={false}
        emptyMessage="Geen inzendingen gevonden."
      />
    </div>
  );
};
