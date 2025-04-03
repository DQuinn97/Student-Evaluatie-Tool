interface TaskFeedbackProps {
  feedback: string;
}

export const TaskFeedback = ({ feedback }: TaskFeedbackProps) => {
  if (!feedback) return null;

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Feedback</h2>
      <p className="text-muted-foreground">{feedback}</p>
    </div>
  );
};
