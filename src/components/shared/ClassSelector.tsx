import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Class } from "@/types";
import { saveSelectedClass } from "@/lib/classStorage";

interface ClassSelectorProps {
  classes: Class[];
  selectedClass: string | null;
  onSelectClass: (id: string) => void;
  isLoading?: boolean;
  width?: string;
  placeholder?: string;
  label?: string;
}

export const ClassSelector = ({
  classes,
  selectedClass,
  onSelectClass,
  isLoading = false,
  width = "w-full sm:w-72",
  placeholder = "Selecteer een klas",
  label,
}: ClassSelectorProps) => {
  // Save to localStorage whenever selectedClass changes
  useEffect(() => {
    if (selectedClass) {
      saveSelectedClass(selectedClass);
    }
  }, [selectedClass]);

  const handleClassChange = (value: string) => {
    onSelectClass(value);
  };

  return (
    <div>
      {label && <h2 className="mb-2 text-xl font-semibold">{label}</h2>}
      <Select
        value={selectedClass || ""}
        onValueChange={handleClassChange}
        disabled={isLoading || classes.length === 0}
      >
        <SelectTrigger className={width}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {classes.map((classItem) => (
            <SelectItem key={classItem._id} value={classItem._id}>
              {classItem.naam}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
