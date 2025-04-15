export type Task = {
  _id: string;
  titel: string;
  type: string;
  deadline: string;
  weging: number;
  inzendingen: Array<{
    _id: string;
    gradering: {
      score: number;
      maxscore: number;
    };
  }>;
  klasgroep: {
    _id: string;
    naam: string;
  };
};

export type Student = {
  _id: string;
  naam: string;
  achternaam: string;
  email: string;
  foto?: string;
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
