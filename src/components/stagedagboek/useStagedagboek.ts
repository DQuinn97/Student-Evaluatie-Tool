import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import api from "@/api";
import { Entry } from "./types";

export const useStagedagboek = (
  isDocent: boolean,
  klasId?: string,
  studentId?: string,
) => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [studentName, setStudentName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dagboekId, setDagboekId] = useState<string | null>(null);

  // Fetch the dagboek data
  useEffect(() => {
    const fetchDagboek = async () => {
      try {
        setIsLoading(true);

        if (isDocent && klasId && studentId) {
          // Docent view - get a specific student's dagboek
          const { data: student } = await api.get(`/profiel/${studentId}`);
          setStudentName(`${student.naam} ${student.achternaam || ""}`);

          const { data: dagboek } = await api.get(
            `/dagboek/${klasId}/${studentId}`,
          );
          if (dagboek) {
            setDagboekId(dagboek._id);
            setEntries(dagboek.stagedagen || []);
          }
        } else {
          // Student view - get the student's own dagboek
          const { data: classes } = await api.get("/klassen");
          if (!classes || classes.length === 0) {
            toast.error("Je bent nog niet toegevoegd aan een klas");
            navigate("/student/dashboard");
            return;
          }

          // Get or create dagboek
          let { data: dagboek } = await api.get(
            `/klassen/${classes[0]._id}/dagboek`,
          );

          if (!dagboek) {
            const response = await api.post(
              `/klassen/${classes[0]._id}/dagboek`,
            );
            dagboek = response.data;
          }

          setDagboekId(dagboek._id);
          setEntries(dagboek.stagedagen || []);
        }
      } catch (error) {
        console.error("Error fetching dagboek:", error);
        toast.error("Kon het stagedagboek niet laden");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDagboek();
  }, [klasId, studentId, isDocent, navigate]);

  // Handler for editing an entry
  const handleEdit = (id: string) => {
    if (isDocent) return; // Docents can't edit

    // Verify entry belongs to current dagboek
    if (!entries.some((entry) => entry._id === id)) {
      toast.error("Deze ingave bestaat niet of je hebt er geen toegang toe");
      return;
    }
    navigate(`/student/stagedagboek/ingave/${id}`);
  };

  // Handler for deleting an entry
  const handleDelete = async (id: string) => {
    if (isDocent) return; // Docents can't delete

    try {
      // Verify entry belongs to current dagboek
      if (!entries.some((entry) => entry._id === id)) {
        toast.error("Deze ingave bestaat niet of je hebt er geen toegang toe");
        return;
      }

      const response = await api.delete(`/dagboek/dag/${id}`);

      if (response.status === 204) {
        setEntries(entries.filter((entry) => entry._id !== id));
        toast.success("Entry verwijderd");
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return {
    entries,
    studentName,
    isLoading,
    dagboekId,
    handleEdit,
    handleDelete,
  };
};
