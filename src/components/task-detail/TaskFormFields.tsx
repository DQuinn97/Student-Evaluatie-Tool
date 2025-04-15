import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { nl } from "date-fns/locale";

// Titel veld component
export const TitleField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <Label htmlFor="titel">Titel *</Label>
    <Input
      id="titel"
      placeholder="Voer een titel in"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
    />
  </div>
);

// Type veld component
export const TypeField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <Label htmlFor="type">Type</Label>
    <select
      id="type"
      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="taak">Taak</option>
      <option value="test">Test</option>
    </select>
  </div>
);

// Beschrijving veld component
export const DescriptionField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <Label htmlFor="beschrijving">Beschrijving *</Label>
    <Textarea
      id="beschrijving"
      placeholder="Beschrijf de taak"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-32"
      required
    />
  </div>
);

// Deadline veld component
export const DeadlineField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <Label htmlFor="deadline">Deadline *</Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(new Date(value), "PPP HH:mm", {
              locale: nl,
            })
          ) : (
            <span>Selecteer een datum en tijd</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => {
            if (date) {
              const now = new Date();
              date.setHours(now.getHours(), now.getMinutes());
              onChange(date.toISOString());
            }
          }}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
          initialFocus
        />
        <div className="border-border border-t p-3">
          <Label htmlFor="deadline-time">Tijd</Label>
          <Input
            id="deadline-time"
            type="time"
            value={value ? format(new Date(value), "HH:mm") : ""}
            onChange={(e) => {
              if (value) {
                const date = new Date(value);
                const [hours, minutes] = e.target.value.split(":");
                date.setHours(parseInt(hours || "0"), parseInt(minutes || "0"));
                onChange(date.toISOString());
              }
            }}
            className="mt-1"
          />
        </div>
      </PopoverContent>
    </Popover>
  </div>
);

// Weging veld component
export const ScoreField = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <div>
    <Label htmlFor="weging">Maximale score</Label>
    <Input
      id="weging"
      type="number"
      min="0"
      max="1"
      step="0.1"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      required
    />
  </div>
);

// Vak veld component
export const SubjectField = ({
  value,
  onChange,
  subjects,
}: {
  value: string;
  onChange: (value: string) => void;
  subjects: Array<{ _id: string; naam: string }>;
}) => (
  <div>
    <Label htmlFor="vak">Vak</Label>
    <select
      id="vak"
      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Selecteer een vak</option>
      {subjects.map((subject) => (
        <option key={subject._id} value={subject._id}>
          {subject.naam}
        </option>
      ))}
    </select>
  </div>
);

// Bijlagen veld component
export const AttachmentsField = ({
  onChange,
}: {
  onChange: (files: File[]) => void;
}) => (
  <div>
    <Label htmlFor="bijlagen">Bijlagen</Label>
    <input
      id="bijlagen"
      type="file"
      multiple
      onChange={(e) => onChange(Array.from(e.target.files || []))}
      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    />
  </div>
);

// Publiceren veld component
export const PublishField = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) => (
  <div className="flex items-center gap-2">
    <input
      id="isGepubliceerd"
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4"
    />
    <Label htmlFor="isGepubliceerd">Direct publiceren</Label>
  </div>
);
