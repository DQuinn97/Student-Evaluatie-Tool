import { useState, useEffect } from "react";
import api from "@/api";
import { Class, Task, Student } from "@/types";
import { useDialog } from "@/contexts/DialogContext";
import { useNavigate } from "react-router";

export const useClassManagement = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      console.error("Error fetching classes:", error);
      setError("Er is een fout opgetreden bij het ophalen van de klassen");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/klassen/${selectedClass}/taken`);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Er is een fout opgetreden bij het ophalen van de taken");
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
      console.error("Error fetching students:", error);
      setError("Er is een fout opgetreden bij het ophalen van de studenten");
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
          console.error("Error creating class:", error);
          setError("Er is een fout opgetreden bij het aanmaken van de klas");
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
      const { data } = await api.post(`/taken/${taskId}/dupliceer`);
      setTasks([...tasks, data]);
    } catch (error) {
      console.error("Error duplicating task:", error);
      setError("Er is een fout opgetreden bij het dupliceren van de taak");
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
      console.error("Error deleting task:", error);
      setError("Er is een fout opgetreden bij het verwijderen van de taak");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedClass) return;
    openDialog({
      title: "Student Toevoegen",
      description: "Voer het ID van de student in",
      placeholder: "Student ID",
      confirmLabel: "Toevoegen",
      onConfirm: async (studentId) => {
        if (!studentId) return;
        try {
          setIsLoading(true);
          await api.post(`/klassen/${selectedClass}/studenten`, {
            studentId,
          });
          const { data } = await api.get(`/klassen/${selectedClass}`);
          // Filter docenten uit de lijst na toevoegen van een student
          const filteredStudents = (data.studenten || []).filter(
            (student: Student) => !student.isDocent,
          );
          setStudents(filteredStudents);
        } catch (error) {
          console.error("Error adding student:", error);
          setError(
            "Er is een fout opgetreden bij het toevoegen van de student",
          );
        } finally {
          setIsLoading(false);
        }
      },
    });
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
      console.error("Error deleting student:", error);
      setError("Er is een fout opgetreden bij het verwijderen van de student");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    classes,
    tasks,
    students,
    selectedClass,
    isLoading,
    error,
    setSelectedClass,
    handleCreateClass,
    handleCreateTask,
    handleDuplicateTask,
    handleDeleteTask,
    handleAddStudent,
    handleDeleteStudent,
  };
};
