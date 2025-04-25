import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface QuillEditorProps
  extends Omit<React.ComponentProps<typeof ReactQuill>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  minHeight?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  defaultValue?: string;
}

function QuillEditor({
  value = "",
  onChange,
  className,
  placeholder = "Voer tekst in...",
  minHeight = "200px",
  required,
  disabled,
  id,
  defaultValue,
  ...props
}: QuillEditorProps) {
  const [editorValue, setEditorValue] = useState(value || defaultValue || "");

  useEffect(() => {
    if (value !== undefined) {
      setEditorValue(value);
    } else if (defaultValue !== undefined && editorValue === "") {
      setEditorValue(defaultValue);
    }
  }, [value, defaultValue]);

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange?.(content);
  };

  return (
    <ReactQuill
      id={id}
      theme="snow"
      value={editorValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={cn(
        "mt-1 mb-12",
        disabled ? "pointer-events-none opacity-50" : "",
        className,
      )}
      style={{ minHeight }}
      readOnly={disabled}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      }}
      {...props}
    />
  );
}

export { QuillEditor };
