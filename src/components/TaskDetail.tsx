import { useEffect, useState } from "react";
import { useParams, useSearchParams, useLocation } from "react-router";
import { toast } from "sonner";
import { TaskDetail as ITaskDetail } from "../types";
import api from "../api";
import { Loader2 } from "lucide-react";
import { StudentTaskDetail } from "./task-detail/StudentTaskDetail";
import { DocentTaskDetail } from "./task-detail/DocentTaskDetail";

export const TaskDetail = () => {
  const { id, taakId } = useParams<{ id?: string; taakId?: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const taskId = id || taakId;
  const isDocent = Boolean(id);
  const isNewTask = taskId === "new";
  const isEditMode = location.pathname.includes("/edit");
  const klasId = searchParams.get("klasId");
  const [task, setTask] = useState<ITaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!taskId) {
          throw new Error("Geen taak ID gevonden");
        }

        if (isNewTask) {
          if (!klasId) {
            throw new Error("Geen klasgroep ID gevonden");
          }
          // For new tasks, create a placeholder task with all required properties
          setTask({
            _id: "",
            titel: "",
            git: "",
            url: "",
            beschrijving: "",
            deadline: "",
            weging: 0,
            maxScore: 100,
            type: "taak",
            isGepubliceerd: false,
            inzendingen: [],
            bijlagen: [],
            klasgroep: {
              _id: klasId,
              naam: "Wordt geladen...",
              studenten: [], // Add the required studenten array
            },
          } as unknown as ITaskDetail); // Use unknown first to bypass strict type checking

          // Fetch class name for the placeholder
          try {
            const { data: klassData } = await api.get(`/klassen/${klasId}`);
            setTask((prev) =>
              prev
                ? {
                    ...prev,
                    klasgroep: {
                      ...prev.klasgroep, // Keep existing klasgroep properties including studenten
                      _id: klasId,
                      naam: klassData.naam,
                    },
                  }
                : null,
            );
          } catch (err) {
            console.error("Error fetching class data:", err);
          }

          setIsLoading(false);
          return;
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
  }, [taskId, isNewTask, klasId]);

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

  // Route to the appropriate component based on user role
  if (isDocent) {
    return (
      <DocentTaskDetail
        task={task}
        klasId={klasId || task?.klasgroep?._id}
        isNewTask={isNewTask}
        isEditMode={isEditMode}
        onTaskCreated={(taskId) => {
          window.location.href = `/docent/taken/${taskId}`;
        }}
      />
    );
  }

  return <StudentTaskDetail task={task} />;
};
