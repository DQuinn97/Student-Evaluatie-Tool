import { format } from "date-fns";
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
  const isLate = new Date(deadline) < new Date() && status === "Open";
  const displayStatus = isLate ? "Te laat" : status;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Deadline</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {format(new Date(deadline), "d MMMM yyyy HH:mm", {
              locale: nl,
            })}
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
          {displayStatus === "Ingeleverd" && gottenPoints > 0 && (
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
          <div className="text-2xl font-bold">
            {gottenPoints}/{totalPoints}
          </div>
          {totalPoints > 0 && (
            <p className="text-muted-foreground text-sm">
              {((gottenPoints / totalPoints) * 100).toFixed(0)}%
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
