import { TaskDescriptionProps } from "@/types";

export const TaskDescription = ({ beschrijving }: TaskDescriptionProps) => {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Taak beschrijving</h2>
      <div
        className="text-muted-foreground space-y-4"
        dangerouslySetInnerHTML={{ __html: beschrijving }}
      />
    </div>
  );
};
