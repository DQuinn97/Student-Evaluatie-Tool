import { Separator } from "./ui/separator";
import { TaskHeader } from "./task-detail/TaskHeader";
import { TaskMetrics } from "./task-detail/TaskMetrics";
import { TaskDescription } from "./task-detail/TaskDescription";
import { TaskSubmissionForm } from "./task-detail/TaskSubmissionForm";
import { TaskFeedback } from "./task-detail/TaskFeedback";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { TaskSubmission, TaskDetail as ITaskDetail } from "../types";
import api from "../api";

export const TaskDetail = () => {
  const { taakId } = useParams<{ taakId: string }>();
  const [task, setTask] = useState<ITaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!taakId) {
          throw new Error("Geen taak ID gevonden");
        }

        setIsLoading(true);
        setError(null);

        const { data: taskData } = await api.get(`/taken/${taakId}`);
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
  }, [taakId]);

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

  const studentInzending = task.inzendingen[0];
  const isSubmitted = Boolean(studentInzending);
  const submission: TaskSubmission | undefined = studentInzending && {
    _id: studentInzending._id,
    liveUrl: studentInzending.liveUrl,
    gitUrl: studentInzending.gitUrl,
    beschrijving: studentInzending.beschrijving,
    bijlagen: studentInzending.bijlagen,
  };

  const feedback = studentInzending?.gradering?.[0]?.feedback;
  const gottenPoints = studentInzending?.gradering?.[0]?.score ?? 0;

  return (
    <div className="container mx-auto p-6">
      <TaskHeader
        lecture={task.titel}
        klas={task.klasgroep.naam}
        type={task.type}
      />

      <TaskMetrics
        deadline={task.deadline}
        status={isSubmitted ? "Ingeleverd" : "Open"}
        gottenPoints={gottenPoints}
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

      <TaskSubmissionForm
        isSubmitted={isSubmitted}
        initialSubmission={submission}
        submittedFiles={submission?.bijlagen}
      />

      {feedback && <TaskFeedback feedback={feedback} />}
    </div>
  );
};
