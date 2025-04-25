import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import api from "@/api";
import { Student, Class } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { BookText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClassSelector } from "../shared/ClassSelector";
import { getSelectedClass } from "@/lib/classStorage";

interface StudentWithStageInfo extends Student {
  hasStagedagboek?: boolean;
  entryCount?: number;
}

export const AllStagedagboekenView = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentWithStageInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch all classes when component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/klassen");
        setClasses(data);

        // Get saved class from localStorage
        const savedClassId = getSelectedClass();

        // Check if saved class exists in the returned classes
        const classExists = data.some((c: Class) => c._id === savedClassId);

        if (savedClassId && classExists) {
          setSelectedClass(savedClassId);
        } else if (data.length > 0) {
          setSelectedClass(data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Er is een fout opgetreden bij het ophalen van de klassen");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Fetch students for selected class
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) return;

      try {
        setIsLoading(true);
        const { data } = await api.get(`/klassen/${selectedClass}`);

        // Get stagedagboek info for each student
        const studentsWithStageInfo = await Promise.all(
          // Filter eerst docenten uit de lijst van studenten
          (data.studenten || [])
            .filter((student: Student) => !student.isDocent)
            .map(async (student: Student) => {
              try {
                const { data: dagboek } = await api.get(
                  `/dagboek/${selectedClass}/${student._id}`,
                );

                // Check if the stagedagboek has any entries and count them
                const entryCount = dagboek?.stagedagen?.length || 0;
                const hasStagedagboek = entryCount > 0;

                return {
                  ...student,
                  hasStagedagboek,
                  entryCount,
                };
              } catch (error) {
                // If the API returns an error (likely 404), the student has no stagedagboek
                return {
                  ...student,
                  hasStagedagboek: false,
                  entryCount: 0,
                };
              }
            }),
        );

        setStudents(studentsWithStageInfo);
      } catch (error) {
        console.error("Error fetching students:", error);
        toast.error(
          "Er is een fout opgetreden bij het ophalen van de studenten",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  // Navigate to student's stagedagboek
  const viewStagedagboek = (student: StudentWithStageInfo) => {
    if (!selectedClass) return;

    if (!student.hasStagedagboek) {
      toast.error(
        `${student.naam} ${student.achternaam} heeft nog geen stagedagboek ingaves.`,
      );
      return;
    }

    navigate(`/klassen/${selectedClass}/studenten/${student._id}/dagboek`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold">Stagedagboeken Overzicht</h1>

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
        <p className="text-muted-foreground">Laden...</p>
      ) : students.length === 0 ? (
        <p className="text-muted-foreground">
          Geen studenten gevonden in deze klas.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card
              key={student._id}
              className={`overflow-hidden ${!student.hasStagedagboek ? "border-muted" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={student.foto} />
                    <AvatarFallback>
                      {student.naam?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>
                      {student.naam} {student.achternaam}
                    </CardTitle>
                    <CardDescription>{student.email}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardFooter>
                <Button
                  variant={student.hasStagedagboek ? "default" : "outline"}
                  className="w-full"
                  onClick={() => viewStagedagboek(student)}
                  disabled={!student.hasStagedagboek}
                >
                  <BookText className="mr-2 h-4 w-4" />
                  {student.hasStagedagboek
                    ? `Bekijk ${student.entryCount} ${student.entryCount === 1 ? "stagedagboek" : "stagedagboeken"}`
                    : "Geen stagedagboek ingaves"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllStagedagboekenView;
