import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { EntryCardProps } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const EntryAccordion = ({
  entry,
  isDocent,
  onEdit,
  onDelete,
}: EntryCardProps) => {
  // Format the date for display
  const formattedDate = new Date(entry.datum).toLocaleDateString("nl-BE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Accordion type="single" collapsible className="w-full rounded-lg border">
      <AccordionItem value={entry._id} className="border-none">
        <div className="flex items-center justify-between px-4">
          <AccordionTrigger className="flex-1 py-4">
            <span className="font-medium">{formattedDate}</span>
          </AccordionTrigger>
          {!isDocent && (
            <div className="ml-4 flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                title="Bewerk"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(entry._id);
                }}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                title="Verwijder"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry._id);
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )}
        </div>
        <AccordionContent className="px-6 pb-4">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
