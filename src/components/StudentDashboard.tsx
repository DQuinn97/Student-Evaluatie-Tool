import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { ClipboardCheck, TrendingUp, UsersRound } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const student = {
  id: 1,
  name: "John Doe",
  tasks: [
    {
      lecture: "Introduction to React",
      gottenPoints: 10,
      totalPoints: 10,
      klas: "React",
      type: "taak",
      deadline: "2023-01-01",
      status: "Bezig",
      feedback: "",
    },
    {
      lecture: "React Hooks",
      gottenPoints: 8,
      totalPoints: 10,
      klas: "React",
      type: "taak",
      deadline: "2023-01-01",
      status: "Bezig",
      feedback: "",
    },
    {
      lecture: "React Router",
      gottenPoints: 12,
      totalPoints: 15,
      klas: "React",
      type: "toets",
      deadline: "2023-01-01",
      status: "Bezig",
      feedback: "",
    },
    {
      lecture: "React State Management",
      gottenPoints: 9,
      totalPoints: 10,
      klas: "React",
      type: "taak",
      deadline: "2023-01-01",
      status: "Bezig",
      feedback: "",
    },
    {
      lecture: "React Context API",
      gottenPoints: 11,
      totalPoints: 15,
      klas: "React",
      type: "taak",
      deadline: "2023-01-01",
      status: "Done",
      feedback: "Goed gedaan, John!",
    },
    {
      lecture: "React Query",
      gottenPoints: 10,
      totalPoints: 10,
      klas: "React",
      type: "taak",
      deadline: "2023-01-01",
      status: "Bezig",
      feedback: "",
    },
    {
      lecture: "React Server Components",
      gottenPoints: 12,
      totalPoints: 15,
      klas: "React",
      type: "toets",
      deadline: "2023-01-01",
      status: "Bezig",
      feedback: "",
    },
    {
      lecture: "React Testing Library",
      gottenPoints: 9,
      totalPoints: 10,
      klas: "React",
      type: "taak",
      deadline: "2023-01-01",
      status: "Bezig",
      feedback: "",
    },
    {
      lecture: "React Internationalization",
      gottenPoints: 11,
      totalPoints: 15,
      klas: "React",
      type: "taak",
      deadline: "2023-01-01",
      status: "Done",
      feedback: "Goed gedaan, John!",
    },
    {
      lecture: "React i18n",
      gottenPoints: 10,
      totalPoints: 10,
      klas: "React",
      type: "taak",
      deadline: "2023-01-01",
      status: "Bezig",
      feedback: "",
    },
  ],
};

const chartData = student.tasks
  .slice(-5)
  .map((task) => ({ name: task.lecture, points: task.gottenPoints }));

const chartConfig = {
  points: {
    label: "Points",
    color: "#cc0000",
  },
  name: {
    label: "Lecture",
    color: "#cc0000",
  },
} satisfies ChartConfig;

const StudentDashboard = () => {
  const average =
    student.tasks.reduce((acc, curr) => acc + curr.gottenPoints, 0) /
    student.tasks.length;

  return (
    <div>
      <h1 className="ml-4 text-4xl font-bold">{student.name}'s Dashboard</h1>
      <ChartContainer config={chartConfig} className="max-h-75 w-full p-4">
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
          />
          <YAxis hide={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="points"
            type="linear"
            stroke="#17a2b8"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
      <div className="my-10 flex gap-4 px-6">
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-4">
            <TrendingUp />
            <CardTitle>Jouw gemiddelde</CardTitle>
            <CardDescription className="text-center">
              {average.toFixed(1)}%
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
              {average.toFixed(1)}%
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-4">
            <ClipboardCheck />
            <CardTitle>Ingeleverde taken</CardTitle>
            <CardDescription className="text-center">
              {student.tasks.filter((task) => task.gottenPoints > 0).length} /{" "}
              {student.tasks.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link to="/student/taken">Bekijk taken</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="mx-10">
        <div className="flex justify-between">
          <h1>Snel overzicht taken</h1>
          <Button>
            <Link to="/student/taken">Bekijk alle taken</Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Taak</TableHead>
              <TableHead>Klas</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Feedback vd docent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {student.tasks.slice(-5).map((task) => (
              <TableRow key={task.lecture}>
                <TableCell>{task.lecture}</TableCell>
                <TableCell>{task.klas}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.deadline}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  {task.gottenPoints}/{task.totalPoints}
                </TableCell>
                <TableCell>{task.feedback}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default StudentDashboard;
