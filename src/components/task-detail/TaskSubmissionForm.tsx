import { useState, useEffect } from "react";
import { FileIcon, Loader2, Trash2Icon, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { TaskSubmission } from "@/data/mockStudents";

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
  const [uploading, setUploading] = useState(false);
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

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFiles([...files, ...uniqueFiles]);
      toast.success(`${uniqueFiles.length} bestand(en) geüpload!`);
    } catch (error) {
      toast.error("Error bij uploaden");
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = (fileIndex: number) => {
    setFiles(files.filter((_, index) => index !== fileIndex));
    toast.success("Bestand verwijderd");
  };

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Upload bestanden</h2>
      <div className="grid gap-6">
        <div>
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            placeholder="Voer een URL in"
            value={submission.url}
            onChange={(e) =>
              setSubmission((prev) => ({ ...prev, url: e.target.value }))
            }
            disabled={isSubmitted}
          />
        </div>

        <div>
          <Label htmlFor="github">GitHub project URL</Label>
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
          />
        </div>

        <div>
          <Label>Optionele beschrijving</Label>
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
            <Button disabled={isSubmitted || uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
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
                        variant="destructive"
                        size="sm"
                        onClick={() => handleFileDelete(index)}
                        className="h-8 px-2"
                      >
                        <Trash2Icon />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
