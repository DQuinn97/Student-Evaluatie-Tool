import { Button } from "@/components/ui/button";
import { FileDown, Edit, Trash2 } from "lucide-react";
import { Entry, EntryCardProps } from "@/types";

export const EntryCard = ({
  entry,
  isDocent,
  onEdit,
  onDelete,
  onExport,
}: EntryCardProps) => {
  // Format the date for display
  const formattedDate = new Date(entry.datum).toLocaleDateString("nl-BE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-4 rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{formattedDate}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            title="Exporteer als PDF"
            onClick={() => onExport(entry)}
          >
            <FileDown className="size-4" />
          </Button>
          {!isDocent && (
            <>
              <Button
                variant="outline"
                size="icon"
                title="Bewerk"
                onClick={() => onEdit(entry._id)}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                title="Verwijder"
                onClick={() => onDelete(entry._id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </>
          )}
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
  );
};
