import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { CropperRef, Cropper, CircleStencil } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import "react-advanced-cropper/dist/themes/corners.css";

type ImageCropperProps = {
  showCropper: boolean;
  setShowCropper: (show: boolean) => void;
  cropperImage: string;
  onCropComplete: () => void;
  cropperRef: React.RefObject<CropperRef | null>;
};

export const ImageCropper = ({
  showCropper,
  setShowCropper,
  cropperImage,
  onCropComplete,
  cropperRef,
}: ImageCropperProps) => {
  return (
    <Dialog open={showCropper} onOpenChange={setShowCropper}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Afbeelding bijsnijden</DialogTitle>
        <DialogDescription>
          Pas de afbeelding aan voordat je deze opslaat.
        </DialogDescription>
        <div className="h-[300px] w-full">
          {cropperImage && (
            <Cropper
              ref={cropperRef}
              src={cropperImage}
              className="h-full w-full"
              stencilProps={{
                grid: true,
                aspectRatio: 1,
              }}
              stencilComponent={CircleStencil}
            />
          )}
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Annuleren</Button>
          </DialogClose>
          <Button onClick={onCropComplete}>Bijsnijden & opslaan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
