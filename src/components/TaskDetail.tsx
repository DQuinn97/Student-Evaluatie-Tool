import { Separator } from "./ui/separator";
import { mockStudents } from "@/data/mockStudents";

// Task Detail Components
import { TaskHeader } from "./task-detail/TaskHeader";
import { TaskMetrics } from "./task-detail/TaskMetrics";
import { TaskDescription } from "./task-detail/TaskDescription";
import { TaskSubmissionForm } from "./task-detail/TaskSubmissionForm";
import { TaskFeedback } from "./task-detail/TaskFeedback";

export const TaskDetail = () => {
  // Find task and handle not found case
  const task = mockStudents[0].tasks.find((t) => t.id);
  if (!task) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-500">Taak niet gevonden</h1>
        <p className="text-muted-foreground mt-2">
          De opgevraagde taak kon niet worden gevonden.
        </p>
      </div>
    );
  }

  const isSubmitted = task.status === "Ingeleverd";

  return (
    <div className="container mx-auto p-6">
      <TaskHeader lecture={task.lecture} klas={task.klas} type={task.type} />

      <TaskMetrics
        deadline={task.deadline}
        status={task.status}
        gottenPoints={task.gottenPoints}
        totalPoints={task.totalPoints}
      />

      <TaskDescription klas={task.klas} type={task.type} />

      <Separator className="my-8" />

      <TaskSubmissionForm
        isSubmitted={isSubmitted}
        initialSubmission={task.submission}
        submittedFiles={task.submission?.files}
      />

      <TaskFeedback feedback={task.feedback} />
    </div>
  );
};
