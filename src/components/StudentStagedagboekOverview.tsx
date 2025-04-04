import { useState } from "react";
import { Button } from "./ui/button";
import { Download, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useTableConfig } from "@/hooks/useTableConfig";
import { DataTable } from "./shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import jsPDF from "jspdf";

interface StagedagboekEntry {
  id: string;
  date: string;
  voormiddag: string;
  namiddag: string;
  tools: string;
  result: string;
}

const StudentStagedagboekOverview = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<StagedagboekEntry[]>([
    {
      id: "1",
      date: "2024-01-20",
      voormiddag: "random",
      namiddag: "random2",
      tools: "random",
      result: "random",
    },
    {
      id: "2",
      date: "2024-01-21",
      voormiddag: "dssqdfghjklhgfdsqdfghjkljhgfdsfghjkldsfghjkllgfds  fgh",
      namiddag:
        "randlkqsjdhfglsmqjfhglmqsdjghlfdsjghdlsljglkdfjglsdjfglsdjfdsfggom2",
      tools: "random",
      result: "random",
    },
    {
      id: "3",
      date: "2024-01-22",
      voormiddag: "randqdsffom",
      namiddag: "qdssdfg",
      tools: "random",
      result: "random",
    },
  ]);

  const handleEdit = (id: string) => {
    navigate(`/student/stagedagboek/ingave/${id}`);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const columns: ColumnDef<StagedagboekEntry>[] = [
    {
      accessorKey: "id",
      header: "ID",
      enableSorting: true,
    },
    {
      accessorKey: "date",
      header: "Datum",
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const entry = row.original;
        return (
          <div className="space-x-2 text-right">
            <Button variant="outline" onClick={() => handleEdit(entry.id)}>
              Bewerken
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => handleExport(entry)}>
              <Download />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleDelete(entry.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleExport = async (
    entries: StagedagboekEntry[] | StagedagboekEntry,
  ) => {
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

        doc.text(`Datum: ${entry.date}`, 20, startY);

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
          `Resultaat: ${entry.result}`,
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
        : `stagedagboek_${entries.date}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error exporting to PDF:", error);
    }
  };

  const table = useTableConfig({
    data: entries,
    columns,
    pageSize: 5,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Stagedagboek</h1>
        <div className="space-x-2">
          <Button onClick={() => handleExport(entries)}>Exporteer</Button>
          <Button
            variant="default"
            onClick={() => navigate("/student/stagedagboek/ingave")}
          >
            Nieuwe ingave
          </Button>
        </div>
      </div>

      <DataTable
        table={table}
        filterColumn="date"
        filterPlaceholder="Filter op datum..."
        showRowSelection={false}
        emptyMessage="Geen ingaves gevonden."
      />
    </div>
  );
};

export default StudentStagedagboekOverview;
