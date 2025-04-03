import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface PerformanceChartProps {
  data: any[];
  klas: string | null;
  type: string | null;
  config: ChartConfig;
}

export const PerformanceChart = ({
  data,
  klas,
  type,
  config,
}: PerformanceChartProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <ChartContainer config={config} className="max-h-75 w-full p-4">
      <LineChart
        accessibilityLayer
        data={data.filter(
          (task) =>
            (klas === "alle" || task.klas === klas) &&
            (!type || type === "alle" || task.type === type),
        )}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="deadline"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => formatDate(value)}
        />
        <YAxis hide={false} tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line dataKey="name" type="linear" />
        <Line dataKey="points" type="linear" />
        <Line dataKey="klas" type="linear" />
        <Line dataKey="type" type="linear" />
      </LineChart>
    </ChartContainer>
  );
};
