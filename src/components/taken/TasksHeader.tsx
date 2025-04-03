import { TrendingUp, UsersRound, ClipboardCheck } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router";

interface TasksHeaderProps {
  personalAverage: number;
  classAverage: number;
  averageTotalPoints: number;
  completedTasks: number;
  totalTasks: number;
}

export const TasksHeader = ({
  personalAverage,
  classAverage,
  averageTotalPoints,
  completedTasks,
  totalTasks,
}: TasksHeaderProps) => {
  return (
    <>
      <div>
        <h1 className="ml-6 text-4xl font-bold">Taken</h1>
      </div>
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
          <CardContent>
            <Button>
              <Link to="/student/taken">Bekijk taken</Link>
            </Button>
          </CardContent>
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
    </>
  );
};
