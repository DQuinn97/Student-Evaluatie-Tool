import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  isDocent: boolean;
  onExportAll: () => void;
  onBack: () => void;
  onNewEntry?: () => void;
}

export const StagedagboekHeader = ({
  title,
  isDocent,
  onExportAll,
  onBack,
  onNewEntry,
}: HeaderProps) => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug
        </Button>
        <div className="flex space-x-2">
          {!isDocent && onNewEntry && (
            <Button variant="default" onClick={onNewEntry}>
              <Plus className="mr-2 h-4 w-4" />
              Nieuwe Ingave
            </Button>
          )}
          <Button variant="outline" onClick={onExportAll}>
            <FileDown className="mr-2 h-4 w-4" />
            Exporteer PDF
          </Button>
        </div>
      </div>

      <h1 className="mb-6 text-3xl font-bold">{title}</h1>
    </>
  );
};
