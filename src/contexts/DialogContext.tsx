import React, { createContext, useContext, useState } from "react";

interface DialogField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
}

interface DialogState {
  isOpen: boolean;
  title: string;
  description?: string;
  placeholder?: string;
  confirmLabel: string;
  fields?: DialogField[];
  onConfirm: (value: any) => void;
}

interface DialogContextProps {
  dialogState: DialogState | null;
  openDialog: (state: Omit<DialogState, "isOpen">) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  const openDialog = (state: Omit<DialogState, "isOpen">) => {
    setDialogState({ ...state, isOpen: true });
  };

  const closeDialog = () => {
    setDialogState(null);
  };

  return (
    <DialogContext.Provider value={{ dialogState, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};
