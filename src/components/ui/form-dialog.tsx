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
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Switch } from "@/components/ui/switch";

interface FormField {
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

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: FormField[];
  confirmLabel: string;
  onConfirm: (values: Record<string, any>) => void;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  confirmLabel,
  onConfirm,
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
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={values[field.name] || ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
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
                      {field.options?.map((option) => (
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
                    onCheckedChange={(checked: boolean) =>
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
            <Button type="submit">{confirmLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
