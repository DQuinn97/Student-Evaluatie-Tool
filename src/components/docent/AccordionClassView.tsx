import { useState, useEffect } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { DataTable } from "../shared/DataTable";
import { FilterSection } from "../dashboard/FilterSection";
import { PerformanceChart } from "../dashboard/PerformanceChart";
import { useTableConfig } from "@/hooks/useTableConfig";
import { ChartConfig } from "@/components/ui/chart";
import { useNavigate } from "react-router";
import api from "@/api";
import { getTaskColumns } from "../table/taskColumns";

const chartConfig = {
  points: { label: "Score" },
} satisfies ChartConfig;

type Task = {
  _id: string;
  titel: string;
  type: string;
  deadline: string;
  maxScore: number;
  inzendingen: Array<{
    _id: string;
    gradering: {
      score: number;
      feedback?: string;
    };
  }>;
};

type ClassViewProps = {
  classData: {
    _id: string;
    naam: string;
    taken: Task[];
  };
};

export const AccordionClassView = ({ classData }: ClassViewProps) => {
  const navigate = useNavigate();
  const [type, setType] = useState<string | null>("alle");
  const [totalStudents, setTotalStudents] = useState<number>(0);

  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const { data } = await api.get(`/klassen/${classData._id}`);
        if (data && data.studenten) {
          setTotalStudents(data.studenten.length || 0);
        }
      } catch (error) {
        console.error("Error fetching total students:", error);
      }
    };

    fetchTotalStudents();
  }, [classData._id]);

  const calculateAverageScore = (task: Task) => {
    const gradedSubmissions = task.inzendingen.filter(
      (inzending) => inzending.gradering,
    );

    if (gradedSubmissions.length === 0) return null;

    const graderingMaxScore = task.maxScore || 100;
    const totalScore = gradedSubmissions.reduce((acc, inzending) => {
      const graderingScore = inzending.gradering?.score || 0;

      return acc + graderingScore;
    }, 0);

    return (totalScore / gradedSubmissions.length / graderingMaxScore) * 100;
  };

  const tableData = classData.taken
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
    .map((task) => {
      const graderingData = task.inzendingen?.[0]?.gradering;
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
        totalPoints: task.maxScore ?? 0,
        klas: classData.naam,
        feedback: graderingData?.feedback || "",
        klasgroep: {
          _id: classData._id,
          naam: classData.naam,
        },
      };
    });

  // Use the reusable taskColumns component
  const taskColumns = getTaskColumns({
    navigate,
    calculateAverageScore: (task) => {
      const originalTask = classData.taken.find((t) => t._id === task._id);
      return originalTask ? calculateAverageScore(originalTask) : null;
    },
    totalStudentsByClass: totalStudents,
    isSimpleView: true, // Simplified view with just the view button
  });

  // Zorg ervoor dat filterSectionTasks voldoet aan het Task type
  const filterSectionTasks = tableData.map((task) => ({
    _id: task._id,
    titel: task.titel,
    type: task.type,
    deadline: task.deadline,
    weging: task.totalPoints, // Gebruik totalPoints als weging
    maxScore: task.totalPoints,
    inzendingen: task.inzendingen,
    klasgroep: {
      _id: classData._id,
      naam: classData.naam,
    },
  }));

  const filteredData = tableData.filter(
    (task) => type === "alle" || task.type === type,
  );

  const chartData = classData.taken
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    )
    .map((task) => {
      const hasGradering = task.inzendingen?.[0]?.gradering;
      const score = hasGradering?.score ?? 0;
      const maxScore = hasGradering ? task.maxScore : 100;

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
