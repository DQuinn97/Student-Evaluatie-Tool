import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../api";

interface TaskFormState {
  titel: string;
  beschrijving: string;
  deadline: string;
  weging: number;
  maxScore: number;
  type: string;
  vak: string;
  isGepubliceerd: boolean;
  bijlagen: string[];
}

interface UseTaskFormProps {
  klasId: string;
  initialTask?: {
    _id: string;
    titel: string;
    beschrijving: string;
    deadline: string;
    weging: number;
    maxScore: number;
    type: string;
    vak?: string;
    isGepubliceerd: boolean;
    bijlagen: string[];
  };
  onTaskCreated: (taskId: string) => void;
}

export const useTaskForm = ({
  klasId,
  initialTask,
  onTaskCreated,
}: UseTaskFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<
    Array<{ _id: string; naam: string }>
  >([]);
  const [files, setFiles] = useState<File[]>([]);
  const [taskData, setTaskData] = useState<TaskFormState>({
    titel: initialTask?.titel || "",
    beschrijving: initialTask?.beschrijving || "",
    deadline: initialTask?.deadline || "",
    weging: initialTask?.weging || 0,
    maxScore: initialTask?.maxScore || 100,
    type: initialTask?.type || "taak",
    vak: initialTask?.vak || "",
    isGepubliceerd: initialTask?.isGepubliceerd || false,
    bijlagen: initialTask?.bijlagen || [],
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data: klassData } = await api.get(`/klassen/${klasId}`);
        if (klassData.vakken && Array.isArray(klassData.vakken)) {
          setAvailableSubjects(klassData.vakken);
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        toast.error("Er is een fout opgetreden bij het ophalen van de vakken");
      }
    };

    fetchSubjects();
  }, [klasId]);

  const validateTaskData = () => {
    if (!taskData.titel || !taskData.beschrijving || !taskData.deadline) {
      toast.error("Vul alle verplichte velden in");
      return false;
    }

    let deadlineDate;
    try {
      deadlineDate = new Date(taskData.deadline);
      if (isNaN(deadlineDate.getTime())) {
        throw new Error("Invalid date");
      }

      const currentYear = new Date().getFullYear();
      if (
        deadlineDate.getFullYear() < currentYear ||
        deadlineDate.getFullYear() > currentYear + 10
      ) {
        toast.error(
          `De deadline moet tussen ${currentYear} en ${currentYear + 10} liggen`,
        );
        return false;
      }
    } catch (err) {
      toast.error("Ongeldige datumnotatie voor deadline");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (!validateTaskData()) {
        setSubmitting(false);
        return;
      }

      const deadlineDate = new Date(taskData.deadline);
      const formData = new FormData();
      formData.append("type", taskData.type);
      formData.append("titel", taskData.titel);
      formData.append("beschrijving", taskData.beschrijving);
      formData.append("deadline", deadlineDate.toISOString());

      const wegingValue = Math.min(
        Math.max(
          0,
          typeof taskData.weging === "string"
            ? parseFloat(taskData.weging as unknown as string)
            : taskData.weging,
        ),
        1,
      );
      formData.append("weging", wegingValue.toString());

      // Ensure maxScore is always a valid number (minimum 1)
      const maxScoreValue = Math.max(
        1,
        typeof taskData.maxScore === "string"
          ? parseInt(taskData.maxScore as unknown as string)
          : taskData.maxScore || 100,
      );
      formData.append("maxScore", maxScoreValue.toString());

      formData.append(
        "isGepubliceerd",
        taskData.isGepubliceerd ? "true" : "false",
      );

      if (taskData.vak) {
        formData.append("vak", taskData.vak);
      }

      files.forEach((file) => {
        formData.append("nieuweBijlagen", file);
      });

      if (initialTask?._id) {
        // Update existing task
        const { data: updatedTask } = await api.patch(
          `/taken/${initialTask._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        toast.success("Taak succesvol bijgewerkt");
        onTaskCreated(updatedTask._id);
      } else {
        // Create new task
        const { data: createdTask } = await api.post(
          `/klassen/${klasId}/taken`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        toast.success("Taak succesvol aangemaakt");
        onTaskCreated(createdTask._id);
      }
    } catch (error: any) {
      console.error("Error creating task:", error);
      if (error.response) {
        toast.error(
          `Error ${error.response.status}: ${error.response.data?.message || "Er is een fout opgetreden bij het aanmaken van de taak"}`,
        );
      } else if (error.request) {
        toast.error("Geen reactie ontvangen van de server");
      } else {
        toast.error("Er is een fout opgetreden bij het aanmaken van de taak");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const updateTaskData = (field: keyof TaskFormState, value: any) => {
    setTaskData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    taskData,
    updateTaskData,
    submitting,
    availableSubjects,
    files,
    setFiles,
    handleSubmit,
  };
};
