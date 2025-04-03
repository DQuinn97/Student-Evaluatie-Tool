import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TaskMetricsProps {
  deadline: string;
  status: string;
  gottenPoints: number;
  totalPoints: number;
}

export const TaskMetrics = ({
  deadline,
  status,
  gottenPoints,
  totalPoints,
}: TaskMetricsProps) => {
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
            {status === "Te laat" && "Te laat ingeleverd"}
            {status === "Bezig" && "Nog tijd over"}
            {status === "Ingeleverd" && "Op tijd ingeleverd"}
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
              status === "Ingeleverd"
                ? "success"
                : status === "Te laat"
                  ? "destructive"
                  : "default"
            }
          >
            {status}
          </Badge>
          {status === "Ingeleverd" && (
            <p className="text-muted-foreground mt-2 text-sm">
              4 dagen geleden gedaan
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
          <p className="text-muted-foreground text-sm">
            {((gottenPoints / totalPoints) * 100).toFixed(0)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
