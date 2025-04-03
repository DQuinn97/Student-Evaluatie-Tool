import { useTableConfig } from "@/hooks/useTableConfig";
import { studentColumns } from "@/components/table/studentColumns";

// Import components
import { DashboardCards } from "./dashboard/DashboardCards";
import { DataTable } from "./shared/DataTable";

// Import mock data
import { mockStudents } from "../data/mockStudents";

const student = mockStudents[0];

const StudentTaken = () => {
  const tableData = student.tasks.map((task) => ({
    ...task,
    gottenPoints: task.gottenPoints,
    totalPoints: task.totalPoints,
  }));

  const table = useTableConfig({
    data: tableData,
    columns: studentColumns,
    pageSize: 5,
  });

  return (
    <>
      <div>
        <h1 className="ml-6 text-4xl font-bold">Taken</h1>
      </div>
      <DashboardCards tasks={student.tasks} />
      <div className="mx-10">
        <h1>Overzicht taken</h1>
        <DataTable
          table={table}
          filterColumn="lecture"
          filterPlaceholder="Filter taken..."
          showRowSelection={true}
          emptyMessage="Geen taken gevonden."
        />
      </div>
    </>
  );
};

export default StudentTaken;
