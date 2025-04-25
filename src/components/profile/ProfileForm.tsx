import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ProfileFormProps } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

export const ProfileForm = ({
  formData,
  setFormData,
  onSubmit,
  loading,
}: ProfileFormProps) => {
  const isMobile = useIsMobile();

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div
        className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-x-6 gap-y-2`}
      >
        <div className="flex flex-col">
          <Label className="mt-2">Voornaam</Label>
          <Input
            type="text"
            placeholder="John"
            value={formData.naam}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, naam: e.target.value }))
            }
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <Label className="mt-2">Naam</Label>
          <Input
            type="text"
            placeholder="Doe"
            value={formData.achternaam}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, achternaam: e.target.value }))
            }
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <Label className="mt-2">GSM</Label>
          <Input
            type="tel"
            placeholder="04xxxxxx"
            value={formData.gsm}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gsm: e.target.value }))
            }
            disabled={loading}
          />
        </div>
      </div>

      <Button type="submit" className="mt-6" disabled={loading}>
        {loading ? "Bezig met opslaan..." : "Opslaan"}
      </Button>
    </form>
  );
};
