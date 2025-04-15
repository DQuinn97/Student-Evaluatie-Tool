import { useParams } from "react-router";
import { StagedagboekView } from "../stagedagboek/StagedagboekView";

export const StudentStagedagboekView = () => {
  const { klasId, studentId } = useParams();

  return (
    <StagedagboekView isDocent={true} klasId={klasId} studentId={studentId} />
  );
};
