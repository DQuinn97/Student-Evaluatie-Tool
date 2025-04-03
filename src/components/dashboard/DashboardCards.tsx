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

interface DashboardCardsProps {
  personalAverage: number;
  classAverage: number;
  averageTotalPoints: number;
  completedTasks: number;
  totalTasks: number;
}

export const DashboardCards = ({
  personalAverage,
  classAverage,
  averageTotalPoints,
  completedTasks,
  totalTasks,
}: DashboardCardsProps) => {
  return (
    <div className="my-10 flex gap-4 px-6">
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-4">
          <TrendingUp />
          <CardTitle>Jouw gemiddelde</CardTitle>
          <CardDescription className="text-center">
            {personalAverage.toFixed(2)} / {averageTotalPoints}
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
            {classAverage.toFixed(2)} / {averageTotalPoints}
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