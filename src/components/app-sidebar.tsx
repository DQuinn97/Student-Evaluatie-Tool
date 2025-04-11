import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { studentNavigation, docentNavigation } from "@/config/navigation";
import { NavItem } from "@/types";
import { useEffect, useState } from "react";
import api from "@/api";

function NavLink({ item }: { item: NavItem }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <div className="flex w-full items-center">
            <Link
              to={item.path}
              className={isActive ? "text-accent-foreground font-medium" : ""}
            >
              {item.label}
            </Link>
            {hasChildren && (
              <CollapsibleTrigger className="ml-auto">
                <ChevronRight className="transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            )}
          </div>
        </SidebarGroupLabel>
        {hasChildren &&
          item.children?.map((child) => (
            <CollapsibleContent key={child.path}>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === child.path}
                    >
                      <Link to={child.path}>{child.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          ))}
      </SidebarGroup>
    </Collapsible>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isDocent, setIsDocent] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: user } = await api.get("/profiel");
        setIsDocent(user.isDocent);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  if (isDocent === null) {
    return null; // Or a loading state
  }

  const navigationItems = isDocent ? docentNavigation : studentNavigation;

  return (
    <Sidebar {...props} className="h-full">
      <SidebarContent className="gap-0">
        {navigationItems.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
