import {
  Table as ReactTable,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

// ===== User Types =====
export interface User {
  _id: string;
  naam: string;
  achternaam: string;
  email: string;
  foto?: string;
  gsm?: string;
  isDocent?: boolean;
}

// Type for profile form/display where ID is represented differently
export type ProfileData = Omit<User, "_id"> & { id: string };

// Student is now just an alias for User for better semantics
export type Student = User;

// ===== Class/Group Types =====
export type Class = {
  _id: string;
  naam: string;
  studenten?: Student[];
};

// ===== Task Types =====
export type Task = {
  _id: string;
  titel: string;
  type: string;
  deadline: string;
  weging: number;
  maxScore: number;
  isGepubliceerd?: boolean;
  inzendingen: Array<{
    _id: string;
    gradering: {
      score: number;
      feedback?: string | undefined;
    };
  }>;
  klasgroep: {
    _id: string;
    naam: string;
  };
};

export interface TaskDetail extends Omit<Task, "klasgroep" | "inzendingen"> {
  git: string;
  url: string;
  beschrijving: string;
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
        email: string;
      };
    }
  >;
}

export const TaskSubmissionSchema = z.object({
  _id: z.string(),
  git: z.string(),
  live: z.string(),
  beschrijving: z.string(),
  bijlagen: z.array(z.string()),
  gradering: z
    .object({
      _id: z.string(),
      feedback: z.string(),
      score: z.number(),
      maxscore: z.number(),
    })
    .optional(),
});

export type TaskSubmission = z.infer<typeof TaskSubmissionSchema>;

// We'll keep these interfaces for now as they're used across components,
// but they could be moved to their respective component files
export interface TaskSubmissionFormProps {
  isSubmitted: boolean;
  initialSubmission?: TaskSubmission;
  submittedFiles?: string[];
  isDocent?: boolean;
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

export type StudentRow = {
  _id: string;
  lecture: string;
  type: string;
  klas?: string;
  deadline: string;
  status: string;
  hasGradering: boolean;
  gottenPoints: number;
  totalPoints: number;
  feedback: string;
};

export type DeleteItem = {
  type: "task" | "student";
  id: string;
} | null;

// ===== Stagedagboek Types =====
export const EntrySchema = z.object({
  _id: z.string(),
  datum: z.string(),
  voormiddag: z.string(),
  namiddag: z.string(),
  tools: z.string(),
  resultaat: z.string(),
});

export type Entry = z.infer<typeof EntrySchema>;

// Form schema for stagedagboek
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

// Component props that are highly specific to components
// These could be moved to their component files in the future
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
}

export interface StagedagboekViewProps {
  klasId?: string;
  studentId?: string;
  isDocent: boolean;
  title?: string;
}

// ===== UI Component Types =====
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

// ===== Table Component Types =====
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
