import { useState, useEffect } from "react";
import { FileIcon, Loader2, Trash2Icon, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useParams } from "react-router";

interface TaskSubmission {
  url: string;
  githubUrl: string;
  description: string;
}

interface TaskSubmissionFormProps {
  isSubmitted: boolean;
  initialSubmission?: TaskSubmission;
  submittedFiles?: string[];
}

export const TaskSubmissionForm = ({
  isSubmitted,
  initialSubmission,
  submittedFiles,
}: TaskSubmissionFormProps) => {
  const { taakId } = useParams<{ taakId: string }>();
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [submission, setSubmission] = useState<TaskSubmission>({
    url: "",
    githubUrl: "",
    description: "",
  });

  useEffect(() => {
    if (initialSubmission) {
      setSubmission(initialSubmission);
    }
  }, [initialSubmission]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);

    try {
      const newFiles = Array.from(e.target.files);
      const uniqueFiles = newFiles.filter(
        (newFile) =>
          !files.some((existingFile) => existingFile.name === newFile.name) &&
          !submittedFiles?.some(
            (submittedFile) => submittedFile === newFile.name,
          ),
      );

      if (uniqueFiles.length === 0) {
        toast.error("Deze bestanden zijn al geüpload");
        return;
      }

      // Here you would typically upload the files to your server
      // For now, we'll simulate the upload with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFiles([...files, ...uniqueFiles]);
      toast.success(`${uniqueFiles.length} bestand(en) geüpload!`);
    } catch (error) {
      toast.error("Error bij uploaden");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = (fileIndex: number) => {
    setFiles(files.filter((_, index) => index !== fileIndex));
    toast.success("Bestand verwijderd");
  };

  const validateSubmission = () => {
    if (!submission.url.trim()) {
      toast.error("URL is verplicht");
      return false;
    }
    if (!submission.githubUrl.trim()) {
      toast.error("GitHub URL is verplicht");
      return false;
    }
    if (!submission.description.trim()) {
      toast.error("Beschrijving is verplicht");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taakId) return;

    if (!validateSubmission()) {
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("git", submission.githubUrl);
      formData.append("live", submission.url);
      formData.append("beschrijving", submission.description);
      files.forEach((file) => {
        formData.append("bijlagen", file);
      });

      const response = await fetch(
        `http://localhost:3000/api/taken/${taakId}/inzendingen`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit task");
      }

      toast.success("Taak succesvol ingeleverd!");
      window.location.reload(); // Refresh to show updated submission status
    } catch (error) {
      toast.error("Error bij inleveren van de taak");
      console.error("Submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Upload bestanden</h2>
      <div className="grid gap-6">
        <div>
          <Label htmlFor="url">URL *</Label>
          <Input
            id="url"
            placeholder="Voer een URL in"
            value={submission.url}
            onChange={(e) =>
              setSubmission((prev) => ({ ...prev, url: e.target.value }))
            }
            disabled={isSubmitted}
            required
          />
        </div>

        <div>
          <Label htmlFor="github">GitHub project URL *</Label>
          <Input
            id="github"
            placeholder="Voer een GitHub URL in"
            value={submission.githubUrl}
            onChange={(e) =>
              setSubmission((prev) => ({
                ...prev,
                githubUrl: e.target.value,
              }))
            }
            disabled={isSubmitted}
            required
          />
        </div>

        <div>
          <Label>Beschrijving *</Label>
          <Textarea
            placeholder="Voeg extra context toe aan je inzending"
            className="mt-2"
            value={submission.description}
            onChange={(e) =>
              setSubmission((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            disabled={isSubmitted}
            required
          />
        </div>

        <div className="space-y-4">
          <Label>Upload bestanden</Label>
          <div className="grid gap-4">
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              disabled={isSubmitted || uploading}
            />
            {!isSubmitted && (
              <Button type="submit" disabled={submitting || uploading}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inleveren...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Lever in
                  </>
                )}
              </Button>
            )}
          </div>

          {((files && files.length > 0) ||
            (submittedFiles && submittedFiles.length > 0)) && (
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Uploaded files</h3>
              <div className="space-y-2">
                {submittedFiles &&
                  submittedFiles.map((fileName, index) => (
                    <div
                      key={`existing-${index}`}
                      className="text-muted-foreground flex items-center justify-between gap-2 text-sm"
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
                    {!isSubmitted && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleFileDelete(index)}
                        className="h-8 px-2"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};
