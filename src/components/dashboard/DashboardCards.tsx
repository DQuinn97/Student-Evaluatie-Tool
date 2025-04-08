import { ClipboardCheck, TrendingUp, UsersRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface Task {
  gottenPoints: number;
  totalPoints: number;
  status: string;
}

interface DashboardCardsProps {
  tasks: Task[];
}

export const DashboardCards = ({ tasks }: DashboardCardsProps) => {
  const calculateClassAverage = () => {
    // Currently we don't have class average from the API
    // TODO: Add endpoint to get class average
    return 0;
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
      </Card>
    </div>
  );
};
