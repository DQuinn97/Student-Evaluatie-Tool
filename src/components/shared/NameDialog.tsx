import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import api from "../../api";

interface NameDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userData: any;
  onUserDataUpdate: (updatedData: any) => void;
  initialFirstName?: string;
  initialLastName?: string;
}

export const NameDialog = ({
  isOpen,
  onOpenChange,
  userData,
  onUserDataUpdate,
  initialFirstName = "",
  initialLastName = "",
}: NameDialogProps) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const handleUpdateName = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Vul zowel je voornaam als achternaam in.");
      return;
    }

    setIsUpdatingName(true);
    try {
      const response = await api.patch("/profiel", {
        naam: firstName,
        achternaam: lastName,
      });

      if (response.status === 200) {
        toast.success("Naam succesvol bijgewerkt");
        // Update the user data via the callback
        onUserDataUpdate({
          ...userData,
          naam: firstName,
          achternaam: lastName,
        });
        onOpenChange(false);
      } else {
        toast.error("Er is een fout opgetreden bij het bijwerken van je naam");
      }
    } catch (error) {
      toast.error("Er is een fout opgetreden bij het bijwerken van je naam");
      console.error("Error updating name:", error);
    } finally {
      setIsUpdatingName(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Naam instellen</DialogTitle>
          <DialogDescription>
            Vul je voor- en achternaam in om door te gaan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              Voornaam
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Achternaam
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleUpdateName}
            disabled={isUpdatingName || !firstName.trim() || !lastName.trim()}
          >
            {isUpdatingName ? "Bijwerken..." : "Opslaan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
