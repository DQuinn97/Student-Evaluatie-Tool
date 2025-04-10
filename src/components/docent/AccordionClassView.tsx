import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { DashboardCards } from "../dashboard/DashboardCards";
import { DataTable } from "../shared/DataTable";
import { FilterSection } from "../dashboard/FilterSection";
import { PerformanceChart } from "../dashboard/PerformanceChart";
import { useTableConfig } from "@/hooks/useTableConfig";
import { ChartConfig } from "@/components/ui/chart";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { ColumnDef, Row } from "@tanstack/react-table";

const chartConfig = {
  points: { label: "Score" },
} satisfies ChartConfig;

type Task = {
  _id: string;
  titel: string;
  type: string;
  deadline: string;
  inzendingen: Array<{
    _id: string;
    gradering: Array<{
      score: number;
      maxscore: number;
      feedback?: string;
    }>;
  }>;
};

type ClassViewProps = {
  classData: {
    _id: string;
    naam: string;
    taken: Task[];
  };
};

const taskColumns: ColumnDef<Task>[] = [
  {
    accessorKey: "titel",
    header: "Titel",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }: { row: Row<Task> }) => {
      const deadline = row.getValue("deadline");
      return (
        <div>
          {format(new Date(deadline as string), "d MMMM yyyy HH:mm", {
            locale: nl,
          })}
        </div>
      );
    },
  },
];

export const AccordionClassView = ({ classData }: ClassViewProps) => {
  const [type, setType] = useState<string | null>("alle");

  const tableData = classData.taken
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
    .map((task) => {
      const graderingData = task.inzendingen?.[0]?.gradering?.[0];
      return {
        _id: task._id,
        taakId: task._id, // Use the full MongoDB ObjectId
        titel: task.titel,
        lecture: task.titel,
        type: task.type,
        deadline: task.deadline,
        inzendingen: task.inzendingen,
        status: task.inzendingen?.length > 0 ? "Ingeleverd" : "Open",
        gottenPoints: graderingData?.score ?? 0,
        totalPoints: graderingData ? graderingData.maxscore : 0,
        klas: classData.naam,
        feedback: graderingData?.feedback || "",
      };
    });

  const filterSectionTasks = tableData.map((task) => ({
    taakId: task._id,
    lecture: task.titel,
    klas: task.klas,
    type: task.type,
    deadline: task.deadline,
    status: task.status,
    feedback: task.feedback,
    totalPoints: task.totalPoints,
    gottenPoints: task.gottenPoints,
  }));

  const filteredData = tableData.filter(
    (task) => type === "alle" || task.type === type,
  );

  const chartData = classData.taken
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
    .map((task) => {
      const hasGradering = task.inzendingen?.[0]?.gradering?.[0];
      const score = hasGradering?.score ?? 0;
      const maxScore = hasGradering ? hasGradering.maxscore : 0;

      if (!hasGradering) return null;

      return {
        taakId: task._id,
        deadline: task.deadline,
        points: score,
        totalPoints: maxScore,
        type: task.type,
        klas: classData.naam,
        titel: task.titel,
      };
    })
    .filter(Boolean);

  const table = useTableConfig({
    data: filteredData,
    columns: taskColumns,
    pageSize: 5,
  });

  return (
    <Accordion.Item value={classData._id} className="border-b border-gray-200">
      <Accordion.Header className="flex">
        <Accordion.Trigger className="flex flex-1 items-center justify-between px-5 py-4">
          <span className="text-lg font-medium">{classData.naam}</span>
          <ChevronDown className="h-5 w-5 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
        <div className="p-5">
          <DashboardCards tasks={filteredData} />

          <div className="mx-10">
            <h2 className="mb-4 text-xl font-semibold">Overzicht taken</h2>
            <DataTable
              table={table}
              filterColumn="titel"
              filterPlaceholder="Filter taken..."
              showRowSelection={false}
              emptyMessage="Geen taken gevonden."
            />
          </div>

          <FilterSection
            type={type}
            setType={setType}
            tasks={filterSectionTasks}
            isDocent={true}
            klas={classData.naam}
            setKlas={() => {}}
          />

          <PerformanceChart
            data={chartData}
            klas={classData.naam}
            type={type}
            config={chartConfig}
          />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};
