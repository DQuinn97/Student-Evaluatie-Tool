import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye, Copy, Trash } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Task } from "@/types";

interface TaskColumnsOptions {
  navigate: (path: string) => void;
  onDuplicateTask?: (id: string) => void;
  onDeleteTask?: (id: string) => void;
  publishingTask?: string | null;
  handlePublishToggle?: (taskId: string, isPublished: boolean) => void;
  calculateAverageScore: (task: Task) => number | null;
  totalStudentsByClass: Record<string, number> | number;
  isSimpleView?: boolean;
}

export const getTaskColumns = ({
  navigate,
  onDuplicateTask,
  onDeleteTask,
  publishingTask,
  handlePublishToggle,
  calculateAverageScore,
  totalStudentsByClass,
  isSimpleView = false,
}: TaskColumnsOptions): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "titel",
      header: "Titel",
      cell: ({ row }: { row: Row<any> }) => row.original.titel,
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "deadline",
      header: "Deadline",
      cell: ({ row }: { row: Row<any> }) => {
        const deadline = row.getValue("deadline");
        return (
          <div>
            {format(new Date(deadline as string), "d MMMM yyyy HH:mm", {
              locale: nl,
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "submissions",
      header: "Ingeleverd",
      cell: ({ row }: { row: Row<any> }) => {
        const task = row.original;
        const submissions = task.inzendingen?.length || 0;
        const totalStudents =
          typeof totalStudentsByClass === "number"
            ? totalStudentsByClass
            : totalStudentsByClass[task.klasgroep._id] || 0;

        return (
          <div>
            {submissions} / {totalStudents} studenten
          </div>
        );
      },
    },
    {
      accessorKey: "averageScore",
      header: "Gemiddelde Score",
      cell: ({ row }: { row: Row<any> }) => {
        const task = row.original;
        const average = calculateAverageScore(task);
        const totalGraded = task.inzendingen.filter(
          (inzending: any) => inzending.gradering,
        ).length;

        return (
          <div className="flex flex-col">
            <span>
              {average !== null
                ? `${average.toFixed(1)}/${task.maxScore}`
                : "Geen scores"}
            </span>
            {average !== null && (
              <span className="text-muted-foreground text-xs">
                ({totalGraded} beoordeeld)
              </span>
            )}
          </div>
        );
      },
    },
  ];

  // Only add the publishing switch if the handler is provided
  if (handlePublishToggle) {
    columns.push({
      accessorKey: "isPublished",
      header: "Gepubliceerd",
      cell: ({ row }: { row: Row<any> }) => {
        const task = row.original;
        const isPublished = (task as any).isGepubliceerd ?? false;
        const isLoading = publishingTask === task._id;

        return (
          <Switch
            checked={isPublished}
            disabled={isLoading}
            onCheckedChange={(checked) =>
              handlePublishToggle(task._id, checked)
            }
          />
        );
      },
    });
  }

  // Add action buttons (always at least View)
  columns.push({
    id: "actions",
    cell: ({ row }: { row: Row<any> }) => {
      const task = row.original;

      // For simple view (like in AccordionClassView), just show the view button
      if (isSimpleView) {
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/docent/taken/${task._id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      }

      // For full view (TaskSection), show all action buttons
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/docent/taken/${task._id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {onDuplicateTask && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicateTask(task._id)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}

          {onDeleteTask && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bevestig Verwijderen</AlertDialogTitle>
                  <AlertDialogDescription>
                    Weet je zeker dat je deze taak wilt verwijderen?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteTask(task._id)}>
                    Verwijderen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      );
    },
  });

  return columns;
};
