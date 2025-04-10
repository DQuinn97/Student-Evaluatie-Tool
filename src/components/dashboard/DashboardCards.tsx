import { ClipboardCheck, TrendingUp, UsersRound } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import api from "@/api";
import { useEffect, useState } from "react";

interface Task {
  gottenPoints: number;
  totalPoints: number;
  status: string;
  taakId: number;
}

interface DashboardCardsProps {
  tasks: Task[];
}

export const DashboardCards = ({ tasks }: DashboardCardsProps) => {
  const [classAverage, setClassAverage] = useState<number | null>(null);

  useEffect(() => {
    const fetchClassAverage = async () => {
      try {
        // Only fetch class averages for tasks that have been graded
        const gradedTaskIds = tasks
          .filter(
            (task) => task.status === "Ingeleverd" && task.gottenPoints > 0,
          )
          .map((task) => task.taakId);

        const averages = await Promise.all(
          gradedTaskIds.map((taskId) =>
            api
              .get(`/taken/${taskId}/score`)
              .then(({ data }) => data)
              .catch((error) => {
                if (error.response?.status === 403) {
                  // Skip tasks where user doesn't have access to class average
                  return null;
                }
                console.error("Error fetching task score:", error);
                return null;
              }),
          ),
        );

        const validAverages = averages.filter((avg) => avg !== null);
        if (validAverages.length > 0) {
          setClassAverage(
            validAverages.reduce((acc, curr) => acc + curr, 0) /
              validAverages.length,
          );
        }
      } catch (err) {
        console.error("Error fetching class averages:", err);
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
    <div className="my-10 flex gap-4 px-6">
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-4">
          <TrendingUp />
          <CardTitle>Jouw gemiddelde</CardTitle>
          <CardDescription className="text-center">
            {personalAverage > 0 ? `${personalAverage.toFixed(1)}%` : "-/-"}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-4">
          <UsersRound />
          <CardTitle>Klas gemiddelde</CardTitle>
          <CardDescription className="text-center">
            {classAverage && classAverage > 0
              ? `${classAverage.toFixed(1)}%`
              : "-/-"}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-4">
          <ClipboardCheck />
          <CardTitle>Ingeleverde taken</CardTitle>
          <CardDescription className="text-center">
            {completedTasks} / {totalTasks}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};
