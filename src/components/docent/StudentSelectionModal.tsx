import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type User = {
  _id: string;
  naam: string;
  achternaam: string;
  email: string;
  isDocent?: boolean;
};

interface StudentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedStudents: string[]) => void;
  currentStudentIds: string[];
}

export const StudentSelectionModal = ({
  isOpen,
  onClose,
  onConfirm,
  currentStudentIds,
}: StudentSelectionModalProps) => {
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchStudents();
    }
  }, [isOpen]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/gebruikers");
      let usersData = response.data;

      // If we got a single user object, wrap it in an array
      if (usersData && !Array.isArray(usersData) && usersData._id) {
        console.log(
          "Single user response detected, wrapping in array:",
          usersData,
        );
        usersData = [usersData];
      }
      // If we still don't have an array, try different approaches
      else if (!Array.isArray(usersData)) {
        console.error("Unexpected API response structure:", usersData);

        // Check if it's wrapped in another property
        if (usersData && typeof usersData === "object") {
          // Try to get users from a property in the response
          const possibleArrays = Object.values(usersData).filter((val) =>
            Array.isArray(val),
          );
          if (possibleArrays.length > 0) {
            usersData = possibleArrays[0]; // Use the first array found
          }
        }

        if (!Array.isArray(usersData)) {
          setStudents([]);
          toast.error("Kon geen studentenlijst ophalen. Probeer het opnieuw.");
          return;
        }
      }

      // Now filter the array
      const filteredStudents = usersData.filter(
        (student: User) =>
          !student.isDocent && !currentStudentIds.includes(student._id),
      );

      setStudents(filteredStudents);

      if (filteredStudents.length === 0 && usersData.length > 0) {
        toast.info(
          "Alle beschikbare studenten zijn al toegevoegd aan deze klas.",
        );
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Er is een fout opgetreden bij het ophalen van de studenten");
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((studentId) => studentId !== id)
        : [...prev, id],
    );
  };

  const handleConfirm = () => {
    onConfirm(selectedStudents);
    setSelectedStudents([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Studenten Toevoegen</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-4">
          Selecteer de studenten die je wilt toevoegen aan deze klas.
        </DialogDescription>

        {isLoading ? (
          <p className="py-4 text-center">Studenten laden...</p>
        ) : students.length === 0 ? (
          <p className="py-4 text-center">
            Geen studenten beschikbaar om toe te voegen
          </p>
        ) : (
          <ScrollArea className="h-[250px] pr-4" type="always">
            <div className="space-y-2 py-2">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="mb-2 flex items-center space-x-2 rounded-md border p-2"
                >
                  <Checkbox
                    id={student._id}
                    checked={selectedStudents.includes(student._id)}
                    onCheckedChange={() => handleToggleStudent(student._id)}
                  />
                  <label
                    htmlFor={student._id}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    <span className="font-bold">
                      {student.naam} {student.achternaam}
                    </span>{" "}
                    ({student.email})
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Annuleren
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedStudents.length === 0 || isLoading}
          >
            <Check className="mr-2 h-4 w-4" />
            Toevoegen ({selectedStudents.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
