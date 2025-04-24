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
  const [error, setError] = useState(false);

  if (!dialogState) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value) {
      setError(false);
    }
  };

  const handleConfirm = () => {
    if (!value.trim()) {
      setError(true);
      return;
    }

    dialogState.onConfirm(value);
    setValue("");
    setError(false);
    closeDialog();
  };

  return (
    <Dialog
      open={dialogState.isOpen}
      onOpenChange={(open) => {
        if (!open) closeDialog();
      }}
    >
      <DialogContent
        onEscapeKeyDown={() => closeDialog()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{dialogState.title}</DialogTitle>
          <DialogDescription>{dialogState.description}</DialogDescription>
        </DialogHeader>
        <Input
          value={value}
          onChange={handleChange}
          placeholder={dialogState.placeholder}
        />
        {error && (
          <p className="text-sm text-red-500">Dit veld is verplicht.</p>
        )}
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
