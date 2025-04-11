import { format, isValid } from "date-fns";
import { nl } from "date-fns/locale";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TaskMetricsProps {
  deadline: string;
  status: "Open" | "Ingeleverd" | "Te laat";
  gottenPoints: number;
  totalPoints: number;
}

export const TaskMetrics = ({
  deadline,
  status,
  gottenPoints,
  totalPoints,
}: TaskMetricsProps) => {
  // Parse the deadline date safely and check if it's valid
  const deadlineDate = deadline ? new Date(deadline) : null;
  const isValidDate = deadlineDate && isValid(deadlineDate);

  const isLate = isValidDate && deadlineDate < new Date() && status === "Open";
  const displayStatus = isLate ? "Te laat" : status;
  const hasGradering = gottenPoints !== undefined && gottenPoints !== null;
  const scorePercentage =
    totalPoints > 0 ? ((gottenPoints / totalPoints) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Deadline</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {isValidDate
              ? format(deadlineDate, "d MMMM yyyy HH:mm", {
                  locale: nl,
                })
              : "Geen deadline ingesteld"}
          </p>
          <p className="text-muted-foreground text-sm">
            {displayStatus === "Te laat" && "Te laat ingeleverd"}
            {displayStatus === "Open" && "Nog tijd over"}
            {displayStatus === "Ingeleverd" && "Op tijd ingeleverd"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            variant={
              displayStatus === "Ingeleverd"
                ? "success"
                : displayStatus === "Te laat"
                  ? "destructive"
                  : "default"
            }
          >
            {displayStatus}
          </Badge>
          {hasGradering && (
            <p className="text-muted-foreground mt-2 text-sm">
              Score ontvangen
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold">
              {hasGradering ? `${gottenPoints}/${totalPoints}` : "-/-"}
            </div>
            {hasGradering && totalPoints > 0 && (
              <p className="text-muted-foreground text-sm">
                {scorePercentage}%
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
