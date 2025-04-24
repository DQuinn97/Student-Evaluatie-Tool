import { Input } from "../../ui/input";
import { Search, X } from "lucide-react";

interface TableSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
  onClear: () => void;
}

/**
 * Search input component for data tables with clear button
 */
export const TableSearch = ({
  value,
  onChange,
  placeholder,
  className,
  onClear,
}: TableSearchProps) => (
  <div className="relative">
    <Search className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
    <Input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`pl-8 ${value ? "pr-8" : ""} ${className || ""}`}
    />
    {value && (
      <button
        type="button"
        onClick={onClear}
        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
      >
        <X className="h-4 w-4" />
      </button>
    )}
  </div>
);
