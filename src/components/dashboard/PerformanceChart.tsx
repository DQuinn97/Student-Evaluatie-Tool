import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";
import { useNavigate } from "react-router";

interface PerformanceChartProps {
  data: any[];
  klas: string | null;
  type: string | null;
  config: ChartConfig;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border-border/50 min-w-[8rem] rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
        <div className="mb-1 font-medium">
          {new Date(label).toLocaleDateString("nl-NL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="font-medium">{data.titel}</div>
        <div>{`${data.percentage}%`}</div>
      </div>
    );
  }
  return null;
};

export const PerformanceChart = ({
  data,
  klas,
  type,
  config,
}: PerformanceChartProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const taskId = data.activePayload[0].payload.taakId;
      navigate(`/student/taken/${taskId}`);
    }
  };

  // Preprocess data to include percentage values
  const processedData = data
    .filter(
      (task) =>
        (klas === "alle" || task.klas === klas) &&
        (!type || type === "alle" || task.type === type),
    )
    .map((task) => ({
      ...task,
      percentage:
        task.totalPoints > 0
          ? parseFloat(((task.points / task.totalPoints) * 100).toFixed(1))
          : 0,
    }));

  return (
    <ChartContainer config={config} className="max-h-75 w-full p-4">
      <LineChart
        data={processedData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="deadline"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => formatDate(value)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 100]}
          label={{ value: "Score (%)", angle: -90, position: "insideLeft" }}
        />
        <ChartTooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="percentage"
          name="Score"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{ fill: "var(--chart-1)" }}
        />
      </LineChart>
    </ChartContainer>
  );
};
