import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { ProfileData } from "../../types";

type ProfileImageProps = {
  formData: ProfileData;
  showId: boolean;
  setShowId: (show: boolean) => void;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ProfileImage = ({
  formData,
  showId,
  setShowId,
  onImageChange,
}: ProfileImageProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <img
            src={formData.foto}
            alt="Profiel foto"
            className="h-32 w-32 cursor-pointer rounded-full object-cover transition-opacity hover:opacity-90"
            title="Klik om te vergroten"
          />
        </DialogTrigger>
        <DialogContent className="flex items-center justify-center p-1 sm:max-w-md">
          <DialogTitle className="sr-only">Profiel foto</DialogTitle>
          <img
            src={formData.foto}
            alt="Profiel foto"
            className="max-h-[70vh] max-w-full rounded-md object-contain"
            style={{ objectFit: "contain" }}
          />
          <DialogDescription className="sr-only">
            Klik buiten deze afbeelding om te sluiten
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Button
        onClick={() => document.getElementById("image")?.click()}
        className="mt-2"
      >
        Verander
      </Button>
      <input
        type="file"
        accept="image/jpeg, image/png"
        hidden
        id="image"
        onChange={onImageChange}
      />
      <p className="text-muted-foreground mt-2 text-sm">{formData.email}</p>
      <p
        className="text-muted-foreground mt-2 cursor-pointer text-xs"
        onClick={() => setShowId(!showId)}
      >
        ID: {showId ? formData.id : "********** (click to reveal)"}
      </p>
    </div>
  );
};
