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

export function PageBreadcrumb({ userName }: { userName: string }) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const [taskTitle, setTaskTitle] = useState<string | null>(null);

  useEffect(() => {
    // Check if we're on a task detail page
    const taskId = pathSegments[pathSegments.indexOf("taken") + 1];
    if (taskId) {
      // Fetch task details
      fetch(`http://localhost:3000/api/taken/${taskId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setTaskTitle(data.titel);
        })
        .catch(() => {
          setTaskTitle(null);
        });
    } else {
      setTaskTitle(null);
    }
  }, [pathSegments]);

  const filteredSegments = pathSegments.filter(
    (segment) => segment !== "student",
  );
  const breadcrumbItems: BreadcrumbItem[] = filteredSegments.map(
    (segment, index) => {
      const isTaskDetailPage =
        taskTitle && segment === filteredSegments[filteredSegments.length - 1];

      return {
        label: isTaskDetailPage
          ? taskTitle
          : pathLabels[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1),
        path: `/${pathSegments.slice(0, index + 1).join("/")}`,
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
