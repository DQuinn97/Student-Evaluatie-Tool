import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggler } from "@/components/mode-toggler";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CircleUserRound } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import api from "@/api";

export default function Page({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/profiel", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUserName(data.naam ? `${data.naam} ${data.achternaam}` : data.email);
      })
      .catch(() => setUserName("Student"));
  }, []);

  const logout = () => {
    api
      .post("/auth/logout")
      .then(() => {
        navigate("/login");
      })
      .catch((err) => console.error(err));
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background sticky top-0 z-10 mb-2 flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PageBreadcrumb userName={userName} />
          <div className="ml-auto flex items-center gap-4">
            <ModeToggler />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <CircleUserRound className="size-7 cursor-pointer stroke-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile">Profiel</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
