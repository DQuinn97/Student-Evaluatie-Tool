import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Class } from "@/types";

type ClassListProps = {
  classes: Class[];
  selectedClass: string | null;
  onSelectClass: (id: string) => void;
  isLoading: boolean;
};

export const ClassList = ({
  classes,
  selectedClass,
  onSelectClass,
  isLoading,
}: ClassListProps) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Klassen</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-muted-foreground">Laden...</div>
        ) : (
          <div className="space-y-2">
            {classes.map((klas) => (
              <Button
                key={klas._id}
                variant="ghost"
                className={`w-full justify-start ${
                  selectedClass === klas._id ? "bg-secondary" : "font-normal"
                }`}
                onClick={() => onSelectClass(klas._id)}
              >
                {klas.naam}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
