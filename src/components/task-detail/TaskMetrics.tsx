import { format, isValid } from "date-fns";
import { nl } from "date-fns/locale";
import { MetricCards } from "../shared/MetricCards";
import { BadgeCheck, CalendarCheck, Clipboard } from "lucide-react";

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

  // Create metrics for the MetricCards component
  const metrics = [
    {
      title: "Deadline",
      icon: CalendarCheck,
      value: isValidDate
        ? format(deadlineDate, "d MMMM yyyy HH:mm", { locale: nl })
        : "Geen deadline ingesteld",
      subtitle: isDocent
        ? isDeadlinePassed
          ? displayStatus === "Te laat"
            ? "Te laat ingeleverd"
            : "Deadline verstreken"
          : "Nog tijd over"
        : displayStatus === "Te laat"
          ? "Te laat ingeleverd"
          : displayStatus === "Open"
            ? "Nog tijd over"
            : "Op tijd ingeleverd",
    },
    {
      title: isDocent ? "Ingeleverd" : "Status",
      icon: Clipboard,
      value: isDocent ? `${submittedCount}/${totalStudents}` : "",
      subtitle:
        isDocent && totalStudents
          ? `${((submittedCount / totalStudents) * 100).toFixed(1)}% ingeleverd`
          : isGraded
            ? "Score ontvangen"
            : "",
      badgeText: !isDocent ? displayStatus : undefined,
      badgeVariant: !isDocent
        ? ((displayStatus === "Ingeleverd"
            ? "success"
            : displayStatus === "Te laat"
              ? "destructive"
              : "default") as "success" | "destructive" | "default")
        : undefined,
    },
    {
      title: "Score",
      icon: BadgeCheck,
      value: isGraded ? `${gottenPoints.toFixed(2)}/${totalPoints}` : "-/-",
      subtitle: isGraded && totalPoints > 0 ? `${scorePercentage}%` : undefined,
    },
  ];

  return <MetricCards metrics={metrics} />;
};
