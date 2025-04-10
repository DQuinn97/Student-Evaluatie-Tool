import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Trash, Eye } from "lucide-react";
import { DataTable } from "../shared/DataTable";
import { useTableConfig } from "@/hooks/useTableConfig";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { useNavigate } from "react-router";
import api from "@/api";
import { Row } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Task = {
  _id: string;
  titel: string;
  type: string;
  deadline: string;
  weging: number;
  inzendingen: Array<{
    _id: string;
    gradering: Array<{
      score: number;
      maxscore: number;
    }>;
  }>;
  klasgroep: {
    _id: string;
    naam: string;
  };
};

type Student = {
  _id: string;
  naam: string;
  achternaam: string;
  email: string;
  foto?: string;
};

type Class = {
  _id: string;
  naam: string;
  studenten?: Student[];
};

export const ClassManagement = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    type: "task" | "student";
    id: string;
  } | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await api.get("/klassen");
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setError("Er is een fout opgetreden bij het ophalen van de klassen");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedClass) {
        setTasks([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const { data } = await api.get(`/klassen/${selectedClass}/taken`);
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Er is een fout opgetreden bij het ophalen van de taken");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [selectedClass]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const { data } = await api.get(`/klassen/${selectedClass}`);
        setStudents(data.studenten || []);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Er is een fout opgetreden bij het ophalen van de studenten");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === "task") {
        await api.delete(`/taken/${itemToDelete.id}`);
        setTasks(tasks.filter((task) => task._id !== itemToDelete.id));
      } else {
        if (!selectedClass) return;
        await api.patch(`/klassen/${selectedClass}/studenten`, {
          studentId: itemToDelete.id,
        });
        setStudents(
          students.filter((student) => student._id !== itemToDelete.id),
        );
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error);
      alert(
        `Er is een fout opgetreden bij het verwijderen van de ${itemToDelete.type === "task" ? "taak" : "student"}`,
      );
    } finally {
      setItemToDelete(null);
    }
  };

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
        const task = row.original;
        const average = calculateAverageScore(task);
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
              onClick={() => handleDuplicateTask(task._id)}
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
                  <AlertDialogAction onClick={() => handleDeleteConfirmed()}>
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

  const studentColumns = [
    {
      accessorKey: "naam",
      header: "Naam",
      cell: ({ row }: { row: Row<Student> }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={student.foto} />
              <AvatarFallback>
                {student.naam?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {student.naam} {student.achternaam}
              </div>
              <div className="text-muted-foreground text-sm">
                {student.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row<Student> }) => {
        const student = row.original;
        return (
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setItemToDelete({ type: "student", id: student._id })
                  }
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bevestig Verwijderen</AlertDialogTitle>
                  <AlertDialogDescription>
                    Weet je zeker dat je deze student wilt verwijderen uit de
                    klas?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteConfirmed()}>
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

  const studentTable = useTableConfig({
    data: students,
    columns: studentColumns,
    pageSize: 10,
  });

  const handleCreateClass = async () => {
    const className = prompt("Voer de naam van de nieuwe klas in:");
    if (className) {
      try {
        const { data } = await api.post("/klassen", { naam: className });
        setClasses([...classes, data]);
      } catch (error) {
        console.error("Error creating class:", error);
      }
    }
  };

  const handleCreateTask = async () => {
    if (!selectedClass) {
      alert("Selecteer eerst een klas");
      return;
    }
    const taskName = prompt("Voer de naam van de nieuwe taak in:");
    if (taskName) {
      try {
        const { data } = await api.post(`/klassen/${selectedClass}/taken`, {
          titel: taskName,
          type: "opdracht",
          deadline: new Date().toISOString(),
          weging: 1,
        });
        setTasks([...tasks, data]);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }
  };

  const handleDuplicateTask = async (taskId: string) => {
    try {
      const { data } = await api.post(`/taken/${taskId}/dupliceer`);
      setTasks([...tasks, data]);
    } catch (error) {
      console.error("Error duplicating task:", error);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedClass) {
      alert("Selecteer eerst een klas");
      return;
    }
    const studentEmail = prompt("Voer het e-mailadres van de student in:");
    if (studentEmail) {
      try {
        await api.post(`/klassen/${selectedClass}/studenten`, {
          studentId: studentEmail,
        });
        // Refresh students list
        const { data: updatedClass } = await api.get(
          `/klassen/${selectedClass}`,
        );
        setStudents(updatedClass.studenten || []);
      } catch (error) {
        console.error("Error adding student:", error);
        alert("Er is een fout opgetreden bij het toevoegen van de student");
      }
    }
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Klasbeheer</h2>
        <Button onClick={handleCreateClass} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe Klas
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(auto,300px)_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Klassen</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-muted-foreground">Laden...</div>
            ) : (
              <div className="space-y-2">
                {classes.map((klas) => (
                  <Button
                    key={klas._id}
                    variant="ghost"
                    className={`w-full justify-start ${
                      selectedClass === klas._id
                        ? "bg-secondary"
                        : "font-normal"
                    }`}
                    onClick={() => setSelectedClass(klas._id)}
                  >
                    {klas.naam}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tasks">
              <div className="flex items-center justify-between border-b">
                <AccordionTrigger className="flex-1 hover:no-underline">
                  <h3 className="text-xl font-semibold">Taken & Toetsen</h3>
                </AccordionTrigger>
                <Button
                  onClick={handleCreateTask}
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

            <AccordionItem value="students">
              <div className="flex items-center justify-between border-b">
                <AccordionTrigger className="flex-1 hover:no-underline">
                  <h3 className="text-xl font-semibold">Studenten</h3>
                </AccordionTrigger>
                <Button
                  onClick={handleAddStudent}
                  disabled={!selectedClass || isLoading}
                  className="m-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Student Toevoegen
                </Button>
              </div>
              <AccordionContent>
                {isLoading ? (
                  <div className="text-muted-foreground">Laden...</div>
                ) : (
                  <DataTable
                    table={studentTable}
                    filterColumn="naam"
                    filterPlaceholder="Zoek studenten..."
                    showRowSelection={false}
                    emptyMessage="Geen studenten gevonden."
                  />
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
