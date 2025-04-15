import { useState, useEffect } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccordionClassView } from "./docent/AccordionClassView";
import { ClassManagement } from "./docent/ClassManagement";
import { NameDialog } from "./shared/NameDialog";
import api from "../api";
import { useNavigate } from "react-router";

const DocentDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNameDialog, setShowNameDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: user } = await api.get("/profiel");
        if (!user.isDocent) {
          navigate("/student/dashboard");
          return;
        }
        setUserData(user);

        // Check if user's name data is missing or empty
        if (
          !user.naam ||
          user.naam.trim() === "" ||
          !user.achternaam ||
          user.achternaam.trim() === ""
        ) {
          setShowNameDialog(true);
        }

        const { data: classesData } = await api.get("/klassen");
        if (classesData && classesData.length > 0) {
          const classesWithTasks = await Promise.all(
            classesData.map(async (klas: any) => {
              const { data: tasksData } = await api.get(
                `/klassen/${klas._id}/taken`,
              );
              return { ...klas, taken: tasksData };
            }),
          );
          setClasses(classesWithTasks);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <NameDialog
        isOpen={showNameDialog}
        onOpenChange={setShowNameDialog}
        userData={userData}
        onUserDataUpdate={setUserData}
        initialFirstName={userData.naam || ""}
        initialLastName={userData.achternaam || ""}
      />

      <h1 className="mb-6 text-4xl font-bold">
        {userData.naam ? `${userData.naam}'s Dashboard` : "Dashboard"}
      </h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Klasoverzicht</TabsTrigger>
          <TabsTrigger value="management">Beheer</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Accordion.Root type="single" collapsible className="space-y-4">
            {classes.map((classData) => (
              <AccordionClassView key={classData._id} classData={classData} />
            ))}
          </Accordion.Root>
        </TabsContent>

        <TabsContent value="management">
          <ClassManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocentDashboard;
