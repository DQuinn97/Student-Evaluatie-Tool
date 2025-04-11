import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { Loader2, Save, CalendarIcon } from "lucide-react";
import api from "../../api";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { nl } from "date-fns/locale";

interface CreateTaskFormProps {
  klasId: string;
  className?: string;
  onTaskCreated: (taskId: string) => void;
  initialTask?: {
    _id: string;
    titel: string;
    beschrijving: string;
    deadline: string;
    weging: number;
    type: string;
    vak?: string;
    isGepubliceerd: boolean;
    bijlagen: string[];
  };
}

export const CreateTaskForm = ({
  klasId,
  className,
  onTaskCreated,
  initialTask,
}: CreateTaskFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [availableSubjects, setAvailableSubjects] = useState<
    Array<{ _id: string; naam: string }>
  >([]);
  const [files, setFiles] = useState<File[]>([]);
  const [newTask, setNewTask] = useState({
    titel: initialTask?.titel || "",
    beschrijving: initialTask?.beschrijving || "",
    deadline: initialTask?.deadline || "",
    weging: initialTask?.weging || 1,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (!newTask.titel || !newTask.beschrijving || !newTask.deadline) {
        toast.error("Vul alle verplichte velden in");
        return;
      }

      let deadlineDate;
      try {
        deadlineDate = new Date(newTask.deadline);
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
          return;
        }
      } catch (err) {
        toast.error("Ongeldige datumnotatie voor deadline");
        return;
      }

      const formData = new FormData();
      formData.append("type", newTask.type);
      formData.append("titel", newTask.titel);
      formData.append("beschrijving", newTask.beschrijving);
      formData.append("deadline", deadlineDate.toISOString());

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
      formData.append(
        "isGepubliceerd",
        newTask.isGepubliceerd ? "true" : "false",
      );

      if (newTask.vak) {
        formData.append("vak", newTask.vak);
      }

      files.forEach((file) => {
        formData.append("nieuweBijlagen", file);
      });

      if (initialTask?._id) {
        // Update existing task
        const { data: updatedTask } = await api.put(
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

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="titel">Titel *</Label>
          <Input
            id="titel"
            placeholder="Voer een titel in"
            value={newTask.titel}
            onChange={(e) => setNewTask({ ...newTask, titel: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            value={newTask.type}
            onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
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
            step="0.1"
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
            onChange={(e) => setNewTask({ ...newTask, vak: e.target.value })}
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
  );
};
