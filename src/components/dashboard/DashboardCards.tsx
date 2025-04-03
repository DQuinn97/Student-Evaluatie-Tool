import { Link } from "react-router";
import { ClipboardCheck, TrendingUp, UsersRound } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { mockStudents } from "@/data/mockStudents";

interface Task {
  gottenPoints: number;
  totalPoints: number;
  status: string;
  lecture: string;
}

interface DashboardCardsProps {
  tasks: Task[];
}

export const DashboardCards = ({ tasks }: DashboardCardsProps) => {
  const calculateClassAverage = () => {
    const allTasks = mockStudents.flatMap((student) => student.tasks);
    const taskGroups = allTasks.reduce(
      (acc, task) => {
        if (!acc[task.lecture]) {
          acc[task.lecture] = [];
        }
        acc[task.lecture].push(task);
        return acc;
      },
      {} as Record<string, typeof allTasks>,
    );

    const taskAverages = Object.values(taskGroups).map((tasks) => ({
      gottenPoints:
        tasks.reduce((sum, task) => sum + task.gottenPoints, 0) / tasks.length,
      totalPoints:
        tasks.reduce((sum, task) => sum + task.totalPoints, 0) / tasks.length,
    }));

    return (
      taskAverages.reduce((sum, avg) => sum + avg.gottenPoints, 0) /
      taskAverages.length
    );
  };

  const personalAverage =
    tasks.length > 0
      ? tasks.reduce((acc, curr) => acc + curr.gottenPoints, 0) / tasks.length
      : 0;

  const averageTotalPoints =
    tasks.length > 0
      ? tasks.reduce((acc, curr) => acc + curr.totalPoints, 0) / tasks.length
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
            {personalAverage.toFixed(2)} / {averageTotalPoints.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            <Link to="/student/punten">Punten bekijken</Link>
          </Button>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-4">
          <UsersRound />
          <CardTitle>Klas gemiddelde</CardTitle>
          <CardDescription className="text-center">
            {calculateClassAverage().toFixed(2)} /{" "}
            {averageTotalPoints.toFixed(2)}
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
        <CardContent>
          <Button>
            <Link to="/student/taken">Bekijk taken</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
