import { format, isValid } from "date-fns";
import { nl } from "date-fns/locale";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskMetricsProps {
  deadline: string;
  status: "Open" | "Ingeleverd" | "Te laat";
  gottenPoints: number | undefined | null;
  totalPoints: number;
  isDocent?: boolean;
  submittedCount?: number;
  totalStudents?: number;
}

export const TaskMetrics = ({
  deadline,
  status,
  gottenPoints,
  totalPoints,
  isDocent = false,
  submittedCount = 0,
  totalStudents,
}: TaskMetricsProps) => {
  const isMobile = useIsMobile();

  // Parse the deadline date safely and check if it's valid
  const deadlineDate = deadline ? new Date(deadline) : null;
  const isValidDate = deadlineDate && isValid(deadlineDate);

  // Check if deadline has passed
  const isDeadlinePassed = isValidDate && deadlineDate < new Date();
  const isLate = isDeadlinePassed && status === "Open";
  const displayStatus = isLate ? "Te laat" : status;
  const isGraded = typeof gottenPoints === "number";
  const scorePercentage =
    totalPoints > 0 && gottenPoints
      ? ((gottenPoints / totalPoints) * 100).toFixed(1)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
      <Card className={isMobile ? "p-2" : ""}>
        <CardHeader className={isMobile ? "px-3 pt-3 pb-2" : ""}>
          <CardTitle className={isMobile ? "text-base" : ""}>
            Deadline
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "px-3 py-2" : ""}>
          <p className={isMobile ? "text-sm" : ""}>
            {isValidDate
              ? format(deadlineDate, "d MMMM yyyy HH:mm", {
                  locale: nl,
                })
              : "Geen deadline ingesteld"}
          </p>
          <p
            className={`text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}
          >
            {isDocent ? (
              isDeadlinePassed ? (
                displayStatus === "Te laat" ? (
                  "Te laat ingeleverd"
                ) : (
                  "Deadline verstreken"
                )
              ) : (
                "Nog tijd over"
              )
            ) : (
              <>
                {displayStatus === "Te laat" && "Te laat ingeleverd"}
                {displayStatus === "Open" && "Nog tijd over"}
                {displayStatus === "Ingeleverd" && "Op tijd ingeleverd"}
              </>
            )}
          </p>
        </CardContent>
      </Card>

      <Card className={isMobile ? "p-2" : ""}>
        <CardHeader className={isMobile ? "px-3 pt-3 pb-2" : ""}>
          <CardTitle className={isMobile ? "text-base" : ""}>
            {isDocent ? "Ingeleverd" : "Status"}
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "px-3 py-2" : ""}>
          {isDocent ? (
            <div className="flex flex-col gap-1">
              <div className={`font-bold ${isMobile ? "text-lg" : "text-2xl"}`}>
                {submittedCount}/{totalStudents}
              </div>
              <p
                className={`text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}
              >
                {totalStudents
                  ? `${((submittedCount / totalStudents) * 100).toFixed(1)}% ingeleverd`
                  : "Geen studenten in deze klas"}
              </p>
            </div>
          ) : (
            <>
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
              {isGraded && (
                <p
                  className={`text-muted-foreground mt-2 ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  Score ontvangen
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className={isMobile ? "p-2" : ""}>
        <CardHeader className={isMobile ? "px-3 pt-3 pb-2" : ""}>
          <CardTitle className={isMobile ? "text-base" : ""}>Score</CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "px-3 py-2" : ""}>
          <div className="flex flex-col gap-1">
            <div className={`font-bold ${isMobile ? "text-lg" : "text-2xl"}`}>
              {isGraded ? `${gottenPoints}/${totalPoints}` : "-/-"}
            </div>
            {isGraded && totalPoints > 0 && (
              <p
                className={`text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}
              >
                {scorePercentage}%
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
