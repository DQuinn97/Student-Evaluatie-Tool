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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FormDialog = () => {
  const { dialogState, closeDialog } = useDialog();
  const [values, setValues] = useState<Record<string, any>>({});

  if (!dialogState?.fields) return null;

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    dialogState.onConfirm(values);
    setValues({});
    closeDialog();
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            required={field.required}
            placeholder={field.placeholder}
            value={values[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
      case "checkbox":
        return (
          <Checkbox
            checked={values[field.name] || false}
            onCheckedChange={(checked) => handleChange(field.name, checked)}
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
              {field.options?.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type={field.type}
            required={field.required}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            step={field.step}
            value={values[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );
    }
  };

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={() => closeDialog()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogState.title}</DialogTitle>
          <DialogDescription>{dialogState.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {dialogState.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-medium">{field.label}</label>
              {renderField(field)}
            </div>
          ))}
        </div>
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
