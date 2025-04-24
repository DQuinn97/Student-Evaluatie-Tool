import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

// Type for a single metric card
export interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  value: string | ReactNode;
  subtitle?: string | ReactNode;
  badgeVariant?:
    | "default"
    | "secondary"
    | "destructive"
    | "success"
    | "outline";
  badgeText?: string;
}

// Type for the entire metrics section
export interface MetricCardsProps {
  metrics: MetricCardProps[];
  className?: string;
}

export const MetricCards = ({ metrics, className }: MetricCardsProps) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "my-4 grid grid-cols-3 gap-2 px-2 md:my-6 md:gap-4 md:px-6",
        className,
      )}
    >
      {metrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <Card key={index} className="w-full">
            <CardHeader
              className={`flex flex-col items-center gap-1 ${isMobile ? "px-2" : "gap-3"}`}
            >
              <Icon size={isMobile ? 16 : 20} />
              <CardTitle
                className={isMobile ? "text-center text-xs" : "text-center"}
              >
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent
              className={`text-center font-semibold ${isMobile ? "text-sm" : "text-xl"}`}
            >
              {metric.badgeText ? (
                <Badge variant={metric.badgeVariant || "default"}>
                  {metric.badgeText}
                </Badge>
              ) : (
                <div className="flex flex-col gap-1">
                  <div
                    className={`font-bold ${isMobile ? "text-lg" : "text-2xl"}`}
                  >
                    {metric.value}
                  </div>
                  {metric.subtitle && (
                    <p
                      className={`text-muted-foreground ${isMobile ? "text-xs" : "text-sm"}`}
                    >
                      {metric.subtitle}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
