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

export const generateMockTask = (studentName: string) => ({
  id: Math.floor(Math.random() * 10000000000),
  lecture: mockLectures[Math.floor(Math.random() * mockLectures.length)],
  klas: mockClasses[Math.floor(Math.random() * mockClasses.length)],
  type: mockTaskTypes[Math.floor(Math.random() * mockTaskTypes.length)],
  deadline: new Date(
    Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365)
  ).toISOString().split("T")[0],
  status: mockStatuses[Math.floor(Math.random() * mockStatuses.length)],
  gottenPoints: Math.floor(Math.random() * 20),
  totalPoints: Math.floor(Math.random() * 20) + 1,
  feedback: Math.random() > 0.5 ? `Goed gedaan, ${studentName}!` : "",
});

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