import { Badge } from "../ui/badge";

interface TaskHeaderProps {
  lecture: string;
  klas: string;
  type: string;
}

export const TaskHeader = ({ lecture, klas, type }: TaskHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{lecture}</h1>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="outline">{klas}</Badge>
        <Badge variant={type === "taak" ? "default" : "secondary"}>
          {type}
        </Badge>
      </div>
    </div>
  );
};
