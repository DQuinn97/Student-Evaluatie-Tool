import { Button } from "../ui/button";
import { Loader2, Save } from "lucide-react";
import { useTaskForm } from "./hooks/useTaskForm";
import {
  TitleField,
  TypeField,
  DescriptionField,
  DeadlineField,
  ScoreField,
  SubjectField,
  AttachmentsField,
  PublishField,
  WeightField,
} from "./TaskFormFields";

interface CreateTaskFormProps {
  klasId: string;
  className?: string;
  onTaskCreated: (taskId: string) => void;
  initialTask?: {
    _id: string;
    titel: string;
    beschrijving: string;
    deadline: string;
    weging: number;
    maxScore: number;
    type: string;
    vak?: string;
    isGepubliceerd: boolean;
    bijlagen: string[];
  };
}

// Submit button component
const SubmitButton = ({
  submitting,
  isEditing,
}: {
  submitting: boolean;
  isEditing: boolean;
}) => (
  <Button type="submit" disabled={submitting} className="mt-4">
    {submitting ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {isEditing ? "Bijwerken..." : "Aanmaken..."}
      </>
    ) : (
      <>
        <Save className="mr-2 h-4 w-4" />
        {isEditing ? "Taak bijwerken" : "Taak aanmaken"}
      </>
    )}
  </Button>
);

export const CreateTaskForm = ({
  klasId,
  className,
  onTaskCreated,
  initialTask,
}: CreateTaskFormProps) => {
  const {
    taskData,
    updateTaskData,
    submitting,
    availableSubjects,
    files,
    setFiles,
    handleSubmit,
  } = useTaskForm({ klasId, initialTask, onTaskCreated });

  const isEditing = !!initialTask?._id;

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <TitleField
          value={taskData.titel}
          onChange={(value) => updateTaskData("titel", value)}
        />

        <TypeField
          value={taskData.type}
          onChange={(value) => updateTaskData("type", value)}
        />

        <DescriptionField
          value={taskData.beschrijving}
          onChange={(value) => updateTaskData("beschrijving", value)}
        />

        <DeadlineField
          value={taskData.deadline}
          onChange={(value) => updateTaskData("deadline", value)}
        />

        <WeightField
          value={taskData.weging}
          onChange={(value) => updateTaskData("weging", value)}
        />

        <ScoreField
          value={taskData.maxScore}
          onChange={(value) => updateTaskData("maxScore", value)}
        />

        <SubjectField
          value={taskData.vak}
          onChange={(value) => updateTaskData("vak", value)}
          subjects={availableSubjects}
        />

        <AttachmentsField onChange={setFiles} />

        <PublishField
          value={taskData.isGepubliceerd}
          onChange={(value) => updateTaskData("isGepubliceerd", value)}
        />

        <SubmitButton submitting={submitting} isEditing={isEditing} />
      </div>
    </form>
  );
};
