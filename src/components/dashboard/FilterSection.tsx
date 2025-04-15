import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RotateCcw } from "lucide-react";
import { FilterSectionProps } from "@/types";

export const FilterSection = ({
  setKlas,
  type,
  setType,
  tasks,
  isDocent,
}: FilterSectionProps) => {
  return (
    <div className="m-4 flex flex-row gap-4">
      <div className="flex items-center gap-4">
        <h2 className="mt-0 text-lg font-semibold tracking-tight">
          Type selecteren
        </h2>
        <Select value={type || undefined} onValueChange={setType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecteer een type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle</SelectItem>
            {tasks
              .map((task) => task.type)
              .filter((type, index, array) => array.indexOf(type) === index)
              .map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={() => {
          if (isDocent) {
            setKlas("alle");
          }
          setType("alle");
        }}
      >
        <RotateCcw />
      </Button>
    </div>
  );
};
