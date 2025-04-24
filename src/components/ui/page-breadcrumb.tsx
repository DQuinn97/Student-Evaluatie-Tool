import { Fragment, useEffect, useState } from "react";
import { useLocation, Link } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { pathLabels } from "@/config/navigation";
import api from "@/api";

interface BreadcrumbItem {
  label: string;
  path: string;
  isClickable?: boolean;
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

  // Define special routes that don't need API calls
  const specialRoutes = {
    new: "Nieuwe Taak",
    ingave: "Nieuwe Ingave",
    edit: "Taak Bewerken",
    dagboek: "Stagedagboek",
  };

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

  // Define segments that should not be clickable
  const nonClickableSegments = ["docent", "student"];

  useEffect(() => {
    const fetchDetailTitle = async () => {
      // Find if we're on a detail page by checking the URL segments
      for (const [, config] of Object.entries(detailPages)) {
        const detailIndex = pathSegments.indexOf(config.segment);
        if (detailIndex !== -1 && pathSegments[detailIndex + 1]) {
          const id = pathSegments[detailIndex + 1];

          // Check for special routes first
          if (id in specialRoutes) {
            setDetailTitle(specialRoutes[id as keyof typeof specialRoutes]);
            return;
          }

          // Regular API fetch for other routes
          try {
            const { data } = await api.get(`${config.apiPath}/${id}`);
            if (!data) throw new Error("Failed to fetch details");

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

  // Helper function to check if a segment looks like an ID (MongoDB ObjectId)
  const isIdLike = (segment: string) => {
    // Check if segment looks like a MongoDB ObjectId
    return /^[0-9a-f]{24}$/i.test(segment);
  };

  // Check if we're editing a stagedagboek entry (URL pattern: /student/stagedagboek/ingave/{id})
  const isEditingEntry =
    pathSegments.includes("ingave") &&
    pathSegments.length > 3 &&
    isIdLike(pathSegments[pathSegments.indexOf("ingave") + 1]);

  // Process path segments to create breadcrumb items
  const processedSegments = [];
  let currentPath = "";

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    currentPath += `/${segment}`;

    // Skip segments that look like IDs
    if (isIdLike(segment)) {
      continue;
    }

    // Handle special cases
    if (
      segment === "studenten" &&
      i < pathSegments.length - 1 &&
      isIdLike(pathSegments[i + 1])
    ) {
      // Skip the "studenten" segment and its following ID
      i++; // Skip the ID in the next iteration
      continue;
    }

    // For special named routes that come after IDs
    if (segment === "dagboek" && i > 0 && isIdLike(pathSegments[i - 1])) {
      processedSegments.push({
        label: "Stagedagboek",
        path: currentPath,
        isClickable: !nonClickableSegments.includes(segment),
      });
      continue;
    }

    let label =
      pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

    // If we're at the "ingave" segment and this is an edit operation
    if (segment === "ingave" && isEditingEntry) {
      label = "Bewerk Ingave";
    }
    // Check if this is a detail page
    else if (
      i === pathSegments.length - 1 &&
      detailTitle &&
      !isIdLike(segment)
    ) {
      label = detailTitle;
    }

    processedSegments.push({
      label,
      path: currentPath,
      isClickable: !nonClickableSegments.includes(segment),
    });
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-muted-foreground">
            {userName}
          </BreadcrumbPage>
        </BreadcrumbItem>
        {processedSegments.map((crumb, index) => (
          <Fragment key={`${crumb.path}-${index}`}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === processedSegments.length - 1 || !crumb.isClickable ? (
                <BreadcrumbPage
                  className={!crumb.isClickable ? "text-muted-foreground" : ""}
                >
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.path}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
