import {
  Table as ReactTable,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
} from "@tanstack/react-table";

export type Student = {
  _id: string;
  naam: string;
  achternaam: string;
  email: string;
  foto?: string;
};

export type Task = {
  _id: string;
  titel: string;
  type: string;
  deadline: string;
  weging: number;
  inzendingen: Array<{
    _id: string;
    gradering: Array<{
      score: number;
      maxscore: number;
    }>;
  }>;
  klasgroep: {
    _id: string;
    naam: string;
  };
};

export type Class = {
  _id: string;
  naam: string;
  studenten?: Student[];
};

export type DeleteItem = {
  type: "task" | "student";
  id: string;
} | null;

export interface TaskDetail {
  _id: string;
  type: string;
  titel: string;
  git: string;
  url: string;
  beschrijving: string;
  deadline: string;
  weging: number;
  maxScore: number;
  isGepubliceerd: boolean;
  bijlagen: string[];
  klasgroep: {
    _id: string;
    naam: string;
    studenten: Array<{
      naam: string;
      achternaam: string;
    }>;
  };
  vak?: string;
  inzendingen: Array<
    TaskSubmission & {
      student?: {
        naam: string;
        achternaam: string;
      };
    }
  >;
}

export interface TaskSubmission {
  _id: string;
  git: string;
  live: string;
  beschrijving: string;
  bijlagen: string[];
  gradering?: Array<{
    _id: string;
    feedback: string;
    score: number;
    maxscore: number;
  }>;
}

export interface TaskSubmissionFormProps {
  isSubmitted: boolean;
  initialSubmission?: TaskSubmission;
  submittedFiles?: string[];
  isDocent?: boolean;
}

export interface Entry {
  _id: string;
  datum: string;
  voormiddag: string;
  namiddag: string;
  tools: string;
  resultaat: string;
}

export interface ProfileData {
  id: string;
  naam: string;
  achternaam: string;
  gsm: string;
  foto: string;
  email: string;
}

export interface TaskDescriptionProps {
  id: string;
  klas: string;
  type: string;
  beschrijving: string;
  deadline: string;
  maxScore: number;
}

export interface TaskHeaderProps {
  lecture: string;
  klas: string;
  type: string;
}

export interface FilterSectionProps {
  klas: string | null;
  setKlas: (value: string | null) => void;
  type: string | null;
  setType: (value: string | null) => void;
  tasks: Task[];
  isDocent: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export interface RouteConfig {
  path: string;
  label: string;
  element?: React.ReactNode;
  children?: RouteConfig[];
}

export interface DataTableProps {
  table: ReactTable<any>;
  filterColumn?: string;
  filterPlaceholder?: string;
  showRowSelection?: boolean;
  emptyMessage?: string;
}

export interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  pagination: PaginationState;
  setSorting: (value: SortingState) => void;
  setColumnFilters: (value: ColumnFiltersState) => void;
  setColumnVisibility: (value: VisibilityState) => void;
  setPagination: (value: PaginationState) => void;
}

export interface UseTableConfigProps<TData> {
  data: TData[];
  columns: any[];
  pageSize?: number;
}

// Stagedagboek types
export interface StagedagboekHeaderProps {
  title: string;
  isDocent: boolean;
  onExportAll: () => void;
  onBack: () => void;
  onNewEntry?: () => void;
}

export interface EntryCardProps {
  entry: Entry;
  isDocent: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (entry: Entry) => void;
}

export interface StagedagboekViewProps {
  klasId?: string;
  studentId?: string;
  isDocent: boolean;
  title?: string;
}

// Form schema for stagedagboek
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

export const StagedagboekFormSchema = z.object({
  date: z.date({
    required_error: "Een datum is verplicht.",
  }),
  voormiddag: z.string().min(1, "Voormiddag taken zijn verplicht."),
  namiddag: z.string().min(1, "Namiddag taken zijn verplicht."),
  tools: z.string().min(1, "Gebruikte tools zijn verplicht."),
  result: z.string().min(1, "Resultaat is verplicht."),
});

export type StagedagboekFormFieldsProps = {
  form: UseFormReturn<z.infer<typeof StagedagboekFormSchema>>;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  isEditMode?: boolean;
};
