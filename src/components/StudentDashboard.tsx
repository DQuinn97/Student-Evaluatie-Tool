import { ChartConfig } from "@/components/ui/chart";
import { useState } from "react";
import { useTableConfig } from "@/hooks/useTableConfig";

import { mockStudents } from "@/data/mockStudents";
import { studentColumns } from "@/components/table/studentColumns";

// Dashboard components
import { DashboardCards } from "./dashboard/DashboardCards";
import { DataTable } from "./shared/DataTable";
import { FilterSection } from "./dashboard/FilterSection";
import { PerformanceChart } from "./dashboard/PerformanceChart";

// Update chartData mapping to include totalPoints
const chartData = mockStudents[0].tasks
  .sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
  )
  .map((task) => ({
    id: task.id,
    lecture: task.lecture,
    points: task.gottenPoints,
    totalPoints: task.totalPoints,
    type: task.type,
    klas: task.klas,
    deadline: task.deadline,
    status: task.status,
    feedback: task.feedback,
  }));

const chartConfig = {
  name: {
    label: "Naam",
  },
  points: {
    label: "Punten",
  },
  klas: {
    label: "Klas",
  },
  deadline: {
    label: "Deadline",
  },
  status: {
    label: "Status",
  },
  feedback: {
    label: "Feedback",
  },
} satisfies ChartConfig;

const StudentDashboard = () => {
  const [klas, setKlas] = useState<string | null>("alle");
  const [type, setType] = useState<string | null>("alle");
  const currentStudent = mockStudents[0];

  const table = useTableConfig({
    data: chartData,
    columns: studentColumns,
    pageSize: 5,
  });

  return (
    <div>
      <h1 className="ml-4 text-4xl font-bold">
        {currentStudent.name.split(" ")[0]}'s Dashboard
      </h1>
      <DashboardCards tasks={currentStudent.tasks} />

      <div className="mx-10">
        <h1>Snel overzicht taken</h1>
        <DataTable
          table={table}
          filterColumn="lecture"
          filterPlaceholder="Filter taken..."
          showRowSelection={true}
          emptyMessage="Geen taken gevonden."
        />
      </div>

      <FilterSection
        klas={klas}
        setKlas={setKlas}
        type={type}
        setType={setType}
        tasks={currentStudent.tasks}
      />

      <PerformanceChart
        data={chartData}
        klas={klas}
        type={type}
        config={chartConfig}
      />
    </div>
  );
};
export default StudentDashboard;
