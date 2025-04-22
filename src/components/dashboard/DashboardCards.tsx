import { ClipboardCheck, TrendingUp, UsersRound } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import api from "@/api";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Task {
  _id: string;
  taakId: string;
  titel: string;
  lecture: string;
  type: string;
  deadline: string;
  inzendingen?: Array<{
    gradering?: {
      score: number;
      feedback?: string;
    };
  }>;
  status: string;
  gottenPoints: number;
  totalPoints: number;
  klas: string;
  feedback?: string;
}

interface DashboardCardsProps {
  tasks: Task[];
}

export const DashboardCards = ({ tasks }: DashboardCardsProps) => {
  const [classAverage, setClassAverage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchClassAverage = async () => {
      try {
        // Only fetch class averages for tasks that have been graded
        const gradedTaskIds = tasks
          .filter(
            (task) => task.status === "Ingeleverd" && task.gottenPoints > 0,
          )
          .map((task) => task._id)
          .filter((id) => {
            // Validate that the ID matches MongoDB ObjectId format
            return /^[0-9a-fA-F]{24}$/.test(id);
          });

        const fetchWithRetry = async (taskId: string, retries = 2) => {
          for (let i = 0; i <= retries; i++) {
            try {
              const { data } = await api.get(`/taken/${taskId}/score`);
              return data;
            } catch (error: any) {
              if (error.response?.status === 403) {
                // Skip tasks where user doesn't have access to class average
                return null;
              }
              if (error.response?.status === 500) {
                console.error(
                  `Server error for task ${taskId}:`,
                  error.response?.data || "Internal Server Error",
                );
                if (i === retries) {
                  // If we've exhausted retries on a 500 error, skip this task
                  return null;
                }
              }
              if (i === retries) {
                console.error(
                  `Failed to fetch score for task ${taskId} after ${retries} retries:`,
                  error.response?.data || error.message,
                );
                return null;
              }
              // Wait before retrying (exponential backoff)
              await new Promise((resolve) =>
                setTimeout(resolve, Math.pow(2, i) * 1000),
              );
            }
          }
          return null;
        };

        const averages = await Promise.all(
          gradedTaskIds.map((taskId) => fetchWithRetry(taskId)),
        );

        const validAverages = averages.filter((avg) => avg !== null);
        if (validAverages.length > 0) {
          setClassAverage(
            validAverages.reduce((acc, curr) => acc + curr, 0) /
              validAverages.length,
          );
          setError(null);
        } else if (gradedTaskIds.length > 0) {
          setError("Kon klasgemiddelde niet ophalen");
        }
      } catch (err) {
        console.error("Error fetching class averages:", err);
        setError(
          "Er is een fout opgetreden bij het ophalen van het klasgemiddelde",
        );
      }
    };

    if (tasks.length > 0) {
      fetchClassAverage();
    }
  }, [tasks]);

  // Only include tasks that have been graded and have non-zero points
  const gradedTasks = tasks.filter(
    (task) =>
      task.status === "Ingeleverd" &&
      task.gottenPoints > 0 &&
      task.totalPoints > 0,
  );

  const personalAverage =
    gradedTasks.length > 0
      ? (gradedTasks.reduce(
          (acc, curr) => acc + curr.gottenPoints / curr.totalPoints,
          0,
        ) /
          gradedTasks.length) *
        100
      : 0;

  const completedTasks = tasks.filter(
    (task) => task.status === "Ingeleverd",
  ).length;
  const totalTasks = tasks.length;

  return (
    <div className="my-4 grid grid-cols-3 gap-2 px-2 md:my-6 md:gap-4 md:px-6">
      <Card className="w-full">
        <CardHeader
          className={`flex flex-col items-center gap-1 ${isMobile ? "px-2" : "gap-3"}`}
        >
          <TrendingUp className={isMobile ? "h-4 w-4" : "h-6 w-6"} />
          <CardTitle
            className={isMobile ? "text-center text-xs" : "text-center"}
          >
            Jouw gemiddelde
          </CardTitle>
          <CardDescription
            className={`text-center font-semibold ${isMobile ? "text-sm" : "text-xl"}`}
          >
            {personalAverage > 0 ? `${personalAverage.toFixed(1)}%` : "-/-"}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-full">
        <CardHeader
          className={`flex flex-col items-center gap-1 ${isMobile ? "px-2" : "gap-3"}`}
        >
          <UsersRound className={isMobile ? "h-4 w-4" : "h-6 w-6"} />
          <CardTitle
            className={isMobile ? "text-center text-xs" : "text-center"}
          >
            Klas gemiddelde
          </CardTitle>
          <CardDescription
            className={`text-center font-semibold ${isMobile ? "text-sm" : "text-xl"}`}
          >
            {error ? (
              <span
                className={`text-red-500 ${isMobile ? "text-xs" : "text-sm"}`}
              >
                {error}
              </span>
            ) : classAverage && classAverage > 0 ? (
              `${classAverage.toFixed(1)}%`
            ) : (
              "-/-"
            )}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-full">
        <CardHeader
          className={`flex flex-col items-center gap-1 ${isMobile ? "px-2" : "gap-3"}`}
        >
          <ClipboardCheck className={isMobile ? "h-4 w-4" : "h-6 w-6"} />
          <CardTitle
            className={isMobile ? "text-center text-xs" : "text-center"}
          >
            Ingeleverde taken
          </CardTitle>
          <CardDescription
            className={`text-center font-semibold ${isMobile ? "text-sm" : "text-xl"}`}
          >
            {completedTasks} / {totalTasks}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
