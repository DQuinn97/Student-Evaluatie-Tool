import { ChartConfig } from "@/components/ui/chart";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useTableConfig } from "@/hooks/useTableConfig";
import { studentColumns } from "@/components/table/studentColumns";
import { DashboardCards } from "./dashboard/DashboardCards";
import { DataTable } from "./shared/DataTable";
import { FilterSection } from "./dashboard/FilterSection";
import { PerformanceChart } from "./dashboard/PerformanceChart";
import api from "../api";
import { useNavigate } from "react-router";

const chartConfig = {
  points: { label: "Score" },
} satisfies ChartConfig;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [klas, setKlas] = useState<string | null>("alle");
  const [type, setType] = useState<string | null>("alle");
  const [tasks, setTasks] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: user } = await api.get("/profiel");
        if (user.isDocent) {
          navigate("/docent/dashboard");
          return;
        }
        setUserData(user);

        const { data: classes } = await api.get("/klassen");
        if (classes && classes.length > 0) {
          const userClass = classes[0];
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
  }, [navigate]);

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
            deadline: task.deadline,
            status: task.inzendingen?.length > 0 ? "Ingeleverd" : "Open",
            feedback: graderingData?.feedback || "",
            klas: task.klasgroep?.naam || "",
          };
        }),
    [tasks],
  );

  const filteredData = useMemo(() => {
    let filtered = tableData;

    // Apply type filter
    if (type && type !== "alle") {
      filtered = filtered.filter((t) => t.type === type);
    }

    return filtered;
  }, [tableData, type]);

  // Convert filteredData to match Task interface for DashboardCards
  const tasksForCards = useMemo(() => {
    return tasks
      .filter((task) => {
        if (type && type !== "alle") {
          return task.type === type;
        }
        return true;
      })
      .map((task) => {
        const graderingData = task.inzendingen?.[0]?.gradering?.[0];
        return {
          _id: task._id,
          taakId: task._id,
          titel: task.titel,
          lecture: task.titel,
          type: task.type,
          deadline: task.deadline,
          inzendingen: task.inzendingen,
          status: task.inzendingen?.length > 0 ? "Ingeleverd" : "Open",
          gottenPoints: graderingData?.score ?? 0,
          totalPoints: graderingData ? graderingData.maxscore : task.weging,
          klas: task.klasgroep?.naam || "",
          feedback: graderingData?.feedback || "",
        };
      });
  }, [tasks, type]);

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
          const maxScore = hasGradering ? hasGradering.maxscore : task.weging;

          // Only include tasks that have been graded
          if (!hasGradering) {
            return null;
          }

          return {
            taakId: task._id,
            deadline: task.deadline,
            points: score,
            totalPoints: maxScore,
            type: task.type,
            klas: task.klasgroep?.naam || "",
            titel: task.titel,
          };
        })
        .filter(Boolean), // Remove null entries
    [tasks],
  );

  const table = useTableConfig({
    data: filteredData,
    columns: studentColumns(false),
    pageSize: 5,
  });

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

      <DashboardCards tasks={tasksForCards} />

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
        klas={userData.isDocent ? klas : null}
        setKlas={userData.isDocent ? handleKlasChange : () => {}}
        type={type}
        setType={handleTypeChange}
        tasks={tableData}
        isDocent={userData.isDocent}
      />

      <PerformanceChart
        data={chartData}
        klas={userData.isDocent ? klas : "alle"}
        type={type}
        config={chartConfig}
      />
    </div>
  );
};

export default StudentDashboard;
