import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Edit, Plus, Trash2, FileDown } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface Entry {
  _id: string;
  datum: string;
  voormiddag: string;
  namiddag: string;
  tools: string;
  resultaat: string;
}

const StudentStagedagboekOverview = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchDagboek = async () => {
      try {
        // First get the user's dagboek
        const response = await fetch("/api/profiel", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const user = await response.json();

        // Then get the dagboek details
        const dagboekResponse = await fetch(`/api/dagboek/${user.dagboek}`, {
          credentials: "include",
        });
        if (!dagboekResponse.ok) throw new Error("Failed to fetch dagboek");
        const dagboek = await dagboekResponse.json();

        setEntries(dagboek.stagedagen || []);
      } catch (error) {
        toast.error("Failed to load entries");
        console.error(error);
      }
    };

    fetchDagboek();
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/student/stagedagboek/ingave/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/dagboek/dag/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete entry");
      }

      setEntries(entries.filter((entry) => entry._id !== id));
      toast.success("Entry deleted successfully");
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

        // Set font and size for title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(`Stagedagboek Entry ${index + 1}`, 20, 20);

        // Reset font for content
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        doc.text(`Datum: ${entry.datum}`, 20, startY);

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
      const fileName = Array.isArray(entries)
        ? `stagedagboek_export_${new Date().toISOString().split("T")[0]}.pdf`
        : `stagedagboek_${entries.datum}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
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
            Exporteer PDF
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
                  onClick={() => handleEdit(entry._id)}
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
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
