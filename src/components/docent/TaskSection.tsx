import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { DataTable } from "../shared/DataTable";
import { useTableConfig } from "@/hooks/useTableConfig";
import { useNavigate } from "react-router";
import { Task } from "@/types";
import { useState, useEffect } from "react";
import api from "@/api";
import { toast } from "sonner";
import { getTaskColumns } from "../table/taskColumns";

type TaskSectionProps = {
  tasks: Task[];
  isLoading: boolean;
  onCreateTask: () => void;
  onDuplicateTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask?: (id: string, updatedFields: Partial<Task>) => void;
  selectedClass: string | null;
};

export const TaskSection = ({
  tasks,
  isLoading,
  onCreateTask,
  onDuplicateTask,
  onDeleteTask,
  onUpdateTask,
  selectedClass,
}: TaskSectionProps) => {
  const navigate = useNavigate();
  const [publishingTask, setPublishingTask] = useState<string | null>(null);
  const [totalStudentsByClass, setTotalStudentsByClass] = useState<
    Record<string, number>
  >({});

  // Fetch total students for the selected class
  useEffect(() => {
    const fetchTotalStudents = async () => {
      if (!selectedClass) return;

      try {
        const { data } = await api.get(`/klassen/${selectedClass}`);
        if (data && data.studenten) {
          setTotalStudentsByClass((prev) => ({
            ...prev,
            [selectedClass]: data.studenten.length || 0,
          }));
        }
      } catch (error) {
        console.error("Error fetching total students:", error);
      }
    };

    fetchTotalStudents();
  }, [selectedClass]);

  const handlePublishToggle = async (taskId: string, isPublished: boolean) => {
    setPublishingTask(taskId);
    try {
      await api.patch(`/taken/${taskId}`, {
        isGepubliceerd: isPublished,
      });

      // Update state in the parent component
      if (onUpdateTask) {
        onUpdateTask(taskId, { isGepubliceerd: isPublished });
      }

      toast.success(
        isPublished
          ? "Taak gepubliceerd"
          : "Taak niet meer zichtbaar voor studenten",
      );
    } catch (error) {
      toast.error(
        "Er is een fout opgetreden bij het wijzigen van de publicatiestatus",
      );
      console.error(error);
    } finally {
      setPublishingTask(null);
    }
  };

  const calculateAverageScore = (task: Task) => {
    const gradedSubmissions = task.inzendingen.filter(
      (inzending) => inzending.gradering,
    );

    if (gradedSubmissions.length === 0) return null;

    const totalScore = gradedSubmissions.reduce((acc, inzending) => {
      const graderingScore = inzending.gradering?.score || 0;
      const graderingMaxScore = task.maxScore || 100;
      return acc + (graderingScore / graderingMaxScore) * 100;
    }, 0);

    return totalScore / gradedSubmissions.length;
  };

  // Use the reusable task columns component
  const taskColumns = getTaskColumns({
    navigate,
    onDuplicateTask,
    onDeleteTask,
    publishingTask,
    handlePublishToggle,
    calculateAverageScore,
    totalStudentsByClass,
  });

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
