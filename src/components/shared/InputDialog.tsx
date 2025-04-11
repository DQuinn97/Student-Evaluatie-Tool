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
import { useDialog } from "@/contexts/DialogContext";

export const InputDialog = () => {
  const { dialogState, closeDialog } = useDialog();
  const [value, setValue] = useState("");

  if (!dialogState) return null;

  const handleConfirm = () => {
    dialogState.onConfirm(value);
    setValue("");
    closeDialog();
  };

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={() => closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogState.title}</DialogTitle>
          <DialogDescription>{dialogState.description}</DialogDescription>
        </DialogHeader>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={dialogState.placeholder}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => closeDialog()}>
            Annuleren
          </Button>
          <Button onClick={handleConfirm}>{dialogState.confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
