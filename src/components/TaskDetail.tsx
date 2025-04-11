import { Separator } from "./ui/separator";
import { TaskHeader } from "./task-detail/TaskHeader";
import { TaskMetrics } from "./task-detail/TaskMetrics";
import { TaskDescription } from "./task-detail/TaskDescription";
import { TaskSubmissionForm } from "./task-detail/TaskSubmissionForm";
import { TaskFeedback } from "./task-detail/TaskFeedback";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, CalendarIcon } from "lucide-react";
import { TaskDetail as ITaskDetail } from "../types";
import api from "../api";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { nl } from "date-fns/locale";

export const TaskDetail = () => {
  const { id, taakId } = useParams<{ id?: string; taakId?: string }>();
  const [searchParams] = useSearchParams();
  const taskId = id || taakId;
  const isDocent = Boolean(id);
  const isNewTask = taskId === "new";
  const klasId = searchParams.get("klasId");
  const navigate = useNavigate();
  const [task, setTask] = useState<ITaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For new task creation
  const [newTask, setNewTask] = useState({
    titel: "",
    beschrijving: "",
    deadline: "",
    weging: 1, // Changed from 10 to 1 (max value allowed)
    type: "taak",
    vak: "",
    isGepubliceerd: false,
    bijlagen: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<
    Array<{ _id: string; naam: string }>
  >([]);
  const [files, setFiles] = useState<File[]>([]);

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
          // For new tasks, create a placeholder task to show the form
          setTask({
            _id: "",
            titel: "",
            beschrijving: "",
            deadline: "",
            weging: 10,
            type: "taak",
            isGepubliceerd: false,
            inzendingen: [],
            klasgroep: {
              _id: klasId,
              naam: "Wordt geladen...",
            },
          } as ITaskDetail);

          // Fetch class name and subjects for the placeholder
          try {
            const { data: klassData } = await api.get(`/klassen/${klasId}`);
            if (klassData.vakken && Array.isArray(klassData.vakken)) {
              setAvailableSubjects(klassData.vakken);
            }
            setTask((prev) =>
              prev
                ? {
                    ...prev,
                    klasgroep: {
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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!klasId) return;

    try {
      setSubmitting(true);

      // Validate required fields
      if (!newTask.titel || !newTask.beschrijving || !newTask.deadline) {
        toast.error("Vul alle verplichte velden in");
        return;
      }

      // Validate deadline format
      let deadlineDate;
      try {
        // Convert to ISO format and ensure it's a valid date
        deadlineDate = new Date(newTask.deadline);
        if (isNaN(deadlineDate.getTime())) {
          throw new Error("Invalid date");
        }

        // Ensure the year is reasonable (between current year and current year + 10)
        const currentYear = new Date().getFullYear();
        if (
          deadlineDate.getFullYear() < currentYear ||
          deadlineDate.getFullYear() > currentYear + 10
        ) {
          toast.error(
            `De deadline moet tussen ${currentYear} en ${currentYear + 10} liggen`,
          );
          return;
        }
      } catch (err) {
        toast.error("Ongeldige datumnotatie voor deadline");
        return;
      }

      // Log the task data that will be sent
      console.log("Task data to be sent:", {
        ...newTask,
        deadline: deadlineDate.toISOString(),
        weging:
          typeof newTask.weging === "string"
            ? parseFloat(newTask.weging)
            : newTask.weging,
      });

      // If there are files to upload, use FormData
      if (files.length > 0) {
        const formData = new FormData();
        formData.append("type", newTask.type);
        formData.append("titel", newTask.titel);
        formData.append("beschrijving", newTask.beschrijving);
        formData.append("deadline", deadlineDate.toISOString());

        // Make sure weging is between 0 and 1
        const wegingValue = Math.min(
          Math.max(
            0,
            typeof newTask.weging === "string"
              ? parseFloat(newTask.weging)
              : newTask.weging,
          ),
          1,
        );
        formData.append("weging", wegingValue.toString());

        // Convert boolean to string "true" or "false"
        formData.append(
          "isGepubliceerd",
          newTask.isGepubliceerd ? "true" : "false",
        );

        if (newTask.vak) {
          formData.append("vak", newTask.vak);
        }

        // Add all files
        files.forEach((file) => {
          formData.append("nieuweBijlagen", file);
        });

        // Log the FormData entries for debugging
        console.log("FormData entries:");
        for (const pair of formData.entries()) {
          if (pair[0] !== "nieuweBijlagen") {
            console.log(pair[0] + ": " + pair[1]);
          } else {
            console.log(pair[0] + ": " + "[File]");
          }
        }

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
        navigate(`/docent/taken/${createdTask._id}`);
      } else {
        // No files, just send JSON data
        // Make sure weging is between 0 and 1
        const taskData = {
          ...newTask,
          deadline: deadlineDate.toISOString(), // Use ISO format for date
          weging: Math.min(
            Math.max(
              0,
              typeof newTask.weging === "string"
                ? parseFloat(newTask.weging)
                : newTask.weging,
            ),
            1,
          ),
        };

        // Log what's being sent
        console.log("JSON data being sent:", taskData);

        const { data: createdTask } = await api.post(
          `/klassen/${klasId}/taken`,
          taskData,
        );
        toast.success("Taak succesvol aangemaakt");
        navigate(`/docent/taken/${createdTask._id}`);
      }
    } catch (error: any) {
      console.error("Error creating task:", error);
      // Log more detailed error information
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        toast.error(
          `Error ${error.response.status}: ${error.response.data?.message || "Er is een fout opgetreden bij het aanmaken van de taak"}`,
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Geen reactie ontvangen van de server");
      } else {
        toast.error("Er is een fout opgetreden bij het aanmaken van de taak");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGradeSubmit = async (
    inzendingId: string,
    score: number,
    feedback: string,
  ) => {
    try {
      await api.post(`/inzendingen/${inzendingId}/gradering`, {
        score,
        maxscore: task?.weging,
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

  // Render create form for new task
  if (isNewTask) {
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
            <p className="text-muted-foreground">Klas: {task.klasgroep.naam}</p>
          </div>
        </div>

        <form onSubmit={handleCreateTask}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="titel">Titel *</Label>
              <Input
                id="titel"
                placeholder="Voer een titel in"
                value={newTask.titel}
                onChange={(e) =>
                  setNewTask({ ...newTask, titel: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                value={newTask.type}
                onChange={(e) =>
                  setNewTask({ ...newTask, type: e.target.value })
                }
              >
                <option value="taak">Taak</option>
                <option value="test">Test</option>
              </select>
            </div>

            <div>
              <Label htmlFor="beschrijving">Beschrijving *</Label>
              <Textarea
                id="beschrijving"
                placeholder="Beschrijf de taak"
                value={newTask.beschrijving}
                onChange={(e) =>
                  setNewTask({ ...newTask, beschrijving: e.target.value })
                }
                className="min-h-32"
                required
              />
            </div>

            <div>
              <Label htmlFor="deadline">Deadline *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newTask.deadline && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTask.deadline ? (
                      format(new Date(newTask.deadline), "PPP HH:mm", {
                        locale: nl,
                      })
                    ) : (
                      <span>Selecteer een datum en tijd</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      newTask.deadline ? new Date(newTask.deadline) : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        const now = new Date();
                        date.setHours(now.getHours(), now.getMinutes());
                        setNewTask({
                          ...newTask,
                          deadline: date.toISOString(),
                        });
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    initialFocus
                  />
                  <div className="border-border border-t p-3">
                    <Label htmlFor="deadline-time">Tijd</Label>
                    <Input
                      id="deadline-time"
                      type="time"
                      value={
                        newTask.deadline
                          ? format(new Date(newTask.deadline), "HH:mm")
                          : ""
                      }
                      onChange={(e) => {
                        if (newTask.deadline) {
                          const date = new Date(newTask.deadline);
                          const [hours, minutes] = e.target.value.split(":");
                          date.setHours(
                            parseInt(hours || "0"),
                            parseInt(minutes || "0"),
                          );
                          setNewTask({
                            ...newTask,
                            deadline: date.toISOString(),
                          });
                        }
                      }}
                      className="mt-1"
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="weging">Maximale score</Label>
              <Input
                id="weging"
                type="number"
                min="0"
                max="1"
                value={newTask.weging}
                onChange={(e) =>
                  setNewTask({ ...newTask, weging: parseFloat(e.target.value) })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="vak">Vak</Label>
              <select
                id="vak"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                value={newTask.vak}
                onChange={(e) =>
                  setNewTask({ ...newTask, vak: e.target.value })
                }
              >
                <option value="">Selecteer een vak</option>
                {availableSubjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.naam}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="bijlagen">Bijlagen</Label>
              <input
                id="bijlagen"
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isGepubliceerd"
                type="checkbox"
                checked={newTask.isGepubliceerd}
                onChange={(e) =>
                  setNewTask({ ...newTask, isGepubliceerd: e.target.checked })
                }
                className="h-4 w-4"
              />
              <Label htmlFor="isGepubliceerd">Direct publiceren</Label>
            </div>

            <Button type="submit" disabled={submitting} className="mt-4">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aanmaken...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Taak aanmaken
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Render existing task
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
                        Math.max(0, parseFloat(e.target.value)),
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
