import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClassList } from "./ClassList";
import { TaskSection } from "./TaskSection";
import { StudentSection } from "./StudentSection";
import { useClassManagement } from "@/hooks/useClassManagement";
import { Accordion } from "@/components/ui/accordion";

export const ClassManagement = () => {
  const {
    classes,
    tasks,
    students,
    selectedClass,
    isLoading,
    error,
    setSelectedClass,
    handleCreateClass,
    handleCreateTask,
    handleDuplicateTask,
    handleDeleteTask,
    handleAddStudent,
    handleDeleteStudent,
  } = useClassManagement();

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Klasbeheer</h2>
        <Button onClick={handleCreateClass} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe Klas
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(auto,300px)_1fr]">
        <ClassList
          classes={classes}
          selectedClass={selectedClass}
          onSelectClass={setSelectedClass}
          isLoading={isLoading}
        />

        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <TaskSection
              tasks={tasks}
              isLoading={isLoading}
              onCreateTask={handleCreateTask}
              onDuplicateTask={handleDuplicateTask}
              onDeleteTask={handleDeleteTask}
              selectedClass={selectedClass}
            />
            <StudentSection
              students={students}
              isLoading={isLoading}
              onAddStudent={handleAddStudent}
              onDeleteStudent={handleDeleteStudent}
              selectedClass={selectedClass}
            />
          </Accordion>
        </div>
      </div>
    </div>
  );
};
