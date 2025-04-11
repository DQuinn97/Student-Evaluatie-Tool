import { Badge } from "../ui/badge";
import { TaskHeaderProps } from "@/types";

export const TaskHeader = ({ lecture, klas, type }: TaskHeaderProps) => {
  // Capitalize the first letter of the type
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">{lecture}</h1>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge variant="outline">{klas}</Badge>
        <Badge variant={type === "taak" ? "default" : "secondary"}>
          {displayType}
        </Badge>
      </div>
    </div>
  );
};
