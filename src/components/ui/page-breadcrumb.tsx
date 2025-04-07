import { Fragment } from "react";
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

export function PageBreadcrumb({ userName }: { userName: string }) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const breadcrumbItems = pathSegments
    .filter((segment) => segment !== "student")
    .map((segment, index) => ({
      label:
        pathLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1),
      path: `/${pathSegments.slice(0, index + 1).join("/")}`,
    }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-muted-foreground">
            {userName}
          </BreadcrumbPage>
        </BreadcrumbItem>
        {breadcrumbItems.map((crumb, index) => (
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
