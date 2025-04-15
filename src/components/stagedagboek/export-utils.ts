import { toast } from "sonner";
import jsPDF from "jspdf";
import { Entry } from "./types";

export const exportToPdf = async (
  entries: Entry[] | Entry,
  studentName: string = "",
) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    const entriesArray = Array.isArray(entries) ? entries : [entries];
    const startY = 40;
    const lineHeight = 10;
    const isSingleEntry = !Array.isArray(entries) || entries.length === 1;

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Stagedagboek${studentName ? ` van ${studentName}` : ""}`, 20, 20);

    // Reset font for content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

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

      const splitTools = doc.splitTextToSize(
        `Gebruikte tools: ${entry.tools}`,
        170,
      );
      doc.text(
        splitTools,
        20,
        startY +
          lineHeight * (3 + splitVoormiddag.length + splitNamiddag.length),
      );

      const splitResultaat = doc.splitTextToSize(
        `Resultaat: ${entry.resultaat}`,
        170,
      );
      doc.text(
        splitResultaat,
        20,
        startY +
          lineHeight *
            (4 +
              splitVoormiddag.length +
              splitNamiddag.length +
              splitTools.length),
      );
    });

    // Generate filename based on whether it's a single entry or multiple entries
    let filename = "";
    if (isSingleEntry) {
      // Single entry - use first name with date
      const firstName = studentName.split(" ")[0] || "student";
      const entryDate = new Date(entriesArray[0].datum);
      const dateStr = entryDate
        .toLocaleDateString("nl-BE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-");

      filename = `Stage_${firstName}_${dateStr}.pdf`;
    } else {
      // Multiple entries - use full student name
      filename = `stagedagboek${studentName ? `_${studentName.replace(/\s+/g, "_")}` : ""}.pdf`;
    }

    // Save the PDF
    doc.save(filename);
    toast.success("PDF succesvol geëxporteerd");

    return true;
  } catch (error) {
    console.error("Error exporting PDF:", error);
    toast.error("Kon de PDF niet exporteren");
    return false;
  }
};
