import { Children, isValidElement, ReactElement, ReactNode } from "react";
import { Route, Routes, RouteProps } from "react-router";

import { RouteConfig } from "./types";

export const routes: RouteConfig[] = [
  {
    path: "/student/dashboard",
    label: "Dashboard",
    children: [],
  },
  {
    path: "/student/stagedagboek",
    label: "Stagedagboek",
    children: [
      {
        path: "/student/stagedagboek/ingave",
        label: "Nieuwe ingave",
      },
    ],
  },
];

function toTitleCase(str: string): string {
  return str
    .split("/")
    .pop()!
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface RouteElement extends ReactElement {
  props: RouteProps & {
    path?: string;
    element?: ReactElement;
    children?: ReactNode;
  };
}

interface RoutesElement extends ReactElement {
  props: {
    children: ReactNode;
  };
  type: typeof Routes;
}

interface ElementWithChildren extends ReactElement {
  props: {
    children?: ReactNode;
  };
}

export function parseRoutes(
  children: ReactNode,
  parentPath: string = "",
): RouteConfig[] {
  return Children.toArray(children)
    .filter(
      (child): child is RouteElement =>
        isValidElement(child) && child.type === Route,
    )
    .map((child) => {
      const path = child.props.path || "";
      const fullPath = path.startsWith("/") ? path : `${parentPath}/${path}`;

      // Don't include catch-all routes
      if (path === "*" || path.includes("*")) {
        return null;
      }

      const config: RouteConfig = {
        path: fullPath,
        label: toTitleCase(path.replace(/[:/]/g, "")),
        element: child.props.element,
      };

      if (child.props.children) {
        const nestedRoutes = parseRoutes(child.props.children, fullPath);
        if (nestedRoutes.length > 0) {
          config.children = nestedRoutes;
        }
      } else if (isValidElement(child.props.element)) {
        const element = child.props.element as ElementWithChildren;
        const nestedRoutesComponent = Children.toArray(
          element.props.children,
        ).find(
          (child): child is RoutesElement =>
            isValidElement(child) && child.type === Routes,
        );

        if (nestedRoutesComponent) {
          const nestedRoutes = parseRoutes(
            nestedRoutesComponent.props.children,
            "",
          );
          if (nestedRoutes.length > 0) {
            config.children = nestedRoutes;
          }
        }
      }

      return config;
    })
    .filter(Boolean) as RouteConfig[];
}

// Custom labels for specific routes
export const routeLabels: Record<string, string> = {
  "/student/dashboard": "Dashboard",
  "/student/stagedagboek": "Stagedagboek",
  "/student/stagedagboek/ingave": "Nieuwe Ingave",
  "/profile": "Profiel",
};
