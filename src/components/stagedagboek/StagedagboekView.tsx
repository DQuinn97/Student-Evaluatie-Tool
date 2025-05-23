import { useNavigate } from "react-router";
import { StagedagboekViewProps } from "@/types";
import { useStagedagboek } from "./useStagedagboek";
import { exportToPdf } from "./export-utils";
import { EntryAccordion } from "./EntryAccordion";
import { StagedagboekHeader } from "./StagedagboekHeader";

export const StagedagboekView = ({
  klasId,
  studentId,
  isDocent,
  title,
}: StagedagboekViewProps) => {
  const navigate = useNavigate();
  const { entries, studentName, isLoading, handleEdit, handleDelete } =
    useStagedagboek(isDocent, klasId, studentId);

  // Generate a display title
  const displayTitle =
    title || (studentName ? `Stagedagboek van ${studentName}` : "Stagedagboek");

  // Handler for exporting all entries to PDF
  const handleExportAll = () => {
    exportToPdf(entries, studentName);
  };

  // Handler for navigating back
  const handleBack = () => {
    navigate(-1);
  };

  // Handler for creating a new entry
  const handleNewEntry = () => {
    navigate("/student/stagedagboek/ingave");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <StagedagboekHeader
        title={displayTitle}
        isDocent={isDocent}
        onExportAll={handleExportAll}
        onBack={handleBack}
        onNewEntry={handleNewEntry}
      />

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground">Laden...</p>
        ) : entries.length === 0 ? (
          <p className="text-muted-foreground">
            Geen stagedagboek entries gevonden.
          </p>
        ) : (
          entries.map((entry) => (
            <EntryAccordion
              key={entry._id}
              entry={entry}
              isDocent={isDocent}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
