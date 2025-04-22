import { DataTableProps } from "@/types";
import { Card, CardContent } from "../../ui/card";
import { flexRender } from "@tanstack/react-table";

interface MobileCardViewProps {
  table: DataTableProps["table"];
  emptyMessage: string;
}

/**
 * Card-based view for data tables on mobile devices
 */
export const MobileCardView = ({
  table,
  emptyMessage,
}: MobileCardViewProps) => (
  <div className="space-y-3">
    {table.getRowModel().rows.length === 0 ? (
      <div className="text-muted-foreground rounded-md border p-4 text-center">
        {emptyMessage}
      </div>
    ) : (
      table.getRowModel().rows.map((row) => (
        <Card
          key={row.id}
          className="overflow-hidden transition-shadow duration-200 hover:shadow-sm"
        >
          <CardContent>
            {row.getVisibleCells().map((cell) => {
              // Get the column header to use as a label
              const headerGroup = table.getHeaderGroups()[0];
              const header = headerGroup.headers.find(
                (h) => h.id === cell.column.id,
              );

              if (!header) return null;

              // Skip empty cells or cells with no content
              const content = flexRender(
                cell.column.columnDef.cell,
                cell.getContext(),
              );

              // Some cells might contain buttons or icons only - check if they're action cells
              const isActionCell =
                cell.column.id === "actions" ||
                cell.column.id.includes("action");

              // Show action buttons at the bottom of the card
              if (isActionCell) {
                return (
                  <div key={cell.id} className="mt-2 flex justify-end">
                    {content}
                  </div>
                );
              }

              return (
                <div
                  key={cell.id}
                  className="flex flex-col border-b py-1 last:border-b-0"
                >
                  <div className="text-muted-foreground mb-1 text-sm font-medium">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    :
                  </div>
                  <div className="break-words">{content}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))
    )}
  </div>
);
