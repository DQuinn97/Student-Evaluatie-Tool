import { TaskSubmissionForm } from "./TaskSubmissionForm";
import { toast } from "sonner";
import api from "../../api";
import { TaskSubmission } from "../../types";

interface TaskSubmissionReviewProps {
  submission: TaskSubmission & {
    student?: {
      naam: string;
      achternaam: string;
    };
  };
  maxScore: number;
  className?: string;
}

export const TaskSubmissionReview = ({
  submission,
  maxScore,
  className,
}: TaskSubmissionReviewProps) => {
  const handleGradeSubmit = async (score: number, feedback: string) => {
    try {
      await api.post(`/inzendingen/${submission._id}/gradering`, {
        score,
        maxscore: maxScore,
        feedback,
      });
      toast.success("Beoordeling opgeslagen");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting grade:", error);
      toast.error(
        "Er is een fout opgetreden bij het opslaan van de beoordeling",
      );
    }
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">
          Inzending van {submission.student?.naam}{" "}
          {submission.student?.achternaam}
        </h3>
      </div>

      <TaskSubmissionForm
        isSubmitted={true}
        initialSubmission={submission}
        submittedFiles={submission.bijlagen}
        isDocent={true}
      />

      <div className="mt-4">
        <h4 className="mb-2 text-lg font-semibold">Beoordeling</h4>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Score (max {maxScore} punten)
            </label>
            <input
              type="number"
              min="0"
              max={maxScore}
              step="0.1"
              defaultValue={submission.gradering?.[0]?.score}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              onChange={(e) => {
                const score = Math.min(
                  Math.max(0, parseFloat(e.target.value)),
                  maxScore,
                );
                handleGradeSubmit(
                  score,
                  submission.gradering?.[0]?.feedback || "",
                );
              }}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Feedback</label>
            <textarea
              defaultValue={submission.gradering?.[0]?.feedback}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              onChange={(e) => {
                handleGradeSubmit(
                  submission.gradering?.[0]?.score || 0,
                  e.target.value,
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
