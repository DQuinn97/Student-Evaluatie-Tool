import { Separator } from "../ui/separator";
import { TaskHeader } from "./TaskHeader";
import { TaskMetrics } from "./TaskMetrics";
import { TaskDescription } from "./TaskDescription";
import { TaskSubmissionForm } from "./TaskSubmissionForm";
import { TaskFeedback } from "./TaskFeedback";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { TaskDetail as ITaskDetail } from "../../types";

interface StudentTaskDetailProps {
  task: ITaskDetail | null;
}

export const StudentTaskDetail = ({ task }: StudentTaskDetailProps) => {
  const navigate = useNavigate();

  if (!task) {
    return null;
  }

  const submission = task.inzendingen[0];
  console.log(submission);
  const isSubmitted = Boolean(submission);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/student/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug
        </Button>
      </div>

      <TaskHeader
        lecture={task.titel}
        klas={task.klasgroep.naam}
        type={task.type}
      />

      <TaskMetrics
        deadline={task.deadline}
        status={isSubmitted ? "Ingeleverd" : "Open"}
        gottenPoints={submission?.gradering?.[0]?.score}
        totalPoints={submission?.gradering?.[0]?.maxscore ?? 100}
      />

      <TaskDescription
        id={task._id}
        klas={task.klasgroep.naam}
        type={task.type}
        beschrijving={task.beschrijving}
        deadline={task.deadline}
        maxScore={task.weging}
      />

      <Separator className="my-8" />

      <TaskSubmissionForm
        isSubmitted={isSubmitted}
        initialSubmission={submission}
        submittedFiles={submission?.bijlagen}
        isDocent={false}
      />

      {submission?.gradering?.[0]?.feedback && (
        <TaskFeedback feedback={submission.gradering[0].feedback} />
      )}
    </div>
  );
};
