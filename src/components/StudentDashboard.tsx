import { ChartConfig } from "@/components/ui/chart";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useTableConfig } from "@/hooks/useTableConfig";
import { studentColumns } from "@/components/table/studentColumns";
import { DashboardCards } from "./dashboard/DashboardCards";
import { DataTable } from "./shared/DataTable";
import { FilterSection } from "./dashboard/FilterSection";
import { PerformanceChart } from "./dashboard/PerformanceChart";
import api from "../api";

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
  const [tasks, setTasks] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [userClass, setUserClass] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const { data: user } = await api.get("/profiel");
        setUserData(user);

        // Fetch user's class information - for students this will only return their class
        const { data: classes } = await api.get("/klassen");
        if (classes && classes.length > 0) {
          // Since students only get their own class, we can use the first one
          const userClass = classes[0];
          setUserClass(userClass);

          // Fetch tasks for user's class
          const { data: tasksData } = await api.get(
            `/klassen/${userClass._id}/taken`,
          );
          setTasks(tasksData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Memoize the sorted table data
  const tableData = useMemo(
    () =>
      tasks
        .sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
        )
        .map((task) => {
          const hasGradering = task.inzendingen?.[0]?.gradering?.length > 0;
          const graderingData = task.inzendingen?.[0]?.gradering?.[0];
          return {
            taakId: task._id,
            lecture: task.titel,
            hasGradering,
            gottenPoints: graderingData?.score ?? 0,
            totalPoints: graderingData ? graderingData.maxscore : task.weging,
            type: task.type,
            klas: task.klasgroep?.naam,
            deadline: task.deadline,
            status: task.inzendingen?.length > 0 ? "Ingeleverd" : "Open",
            feedback: graderingData?.feedback || "",
          };
        }),
    [tasks],
  );

  // Memoize the chart data
  const chartData = useMemo(
    () =>
      tasks
        .sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
        )
        .map((task) => {
          const hasGradering = task.inzendingen?.[0]?.gradering?.[0];
          const score = hasGradering?.score ?? 0;
          return {
            taakId: task._id,
            lecture: task.titel,
            points: score,
            totalPoints: hasGradering ? hasGradering.maxscore : task.weging,
            type: task.type,
            klas: task.klasgroep?.naam,
            deadline: task.deadline,
            status: task.inzendingen?.length > 0 ? "Ingeleverd" : "Open",
            feedback: hasGradering?.feedback || "",
          };
        }),
    [tasks],
  );

  // Memoize the table configuration
  const table = useTableConfig({
    data: tableData,
    columns: studentColumns,
    pageSize: 5,
  });

  // Memoize filter handlers
  const handleKlasChange = useCallback((newKlas: string | null) => {
    setKlas(newKlas);
  }, []);

  const handleTypeChange = useCallback((newType: string | null) => {
    setType(newType);
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="ml-4 text-4xl font-bold">
        {userData.naam ? `${userData.naam}'s Dashboard` : "Dashboard"}
      </h1>
      <DashboardCards tasks={tableData} />

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
        setKlas={handleKlasChange}
        type={type}
        setType={handleTypeChange}
        tasks={tableData}
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
