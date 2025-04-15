import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Student } from "@/types";
import api from "@/api";

type StudentSelectDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (studentId: string) => void;
};

export const StudentSelectDialog = ({
  open,
  onClose,
  onSelect,
}: StudentSelectDialogProps) => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (value: string) => {
    setSearch(value);
    if (value.length < 2) return;

    try {
      setIsLoading(true);
      const { data } = await api.get(`/studenten?zoek=${value}`);
      setStudents(data);
    } catch (error) {
      console.error("Error searching students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Student Selecteren</DialogTitle>
          <DialogDescription>
            Zoek en selecteer een student om toe te voegen aan de klas
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Zoek op naam of email..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <ScrollArea className="h-[200px]">
          {isLoading ? (
            <div className="text-muted-foreground p-4 text-center">
              Zoeken...
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((student) => (
                <Button
                  key={student._id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onSelect(student._id)}
                >
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage src={student.foto} />
                    <AvatarFallback>{student.naam?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div>
                      {student.naam} {student.achternaam}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {student.email}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
