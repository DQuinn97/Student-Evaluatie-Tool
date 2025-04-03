export type Student = {
  id: number;
  name: string;
  tasks: Task[];
};

export type Task = {
  id: number;
  lecture: string;
  klas: string;
  type: string;
  deadline: string;
  status: string;
  feedback: string;
  totalPoints: number;
  gottenPoints: number;
};
