import { useState, useEffect } from "react";
import api from "@/api";
import { Student } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassSelector } from "../shared/ClassSelector";
import { getSelectedClass } from "@/lib/classStorage";

interface StudentWithResults extends Student {
  results?: {
    taskId: string;
    taskTitle: string;
    score?: number;
    maxScore: number;
    type: string;
    submissionDate?: string;
  }[];
  averageScore?: number;
}

interface StudentResult {
  taskId: string;
  taskTitle: string;
  score?: number;
  maxScore: number;
  type: string;
  submissionDate?: string;
}

export const StudentResultsAccordion = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentWithResults[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch classes when component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/klassen");
        setClasses(data);

        // Get saved class from localStorage
        const savedClassId = getSelectedClass();

        // Check if saved class exists in the returned classes
        const classExists = data.some((c: any) => c._id === savedClassId);

        if (savedClassId && classExists) {
          setSelectedClass(savedClassId);
        } else if (data.length > 0) {
          setSelectedClass(data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students and their results when selected class changes
  useEffect(() => {
    const fetchStudentsWithResults = async () => {
      if (!selectedClass) return;

      try {
        setIsLoading(true);

        // Get class data with students
        const { data: classData } = await api.get(`/klassen/${selectedClass}`);

        // Filter out docents, keep only students
        const studentsInClass = (classData.studenten || []).filter(
          (student: Student) => !student.isDocent,
        );

        // Get tasks for this class
        const { data: tasks } = await api.get(
          `/klassen/${selectedClass}/taken`,
        );

        // For each student, fetch their results
        const studentsWithResults = await Promise.all(
          studentsInClass.map(async (student: Student) => {
            try {
              // Optional: You could fetch individual student data from the dump endpoint for more details
              // const { data: studentDump } = await api.get(`/klassen/${selectedClass}/studenten/${student._id}/dump`);

              // Get student's results from task submissions
              const studentResults = tasks
                .filter(
                  (task: any) =>
                    task.inzendingen && task.inzendingen.length > 0,
                )
                .flatMap((task: any) => {
                  const studentSubmission = task.inzendingen.find(
                    (submission: any) =>
                      submission.student?._id === student._id,
                  );

                  if (studentSubmission && studentSubmission.gradering) {
                    return [
                      {
                        taskId: task._id,
                        taskTitle: task.titel,
                        score: studentSubmission.gradering.score,
                        maxScore: task.maxScore || 100,
                        type: task.type,
                        submissionDate: studentSubmission.inzending,
                      },
                    ];
                  }
                  return [];
                });

              // Calculate average score
              const totalScores = studentResults.reduce(
                (sum: number, result: StudentResult) => {
                  if (result.score !== undefined) {
                    return sum + (result.score / result.maxScore) * 100;
                  }
                  return sum;
                },
                0,
              );

              const averageScore =
                studentResults.length > 0
                  ? totalScores / studentResults.length
                  : undefined;

              return {
                ...student,
                results: studentResults,
                averageScore,
              };
            } catch (error) {
              console.error(
                `Error fetching results for student ${student._id}:`,
                error,
              );
              return student;
            }
          }),
        );

        setStudents(studentsWithResults);
      } catch (error) {
        console.error("Error fetching students and results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentsWithResults();
  }, [selectedClass]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Klasoverzicht Studenten</h1>

      <div className="mb-6">
        <ClassSelector
          classes={classes}
          selectedClass={selectedClass}
          onSelectClass={setSelectedClass}
          isLoading={isLoading}
          label="Selecteer een klas"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : students.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center">
          Geen studenten gevonden in deze klas.
        </p>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {students.map((student) => (
            <AccordionItem
              value={student._id}
              key={student._id}
              className="overflow-hidden rounded-lg border"
            >
              <AccordionTrigger className="bg-card px-4 py-3 hover:no-underline">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={student.foto} />
                      <AvatarFallback>
                        {student.naam?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium">
                        {student.naam} {student.achternaam}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {student.email}
                      </p>
                    </div>
                  </div>
                  {student.averageScore !== undefined && (
                    <div className="flex items-center gap-2">
                      <Progress
                        value={student.averageScore}
                        className="h-2 w-24"
                      />
                      <span className="text-sm font-medium">
                        {student.averageScore.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <Separator className="my-2" />

                {student.results && student.results.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="mt-2 text-lg font-medium">Resultaten</h3>
                    <div className="space-y-2">
                      {student.results.map((result) => (
                        <div
                          key={result.taskId}
                          className="bg-muted/50 flex items-center justify-between rounded p-2"
                        >
                          <div>
                            <p className="font-medium">{result.taskTitle}</p>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  result.type === "taak"
                                    ? "outline"
                                    : "secondary"
                                }
                              >
                                {result.type === "taak" ? "Taak" : "Test"}
                              </Badge>
                              {result.submissionDate && (
                                <span className="text-muted-foreground text-xs">
                                  Ingediend:{" "}
                                  {new Date(
                                    result.submissionDate,
                                  ).toLocaleDateString("nl-NL")}
                                </span>
                              )}
                            </div>
                          </div>
                          {result.score !== undefined && (
                            <div className="flex items-center gap-2">
                              <Progress
                                value={(result.score / result.maxScore) * 100}
                                className="h-2 w-24"
                              />
                              <span className="text-sm font-medium">
                                {result.score}/{result.maxScore}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4 text-center">
                    Geen resultaten beschikbaar voor deze student.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};
