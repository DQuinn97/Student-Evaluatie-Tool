import { Separator } from "./ui/separator";
import { TaskHeader } from "./task-detail/TaskHeader";
import { TaskMetrics } from "./task-detail/TaskMetrics";
import { TaskDescription } from "./task-detail/TaskDescription";
import { TaskSubmissionForm } from "./task-detail/TaskSubmissionForm";
import { TaskFeedback } from "./task-detail/TaskFeedback";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { TaskDetail as ITaskDetail } from "../types";
import api from "../api";

export const TaskDetail = () => {
  const { id, taakId } = useParams<{ id?: string; taakId?: string }>();
  const taskId = id || taakId;
  const isDocent = Boolean(id);
  const navigate = useNavigate();
  const [task, setTask] = useState<ITaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!taskId) {
          throw new Error("Geen taak ID gevonden");
        }

        setIsLoading(true);
        setError(null);

        const { data: taskData } = await api.get(`/taken/${taskId}`);
        setTask(taskData);
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message);
          setError(err.message);
        } else {
          toast.error("Er is een onbekende fout opgetreden");
          setError("Er is een onbekende fout opgetreden");
        }
        console.error("Error fetching task:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [taskId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="text-muted-foreground mt-2 text-sm">Taak laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-muted-foreground hover:text-foreground mt-4 text-sm"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-semibold">Taak niet gevonden</p>
      </div>
    );
  }

  const handleGradeSubmit = async (
    inzendingId: string,
    score: number,
    feedback: string,
  ) => {
    try {
      await api.post(`/inzendingen/${inzendingId}/gradering`, {
        score,
        maxscore: task.weging,
        feedback,
      });
      toast.success("Beoordeling opgeslagen");

      // Refresh task data to show new grade
      const { data: taskData } = await api.get(`/taken/${taskId}`);
      setTask(taskData);
    } catch (error) {
      console.error("Error submitting grade:", error);
      toast.error(
        "Er is een fout opgetreden bij het opslaan van de beoordeling",
      );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() =>
            navigate(isDocent ? "/docent/klasbeheer" : "/student/dashboard")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug
        </Button>
      </div>

      <TaskHeader
        lecture={task.titel}
        klas={task.klasgroep.naam}
        type={task.type}
      />

      <TaskMetrics
        deadline={task.deadline}
        status={task.inzendingen.length > 0 ? "Ingeleverd" : "Open"}
        gottenPoints={task.inzendingen[0]?.gradering?.[0]?.score ?? 0}
        totalPoints={task.weging}
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

      {task.inzendingen.map((submission, index) => (
        <div key={submission._id} className="mb-8">
          {index > 0 && <Separator className="my-8" />}

          <div className="mb-4">
            <h3 className="text-xl font-semibold">
              Inzending van {submission.student?.naam}{" "}
              {submission.student?.achternaam}
            </h3>
          </div>

          <TaskSubmissionForm
            isSubmitted={true}
            initialSubmission={submission}
            submittedFiles={submission.bijlagen}
            isDocent={isDocent}
          />

          {isDocent && (
            <div className="mt-4">
              <h4 className="mb-2 text-lg font-semibold">Beoordeling</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Score (max {task.weging} punten)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={task.weging}
                    defaultValue={submission.gradering?.[0]?.score}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    onChange={(e) => {
                      const score = Math.min(
                        Math.max(0, parseInt(e.target.value)),
                        task.weging,
                      );
                      handleGradeSubmit(
                        submission._id,
                        score,
                        submission.gradering?.[0]?.feedback || "",
                      );
                    }}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Feedback
                  </label>
                  <textarea
                    defaultValue={submission.gradering?.[0]?.feedback}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    onChange={(e) => {
                      handleGradeSubmit(
                        submission._id,
                        submission.gradering?.[0]?.score || 0,
                        e.target.value,
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {!isDocent && submission.gradering?.[0]?.feedback && (
            <TaskFeedback feedback={submission.gradering[0].feedback} />
          )}
        </div>
      ))}
    </div>
  );
};
