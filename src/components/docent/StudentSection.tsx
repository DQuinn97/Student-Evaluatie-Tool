import { Button } from "@/components/ui/button";
import { Plus, Trash, BookText } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { DataTable } from "../shared/DataTable";
import { useTableConfig } from "@/hooks/useTableConfig";
import { Student, StudentSectionProps } from "@/types";
import { Row } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import { useState } from "react";
import { StudentSelectionModal } from "./StudentSelectionModal";

export const StudentSection = ({
  students,
  isLoading,
  onAddStudent,
  onDeleteStudent,
  selectedClass,
}: StudentSectionProps) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const studentColumns = [
    {
      accessorKey: "naam",
      header: "Naam",
      cell: ({ row }: { row: Row<Student> }) => {
        const student = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={student.foto} />
              <AvatarFallback>
                {student.naam?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {student.naam} {student.achternaam}
              </div>
              <div className="text-muted-foreground text-sm">
                {student.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: Row<Student> }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (selectedClass) {
                navigate(
                  `/klassen/${selectedClass}/studenten/${row.original._id}/dagboek`,
                );
              }
            }}
            title="Bekijk stagedagboek"
          >
            <BookText className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" title="Verwijder student">
                <Trash className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Bevestig Verwijderen</AlertDialogTitle>
                <AlertDialogDescription>
                  Weet je zeker dat je deze student wilt verwijderen uit de
                  klas?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDeleteStudent(row.original._id)}
                >
                  Verwijderen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  const table = useTableConfig({
    data: students,
    columns: studentColumns,
    pageSize: 10,
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AccordionItem value="students">
      <div className="flex items-center justify-between border-b">
        <AccordionTrigger className="flex-1 hover:no-underline">
          <h3 className="text-xl font-semibold">Studenten</h3>
        </AccordionTrigger>
        <Button
          onClick={handleOpenModal}
          disabled={!selectedClass || isLoading}
          className="m-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Student Toevoegen
        </Button>
      </div>
      <AccordionContent>
        {isLoading ? (
          <div className="text-muted-foreground">Laden...</div>
        ) : (
          <DataTable
            table={table}
            filterColumn="naam"
            filterPlaceholder="Zoek studenten..."
            showRowSelection={false}
            emptyMessage="Geen studenten gevonden."
          />
        )}
      </AccordionContent>

      {/* Student Selection Modal */}
      <StudentSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={onAddStudent}
        currentStudentIds={students.map((student) => student._id)}
      />
    </AccordionItem>
  );
};
