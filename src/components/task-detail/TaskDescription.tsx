interface TaskDescriptionProps {
  id: string;
  klas: string;
  type: string;
  beschrijving: string;
  deadline: string;
  maxScore: number;
}

export const TaskDescription = ({ beschrijving }: TaskDescriptionProps) => {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Taak beschrijving</h2>
      <div className="text-muted-foreground space-y-4">
        <p>{beschrijving}</p>
      </div>
    </div>
  );
};
