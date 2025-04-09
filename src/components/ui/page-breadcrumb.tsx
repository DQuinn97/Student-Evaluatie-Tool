import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { pathLabels } from "@/config/navigation";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface DetailPageInfo {
  segment: string;
  apiPath: string;
  titleField: string;
}

export function PageBreadcrumb({ userName }: { userName: string }) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const [detailTitle, setDetailTitle] = useState<string | null>(null);

  // Define the types of detail pages and their configurations
  const detailPages: Record<string, DetailPageInfo> = {
    taken: {
      segment: "taken",
      apiPath: "taken",
      titleField: "titel",
    },
    stagedagboek: {
      segment: "stagedagboek",
      apiPath: "dagboek/dag",
      titleField: "datum",
    },
    klassen: {
      segment: "klassen",
      apiPath: "klassen",
      titleField: "naam",
    },
  };

  useEffect(() => {
    const fetchDetailTitle = async () => {
      // Find if we're on a detail page by checking the URL segments
      for (const [, config] of Object.entries(detailPages)) {
        const detailIndex = pathSegments.indexOf(config.segment);
        if (detailIndex !== -1 && pathSegments[detailIndex + 1]) {
          const id = pathSegments[detailIndex + 1];
          try {
            const response = await fetch(
              `http://localhost:3000/api/${config.apiPath}/${id}`,
              {
                credentials: "include",
              },
            );
            if (!response.ok) throw new Error("Failed to fetch details");
            const data = await response.json();

            // Format the title based on the type of detail
            let title = data[config.titleField];
            if (config.segment === "stagedagboek" && data.datum) {
              title = new Date(data.datum).toLocaleDateString("nl-BE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            }
            setDetailTitle(title);
          } catch {
            setDetailTitle(null);
          }
          break;
        }
      }
    };

    fetchDetailTitle();
  }, [pathSegments]);

  const filteredSegments = pathSegments.filter(
    (segment) => segment !== "student",
  );
  const breadcrumbItems: BreadcrumbItem[] = filteredSegments.map(
    (segment, index) => {
      const isDetailPage =
        detailTitle &&
        segment === filteredSegments[filteredSegments.length - 1];

      // Handle special case for stagedagboek paths
      let path = `/${pathSegments.slice(0, index + 2).join("/")}`; // Include 'student' in the path
      if (
        segment === "ingave" &&
        filteredSegments[index - 1] === "stagedagboek"
      ) {
        path = "/student/stagedagboek/ingave";
      } else if (segment === "stagedagboek") {
        path = "/student/stagedagboek";
      }

      return {
        label: isDetailPage
          ? detailTitle
          : pathLabels[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1),
        path,
      };
    },
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-muted-foreground">
            {userName}
          </BreadcrumbPage>
        </BreadcrumbItem>
        {breadcrumbItems.map((crumb: BreadcrumbItem, index: number) => (
          <Fragment key={crumb.path}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.path}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
