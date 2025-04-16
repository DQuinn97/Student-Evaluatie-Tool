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

// Storage key for sidebar state
const SIDEBAR_STORAGE_KEY = "sidebar_state";

export default function Page({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string>("");
  const [profileData, setProfileData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    // Initialize from localStorage if available, otherwise default to true (open)
    const savedState = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return savedState !== null ? savedState === "true" : true;
  });
  const navigate = useNavigate();

  const handleSidebarChange = (open: boolean) => {
    setSidebarOpen(open);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(open));
  };

  const fetchUserData = async () => {
    try {
      const { data } = await api.get("/profiel");
      setProfileData(data);
      setUserName(data.naam ? `${data.naam} ${data.achternaam}` : data.email);
    } catch (error) {
      setUserName("Student");
    }
  };

  useEffect(() => {
    fetchUserData();
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
    <SidebarProvider
      defaultOpen={sidebarOpen}
      open={sidebarOpen}
      onOpenChange={handleSidebarChange}
    >
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
                <div className="flex items-center gap-2">
                  {profileData?.foto ? (
                    <img
                      src={profileData.foto}
                      alt="Profile"
                      className="size-7 rounded-full object-cover"
                    />
                  ) : (
                    <CircleUserRound className="size-7 cursor-pointer stroke-1" />
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/profile" onClick={fetchUserData}>
                    Profiel
                  </Link>
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
