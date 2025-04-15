export interface Entry {
  _id: string;
  datum: string;
  voormiddag: string;
  namiddag: string;
  tools: string;
  resultaat: string;
}

export interface StagedagboekViewProps {
  klasId?: string;
  studentId?: string;
  isDocent: boolean;
  title?: string;
}
