import { Button } from "@/components/ui/button";
import { Plus, Copy, Trash, Eye } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { DataTable } from "../shared/DataTable";
import { useTableConfig } from "@/hooks/useTableConfig";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { useNavigate } from "react-router";
import { Task } from "@/types/class";
import { Row } from "@tanstack/react-table";
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

type TaskSectionProps = {
  tasks: Task[];
  isLoading: boolean;
  onCreateTask: () => void;
  onDuplicateTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  selectedClass: string | null;
};

export const TaskSection = ({
  tasks,
  isLoading,
  onCreateTask,
  onDuplicateTask,
  onDeleteTask,
  selectedClass,
}: TaskSectionProps) => {
  const navigate = useNavigate();

  const calculateAverageScore = (task: Task) => {
    const gradedSubmissions = task.inzendingen.filter(
      (inzending) => inzending.gradering && inzending.gradering.length > 0,
    );

    if (gradedSubmissions.length === 0) return null;

    const totalScore = gradedSubmissions.reduce((acc, inzending) => {
      const graderingScore = inzending.gradering[0]?.score || 0;
      const graderingMaxScore = inzending.gradering[0]?.maxscore || task.weging;
      return acc + (graderingScore / graderingMaxScore) * 100;
    }, 0);

    return totalScore / gradedSubmissions.length;
  };

  const taskColumns = [
    {
      accessorKey: "titel",
      header: "Titel",
      cell: ({ row }: { row: Row<Task> }) => row.original.titel,
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "deadline",
      header: "Deadline",
      cell: ({ row }: { row: Row<Task> }) => {
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
      accessorKey: "averageScore",
      header: "Gemiddelde Score",
      cell: ({ row }: { row: Row<Task> }) => {
        const average = calculateAverageScore(row.original);
        return (
          <div>
            {average !== null ? `${average.toFixed(1)}%` : "Geen scores"}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row<Task> }) => {
        const task = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/docent/taken/${task._id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicateTask(task._id)}
            >
              <Copy className="h-4 w-4" />
            </Button>
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
          </div>
        );
      },
    },
  ];

  const table = useTableConfig({
    data: tasks,
    columns: taskColumns,
    pageSize: 10,
  });

  return (
    <AccordionItem value="tasks">
      <div className="flex items-center justify-between border-b">
        <AccordionTrigger className="flex-1 hover:no-underline">
          <h3 className="text-xl font-semibold">Taken & Toetsen</h3>
        </AccordionTrigger>
        <Button
          onClick={onCreateTask}
          disabled={!selectedClass || isLoading}
          className="m-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe Taak
        </Button>
      </div>
      <AccordionContent>
        {isLoading ? (
          <div className="text-muted-foreground">Laden...</div>
        ) : (
          <DataTable
            table={table}
            filterColumn="titel"
            filterPlaceholder="Zoek taken..."
            showRowSelection={false}
            emptyMessage="Geen taken gevonden."
          />
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
