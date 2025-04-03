export const mockLectures = [
  "Introduction to Programming",
  "Advanced Topics in Programming",
  "Final Project in Programming",
  "Exam in Programming",
  "Assignment in Programming",
  "Quiz in Programming",
  "Presentation in Programming",
  "Research Paper in Programming",
];

export const mockClasses = ["React", "Angular", "Vue", "Svelte"];
export const mockTaskTypes = ["taak", "toets"];
export const mockStatuses = ["Bezig", "Te laat", "Ingeleverd"];

export interface TaskSubmission {
  url?: string;
  githubUrl?: string;
  description?: string;
  files?: string[];
}

export const generateMockTask = (studentName: string) => {
  const status = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
  const totalPoints = Math.floor(Math.random() * 20) + 1;

  return {
    id: Math.floor(Math.random() * 50) + 1,
    lecture: mockLectures[Math.floor(Math.random() * mockLectures.length)],
    klas: mockClasses[Math.floor(Math.random() * mockClasses.length)],
    type: mockTaskTypes[Math.floor(Math.random() * mockTaskTypes.length)],
    deadline: new Date(
      Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365),
    )
      .toISOString()
      .split("T")[0],
    status: status,
    gottenPoints:
      status === "Te laat" ? 0 : Math.floor(Math.random() * totalPoints),
    totalPoints: totalPoints,
    feedback: Math.random() > 0.5 ? `Goed gedaan, ${studentName}!` : "",
    submission:
      Math.random() > 0.7
        ? {
            url: "https://example.com/project",
            githubUrl: "https://github.com/student/project",
            description: "Dit is mijn project inzending",
            files: ["project.pdf", "presentation.pptx"],
          }
        : undefined,
  };
};

export const mockStudents = [
  {
    id: 1,
    name: "John Doe",
    tasks: Array.from({ length: 50 }).map(() => generateMockTask("John")),
  },
  {
    id: 2,
    name: "Jane Doe",
    tasks: Array.from({ length: 50 }).map(() => generateMockTask("Jane")),
  },
];
