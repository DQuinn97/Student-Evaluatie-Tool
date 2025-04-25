import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Label } from "./label";
import { Input } from "./input";
import { QuillEditor } from "./quill-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Switch } from "./switch";
import { useDialog } from "@/contexts/DialogContext";

// Define the field interface for type safety
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "number"
    | "datetime-local"
    | "checkbox";
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
  step?: number;
}

// Direct props-based usage interface
export interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: FormField[];
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: (values: Record<string, any>) => void;
  showCancelButton?: boolean;
}

// Component for direct props-based usage
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  confirmLabel,
  cancelLabel = "Annuleren",
  onConfirm,
  showCancelButton = true,
}: FormDialogProps) {
  const [values, setValues] = React.useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(values);
    onOpenChange(false);
  };

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "textarea":
        return (
          <QuillEditor
            id={field.name}
            required={field.required}
            placeholder={field.placeholder}
            value={values[field.name] || ""}
            onChange={(value) => handleChange(field.name, value)}
          />
        );
      case "select":
        return (
          <Select
            value={values[field.name] || ""}
            onValueChange={(value) => handleChange(field.name, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "checkbox":
        return (
          <Switch
            id={field.name}
            checked={values[field.name] || false}
            onCheckedChange={(checked: boolean) =>
              handleChange(field.name, checked)
            }
          />
        );
      default:
        return (
          <Input
            id={field.name}
            type={field.type}
            required={field.required}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            value={values[field.name] || ""}
            onChange={(e) =>
              handleChange(
                field.name,
                field.type === "number"
                  ? parseFloat(e.target.value)
                  : e.target.value,
              )
            }
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {renderField(field)}
              </div>
            ))}
          </div>
          <DialogFooter>
            {showCancelButton && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </Button>
            )}
            <Button type="submit">{confirmLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Component that uses DialogContext
export const ContextFormDialog = () => {
  const { dialogState, closeDialog } = useDialog();
  const [values, setValues] = React.useState<Record<string, any>>({});

  if (!dialogState?.fields) return null;

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    dialogState.onConfirm(values);
    setValues({});
    closeDialog();
  };

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={() => closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogState.title}</DialogTitle>
          <DialogDescription>{dialogState.description}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirm();
          }}
        >
          <div className="space-y-4 py-4">
            {dialogState.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <QuillEditor
                    id={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={values[field.name] || ""}
                    onChange={(value) => handleChange(field.name, value)}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={values[field.name] || ""}
                    onValueChange={(value) => handleChange(field.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option: any) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "checkbox" ? (
                  <Switch
                    id={field.name}
                    checked={values[field.name] || false}
                    onCheckedChange={(checked) =>
                      handleChange(field.name, checked)
                    }
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={values[field.name] || ""}
                    onChange={(e) =>
                      handleChange(
                        field.name,
                        field.type === "number"
                          ? parseFloat(e.target.value)
                          : e.target.value,
                      )
                    }
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => closeDialog()}
              type="button"
            >
              Annuleren
            </Button>
            <Button type="submit">{dialogState.confirmLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
