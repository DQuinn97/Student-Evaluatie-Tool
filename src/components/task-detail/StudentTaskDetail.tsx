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
import { useIsMobile } from "@/hooks/use-mobile";

interface StudentTaskDetailProps {
  task: ITaskDetail | null;
}

export const StudentTaskDetail = ({ task }: StudentTaskDetailProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!task) {
    return null;
  }

  const submission = task.inzendingen[0];
  const isSubmitted = Boolean(submission);

  return (
    <div className={`container mx-auto ${isMobile ? "px-3 py-4" : "p-6"}`}>
      <div className="mb-4">
        <Button
          variant="ghost"
          size={isMobile ? "sm" : "default"}
          className="mb-2"
          onClick={() => navigate("/student/dashboard")}
        >
          <ArrowLeft className={`mr-1 ${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
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
        gottenPoints={submission?.gradering?.score}
        totalPoints={task.maxScore}
      />

      <TaskDescription
        id={task._id}
        klas={task.klasgroep.naam}
        type={task.type}
        beschrijving={task.beschrijving}
        deadline={task.deadline}
        maxScore={task.maxScore}
      />

      <Separator className="my-6" />

      <TaskSubmissionForm
        isSubmitted={isSubmitted}
        initialSubmission={submission}
        submittedFiles={submission?.bijlagen}
        isDocent={false}
      />

      {submission?.gradering?.feedback && (
        <TaskFeedback feedback={submission.gradering.feedback} />
      )}
    </div>
  );
};
