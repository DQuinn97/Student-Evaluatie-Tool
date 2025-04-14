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

  useEffect(() => {
    const fetchTotalStudents = async () => {
      if (task?.klasgroep?._id) {
        try {
          const { data } = await api.get(`/klassen/${task.klasgroep._id}`);
          setTotalStudents(data.studenten?.length ?? 0);
        } catch (error) {
          console.error("Error fetching total students:", error);
          setTotalStudents(0);
        }
      }
    };

    fetchTotalStudents();
  }, [task?.klasgroep?._id]);

  if (!task && !isNewTask) {
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
              Klas: {task?.klasgroep.naam}
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
  if (isEditMode && task && klasId) {
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
            <p className="text-muted-foreground">Klas: {task.klasgroep.naam}</p>
          </div>
        </div>

        <CreateTaskForm
          klasId={klasId}
          onTaskCreated={onTaskCreated || (() => {})}
          initialTask={task}
        />
      </div>
    );
  }

  // For viewing existing task
  if (task) {
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
            onClick={() => navigate(`/docent/taken/${task._id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Bewerken
          </Button>
        </div>

        <TaskHeader
          lecture={task.titel}
          klas={task.klasgroep.naam}
          type={task.type}
        />

        <TaskMetrics
          deadline={task.deadline}
          status={task.inzendingen?.length > 0 ? "Ingeleverd" : "Open"}
          gottenPoints={
            task.inzendingen?.reduce(
              (sum, inzending) => sum + (inzending.gradering?.[0]?.score ?? 0),
              0,
            ) / (task.inzendingen?.length || 1)
          }
          totalPoints={task.weging}
          isDocent={true}
          submittedCount={task.inzendingen?.length ?? 0}
          totalStudents={totalStudents}
        />

        <TaskDescription
          id={task._id}
          klas={task.klasgroep.naam}
          type={task.type}
          beschrijving={task.beschrijving}
          deadline={task.deadline}
          maxScore={task.weging}
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
              submission={task.inzendingen[selectedSubmission]}
              maxScore={task.weging}
            />
          </div>
        ) : (
          <SubmissionsTable
            submissions={task.inzendingen}
            maxScore={task.weging}
            onReviewClick={(index) => setSelectedSubmission(index)}
          />
        )}
      </div>
    );
  }

  return null;
};
