import { TaskSubmissionForm } from "./TaskSubmissionForm";
import { toast } from "sonner";
import api from "../../api";
import { TaskSubmission } from "../../types";
import { useState, useEffect } from "react";

interface TaskSubmissionReviewProps {
  submission: TaskSubmission & {
    student?: {
      naam: string;
      achternaam: string;
    };
  };
  maxScore: number;
  className?: string;
  onGradingUpdate?: () => void;
}

export const TaskSubmissionReview = ({
  submission,
  maxScore,
  className,
  onGradingUpdate,
}: TaskSubmissionReviewProps) => {
  const existingGrading = submission.gradering;
  const [score, setScore] = useState<number>(existingGrading?.score || 0);
  const [feedback, setFeedback] = useState<string>(
    existingGrading?.feedback || "",
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleGradeSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (existingGrading) {
        // Update bestaande gradering
        await api.patch(`/graderingen/${existingGrading._id}`, {
          score,
          feedback,
        });
      } else {
        // Maak nieuwe gradering aan
        await api.post(`/inzendingen/${submission._id}/gradering`, {
          score,
          feedback,
        });
      }

      toast.success("Beoordeling opgeslagen");
      // Roep de callback aan om de parent component te updaten
      if (onGradingUpdate) {
        onGradingUpdate();
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting grade:", error);
      toast.error(
        "Er is een fout opgetreden bij het opslaan van de beoordeling",
      );
      setIsSubmitting(false);
    }
  };

  // Update lokale state wanneer submission verandert
  useEffect(() => {
    if (existingGrading) {
      setScore(existingGrading.score);
      setFeedback(existingGrading.feedback);
    }
  }, [existingGrading]);

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
            <label className="mb-2 block text-sm font-medium">Score</label>
            <input
              type="number"
              min="0"
              max={maxScore}
              step="0.1"
              value={score}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              onChange={(e) => {
                const newScore = Math.min(
                  Math.max(0, parseFloat(e.target.value) || 0),
                  maxScore,
                );
                setScore(newScore);
              }}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Feedback</label>
            <textarea
              value={feedback}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              onChange={(e) => {
                setFeedback(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium transition-colors disabled:opacity-50"
            onClick={handleGradeSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Bezig met opslaan..." : "Beoordeling opslaan"}
          </button>
        </div>
      </div>
    </div>
  );
};
