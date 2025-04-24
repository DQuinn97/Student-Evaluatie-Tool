import { Button } from "../ui/button";
import { TaskHeader } from "./TaskHeader";
import { TaskMetrics } from "./TaskMetrics";
import { TaskDescription } from "./TaskDescription";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router";
import { ArrowLeft, Edit } from "lucide-react";
import { TaskDetail as ITaskDetail } from "../../types";
import { CreateTaskForm } from "./CreateTaskForm";
import { SubmissionsTable } from "./SubmissionsTable";
import { TaskSubmissionReview } from "./TaskSubmissionReview";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../api";

interface DocentTaskDetailProps {
  task: ITaskDetail | null;
  klasId?: string | null;
  isNewTask?: boolean;
  isEditMode?: boolean;
  onTaskCreated?: (taskId: string) => void;
}

export const DocentTaskDetail = ({
  task,
  klasId,
  isNewTask,
  isEditMode,
  onTaskCreated,
}: DocentTaskDetailProps) => {
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(
    null,
  );
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState(task);

  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  useEffect(() => {
    const fetchTotalStudents = async () => {
      if (currentTask?.klasgroep?._id) {
        try {
          const { data } = await api.get(
            `/klassen/${currentTask.klasgroep._id}`,
          );
          setTotalStudents(data.studenten?.length ?? 0);
        } catch (error) {
          console.error("Error fetching total students:", error);
          setTotalStudents(0);
        }
      }
    };

    fetchTotalStudents();
  }, [currentTask?.klasgroep?._id]);

  const handleGradingUpdate = async () => {
    if (!currentTask?._id) return;

    try {
      // Haal de bijgewerkte taakgegevens op
      const { data } = await api.get(`/taken/${currentTask._id}`);
      setCurrentTask(data);
    } catch (error) {
      console.error("Error refreshing task data:", error);
      toast.error("Kon de taakgegevens niet verversen");
    }
  };

  if (!currentTask && !isNewTask) {
    return null;
  }

  // For creating new task
  if (isNewTask && klasId) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/docent/klasbeheer")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Nieuwe taak aanmaken</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <p className="text-muted-foreground">
              Klas: {currentTask?.klasgroep.naam}
            </p>
          </div>
        </div>

        <CreateTaskForm
          klasId={klasId}
          onTaskCreated={onTaskCreated || (() => {})}
        />
      </div>
    );
  }

  // For editing existing task
  if (isEditMode && currentTask && klasId) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/docent/klasbeheer")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Taak bewerken</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            <p className="text-muted-foreground">
              Klas: {currentTask.klasgroep.naam}
            </p>
          </div>
        </div>

        <CreateTaskForm
          klasId={klasId}
          onTaskCreated={onTaskCreated || (() => {})}
          initialTask={currentTask}
        />
      </div>
    );
  }

  // For viewing existing task
  if (currentTask) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/docent/klasbeheer")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/docent/taken/${currentTask._id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Bewerken
          </Button>
        </div>

        <TaskHeader
          lecture={currentTask.titel}
          klas={currentTask.klasgroep.naam}
          type={currentTask.type}
        />

        <TaskMetrics
          deadline={currentTask.deadline}
          status={currentTask.inzendingen?.length > 0 ? "Ingeleverd" : "Open"}
          gottenPoints={
            currentTask.inzendingen
              ?.filter((inzending) => inzending.gradering)
              .reduce(
                (sum, inzending) => sum + (inzending.gradering?.score ?? 0),
                0,
              ) /
            (currentTask.inzendingen?.filter((inzending) => inzending.gradering)
              .length || 1)
          }
          totalPoints={currentTask.maxScore ?? 100}
          isDocent={true}
          submittedCount={currentTask.inzendingen?.length ?? 0}
          totalStudents={totalStudents}
        />

        <TaskDescription
          id={currentTask._id}
          klas={currentTask.klasgroep.naam}
          type={currentTask.type}
          beschrijving={currentTask.beschrijving}
          deadline={currentTask.deadline}
          maxScore={currentTask.maxScore ?? 100}
        />

        <Separator className="my-8" />

        {selectedSubmission !== null ? (
          <div>
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setSelectedSubmission(null)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar overzicht
            </Button>
            <TaskSubmissionReview
              submission={currentTask.inzendingen[selectedSubmission]}
              maxScore={currentTask.maxScore ?? 100}
              onGradingUpdate={handleGradingUpdate}
            />
          </div>
        ) : (
          <SubmissionsTable
            submissions={currentTask.inzendingen}
            maxScore={currentTask.maxScore ?? 100}
            onReviewClick={(index) => setSelectedSubmission(index)}
          />
        )}
      </div>
    );
  }

  return null;
};
