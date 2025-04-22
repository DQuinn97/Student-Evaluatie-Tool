import { Button } from "./ui/button";
import { Link } from "react-router";
import { Separator } from "./ui/separator";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { CropperRef } from "react-advanced-cropper";
import { useProfile } from "../hooks/useProfile";
import { ProfileImage } from "./profile/ProfileImage";
import { ProfileForm } from "./profile/ProfileForm";
import { ImageCropper } from "./profile/ImageCropper";
import { useIsMobile } from "@/hooks/use-mobile";

const Profile = () => {
  const { formData, setFormData, setSelectedFile, saveProfile, loading } =
    useProfile();
  const [showId, setShowId] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImage, setCropperImage] = useState("");
  const cropperRef = useRef<CropperRef>(null);
  const isMobile = useIsMobile();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Bestand is te groot. Maximum grootte is 5MB");
      return;
    }

    // Create a preview URL for the selected image and show cropper
    const previewUrl = URL.createObjectURL(file);
    setCropperImage(previewUrl);
    setShowCropper(true);
  };

  const handleCropComplete = () => {
    if (!cropperRef.current) return;

    const canvas = cropperRef.current.getCanvas();
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const croppedFile = new File([blob], "profile-picture.jpg", {
          type: "image/jpeg",
        });
        setSelectedFile(croppedFile);

        const previewUrl = URL.createObjectURL(blob);
        setFormData((prev) => ({ ...prev, foto: previewUrl }));

        setShowCropper(false);
      },
      "image/jpeg",
      0.95,
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await saveProfile();
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (formData.foto && formData.foto.startsWith("blob:")) {
        URL.revokeObjectURL(formData.foto);
      }
      if (cropperImage && cropperImage.startsWith("blob:")) {
        URL.revokeObjectURL(cropperImage);
      }
    };
  }, [formData.foto, cropperImage]);

  return (
    <div className="grid place-items-center px-4">
      <h1 className="mb-4 text-2xl font-bold">Profiel</h1>

      <div
        className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full max-w-3xl gap-10`}
      >
        <ProfileImage
          formData={formData}
          showId={showId}
          setShowId={setShowId}
          onImageChange={handleImageChange}
        />

        <ProfileForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>

      <ImageCropper
        showCropper={showCropper}
        setShowCropper={setShowCropper}
        cropperImage={cropperImage}
        onCropComplete={handleCropComplete}
        cropperRef={cropperRef}
      />

      <Separator className="bg-accent m-10 w-full max-w-3xl" />
      <Button>
        <Link to="/reset-password">Verander Wachtwoord</Link>
      </Button>
    </div>
  );
};

export default Profile;
