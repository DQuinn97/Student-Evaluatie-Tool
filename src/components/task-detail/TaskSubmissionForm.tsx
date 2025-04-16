import { useState } from "react";
import { FileIcon, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useParams } from "react-router";
import { TaskSubmission, TaskSubmissionFormProps } from "@/types";
import api from "../../api";

export const TaskSubmissionForm = ({
  isSubmitted,
  initialSubmission,
  submittedFiles,
  isDocent = false,
}: TaskSubmissionFormProps & { isDocent?: boolean }) => {
  const { taakId } = useParams<{ taakId: string }>();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [submission, setSubmission] = useState<TaskSubmission>(() => ({
    _id: initialSubmission?._id || "",
    live: initialSubmission?.live || "",
    git: initialSubmission?.git || "",
    beschrijving: initialSubmission?.beschrijving || "",
    bijlagen: initialSubmission?.bijlagen || [],
  }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSubmitted && !isDocent) {
      try {
        setSubmitting(true);

        // First upload files if any
        if (files.length > 0) {
          setUploading(true);
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("bijlagen", file);
          });

          // Upload files first
          // const { data: uploadedFiles } = await api.post("/upload", formData);
          // submission.bijlagen = uploadedFiles;
          setUploading(false);
        }

        // Then submit the task
        await api.post(`/taken/${taakId}/inzendingen`, submission);
        toast.success("Taak succesvol ingeleverd!");
        window.location.reload();
      } catch (error) {
        console.error("Error submitting task:", error);
        toast.error("Er is een fout opgetreden bij het inleveren van de taak");
      } finally {
        setSubmitting(false);
        setUploading(false);
      }
    }
  };

  const handleFileDelete = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="live">URL</Label>
          <Input
            id="live"
            placeholder="Voer een URL in"
            defaultValue={submission.live || ""}
            onChange={(e) =>
              setSubmission((prev) => ({ ...prev, live: e.target.value }))
            }
            disabled={isSubmitted || isDocent}
            required
          />
        </div>

        <div>
          <Label htmlFor="git">GitHub project URL</Label>
          <Input
            id="git"
            placeholder="Voer een GitHub URL in"
            defaultValue={submission.git || ""}
            onChange={(e) =>
              setSubmission((prev) => ({ ...prev, git: e.target.value }))
            }
            disabled={isSubmitted || isDocent}
            required
          />
        </div>

        <div>
          <Label>Beschrijving</Label>
          <Textarea
            placeholder="Voeg extra context toe aan je inzending"
            className="mt-2"
            defaultValue={submission.beschrijving || ""}
            onChange={(e) =>
              setSubmission((prev) => ({
                ...prev,
                beschrijving: e.target.value,
              }))
            }
            disabled={isSubmitted || isDocent}
            required
          />
        </div>

        <div>
          {!isSubmitted && !isDocent && (
            <div className="mt-2">
              <Label>Bijlagen</Label>
              <input
                type="file"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setFiles(Array.from(e.target.files));
                  }
                }}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Bestanden toevoegen
                </Button>
              </label>
            </div>
          )}

          {((submittedFiles || []).length > 0 || files.length > 0) && (
            <div className="mt-4">
              <h3 className="mb-2 font-medium">Geüploade bestanden</h3>
              <div className="space-y-2">
                {submittedFiles &&
                  submittedFiles.map((fileName, index) => (
                    <div
                      key={`existing-${index}`}
                      className="text-muted-foreground flex items-center gap-2 text-sm"
                    >
                      <FileIcon className="h-4 w-4" />
                      {fileName}
                    </div>
                  ))}
                {files.map((file, index) => (
                  <div
                    key={`new-${index}`}
                    className="text-muted-foreground flex items-center justify-between gap-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-4 w-4" />
                      {file.name}
                    </div>
                    {!isSubmitted && !isDocent && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleFileDelete(index)}
                        className="h-8 px-2"
                      >
                        Verwijderen
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!isSubmitted && !isDocent && (
        <Button
          type="submit"
          className="w-full"
          disabled={submitting || uploading}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Inleveren...
            </>
          ) : (
            "Taak inleveren"
          )}
        </Button>
      )}
    </form>
  );
};
