import {
  Table as ReactTable,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
} from "@tanstack/react-table";

export type Student = {
  id: number;
  name: string;
  taakId: string;
  lecture: string;
  klas: string;
  type: string;
  deadline: string;
  status: string;
  feedback: string;
  totalPoints: number;
  gottenPoints: number;
  hasGradering: boolean;
  tasks: Task[];
};

export type Task = {
  taakId: string;
  lecture: string;
  klas: string;
  type: string;
  deadline: string;
  status: string;
  feedback: string;
  totalPoints: number;
  gottenPoints: number;
};

export interface TaskDetail {
  _id: string;
  type: string;
  titel: string;
  beschrijving: string;
  deadline: string;
  weging: number;
  isGepubliceerd: boolean;
  klasgroep: {
    _id: string;
    naam: string;
  };
  vak?: {
    _id: string;
    naam: string;
  };
  inzendingen: TaskSubmission[];
}

export interface TaskSubmission {
  _id: string;
  gitUrl: string;
  liveUrl: string;
  beschrijving: string;
  bijlagen: string[];
  gradering?: Array<{
    feedback: string;
    score: number;
  }>;
}

export interface TaskSubmissionFormProps {
  isSubmitted: boolean;
  initialSubmission?: TaskSubmission;
  submittedFiles?: string[];
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
