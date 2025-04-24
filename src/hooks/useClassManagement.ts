import { useState, useEffect } from "react";
import api from "@/api";
import { Class, Task, Student } from "@/types";
import { useDialog } from "@/contexts/DialogContext";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export const useClassManagement = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openDialog } = useDialog();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTasks();
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/klassen");
      setClasses(data);
    } catch (error) {
      toast.error("Er is een fout opgetreden bij het ophalen van de klassen");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/klassen/${selectedClass}/taken`);
      setTasks(data);
    } catch (error) {
      toast.error("Er is een fout opgetreden bij het ophalen van de taken");
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await api.get(`/klassen/${selectedClass}`);
      // Filter docenten uit de studentenlijst
      const filteredStudents = (data.studenten || []).filter(
        (student: Student) => !student.isDocent,
      );
      setStudents(filteredStudents);
    } catch (error) {
      toast.error("Er is een fout opgetreden bij het ophalen van de studenten");
    }
  };

  const handleCreateClass = async () => {
    openDialog({
      title: "Nieuwe Klas",
      description: "Voer de naam van de nieuwe klas in",
      placeholder: "Klasnaam",
      confirmLabel: "Aanmaken",
      onConfirm: async (className) => {
        if (!className) return;
        try {
          setIsLoading(true);
          const { data } = await api.post("/klassen", { naam: className });
          setClasses([...classes, data]);
        } catch (error) {
          toast.error("Er is een fout opgetreden bij het aanmaken van de klas");
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleCreateTask = async () => {
    if (!selectedClass) return;

    // Navigate to docent/taken/:id with a special URL parameter to indicate new task creation
    navigate(`/docent/taken/new?klasId=${selectedClass}`);
  };

  const handleDuplicateTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      // Ensure we're sending data with the correct content type
      const { data } = await api.post(
        `/taken/${taskId}/dupliceer`,
        { klasgroepId: selectedClass },
        { headers: { "Content-Type": "application/json" } },
      );
      setTasks([...tasks, data]);
      toast.success("Taak succesvol gedupliceerd");
    } catch (error) {
      console.error("Error duplicating task:", error);
      toast.error("Er is een fout opgetreden bij het dupliceren van de taak");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsLoading(true);
      await api.delete(`/taken/${taskId}`);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      toast.error("Er is een fout opgetreden bij het verwijderen van de taak");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (studentIds: string[]) => {
    if (!selectedClass || studentIds.length === 0) return;

    try {
      setIsLoading(true);

      // Add students one by one
      const promises = studentIds.map((studentId) =>
        api.post(`/klassen/${selectedClass}/studenten`, { studentId }),
      );

      await Promise.all(promises);

      // Refresh the student list
      const { data } = await api.get(`/klassen/${selectedClass}`);
      // Filter docenten uit de lijst na toevoegen van studenten
      const filteredStudents = (data.studenten || []).filter(
        (student: Student) => !student.isDocent,
      );
      setStudents(filteredStudents);

      toast.success(
        `${studentIds.length} student${studentIds.length > 1 ? "en" : ""} succesvol toegevoegd`,
      );
    } catch (error) {
      toast.error(
        "Er is een fout opgetreden bij het toevoegen van de studenten",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!selectedClass) return;
    try {
      setIsLoading(true);
      await api.patch(`/klassen/${selectedClass}/studenten`, {
        studentId,
      });
      setStudents(students.filter((student) => student._id !== studentId));
    } catch (error) {
      toast.error(
        "Er is een fout opgetreden bij het verwijderen van de student",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = (taskId: string, updatedFields: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task._id === taskId ? { ...task, ...updatedFields } : task,
      ),
    );
  };

  return {
    classes,
    tasks,
    students,
    selectedClass,
    isLoading,
    setSelectedClass,
    handleCreateClass,
    handleCreateTask,
    handleDuplicateTask,
    handleDeleteTask,
    handleAddStudent,
    handleDeleteStudent,
    handleUpdateTask,
  };
};
