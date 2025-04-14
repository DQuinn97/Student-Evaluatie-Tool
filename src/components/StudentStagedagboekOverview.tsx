import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Edit, Plus, Trash2, FileDown } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Entry } from "../types";
import api from "../api";

const StudentStagedagboekOverview = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchDagboek = async () => {
      try {
        // First get the user's class
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
          const response = await api.post(`/klassen/${classes[0]._id}/dagboek`);
          dagboek = response.data;
        }

        setEntries(dagboek.stagedagen || []);
      } catch (error) {
        toast.error("Failed to load entries");
        console.error(error);
      }
    };

    fetchDagboek();
  }, [navigate]);

  const handleEdit = (id: string) => {
    // Verify entry belongs to current dagboek
    if (!entries.some((entry) => entry._id === id)) {
      toast.error("Deze ingave bestaat niet of je hebt er geen toegang toe");
      return;
    }
    navigate(`/student/stagedagboek/ingave/${id}`);
  };

  const handleDelete = async (id: string) => {
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

  const handleExport = async (entries: Entry[] | Entry) => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      const entriesArray = Array.isArray(entries) ? entries : [entries];
      const startY = 40;
      const lineHeight = 10;

      entriesArray.forEach((entry, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // Format date properly
        const entryDate = new Date(entry.datum);
        const formattedDate = entryDate.toLocaleDateString("nl-BE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Set font and size for title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(`Stagedagboek Entry ${index + 1}`, 20, 20);

        // Reset font for content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        doc.text(`Datum: ${formattedDate}`, 20, startY);

        // Handle long text with word wrap
        const splitVoormiddag = doc.splitTextToSize(
          `Uitgevoerde werkzaamheden voormiddag: ${entry.voormiddag}`,
          170,
        );
        doc.text(splitVoormiddag, 20, startY + lineHeight);

        const splitNamiddag = doc.splitTextToSize(
          `Uitgevoerde werkzaamheden namiddag: ${entry.namiddag}`,
          170,
        );
        doc.text(
          splitNamiddag,
          20,
          startY + lineHeight * (2 + splitVoormiddag.length),
        );

        doc.text(
          `Gebruikte software/tools: ${entry.tools}`,
          20,
          startY +
            lineHeight * (3 + splitVoormiddag.length + splitNamiddag.length),
        );

        const splitResult = doc.splitTextToSize(
          `Resultaat: ${entry.resultaat}`,
          170,
        );
        doc.text(
          splitResult,
          20,
          startY +
            lineHeight * (4 + splitVoormiddag.length + splitNamiddag.length),
        );
      });

      // Save and download the PDF with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const fileName = Array.isArray(entries)
        ? `stagedagboek_export_${currentDate}.pdf`
        : `stagedagboek_${new Date(entries.datum).toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  const handleExportSingle = (entry: Entry) => {
    handleExport(entry);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Stagedagboek</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex gap-2"
            onClick={() => handleExport(entries)}
          >
            <FileDown className="size-4" />
            Exporteer Alle
          </Button>
          <Button
            className="flex gap-2"
            onClick={() => navigate("/student/stagedagboek/ingave")}
          >
            <Plus className="size-4" />
            Nieuwe ingave
          </Button>
        </div>
      </div>
      <div className="mt-8 space-y-4">
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="flex flex-col gap-4 rounded-lg border p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {new Date(entry.datum).toLocaleDateString("nl-BE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  title="Exporteer"
                  onClick={() => handleExportSingle(entry)}
                >
                  <FileDown className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  title="Bewerk"
                  onClick={() => handleEdit(entry._id)}
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  title="Verwijder"
                  onClick={() => handleDelete(entry._id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Voormiddag</h3>
                <p className="text-muted-foreground mt-1">{entry.voormiddag}</p>
              </div>
              <div>
                <h3 className="font-medium">Namiddag</h3>
                <p className="text-muted-foreground mt-1">{entry.namiddag}</p>
              </div>
              <div>
                <h3 className="font-medium">Gebruikte tools</h3>
                <p className="text-muted-foreground mt-1">{entry.tools}</p>
              </div>
              <div>
                <h3 className="font-medium">Resultaat</h3>
                <p className="text-muted-foreground mt-1">{entry.resultaat}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentStagedagboekOverview;
