import "./App.css";
import { Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import Register from "./components/Register";
import Login from "./components/Login";
import ResetPass from "./components/ResetPass";
import Profile from "./components/Profile";
import StudentStagedagboekIngave from "./components/StudentStagedagboekIngave";
import StudentDashboard from "./components/StudentDashboard";
import DocentDashboard from "./components/DocentDashboard";
import { TaskDetail } from "./components/TaskDetail";
import StudentStagedagboekOverview from "./components/StudentStagedagboekOverview";
import Sidebar from "./app/sidebar/page";
import { ClassManagement } from "./components/docent/ClassManagement";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPass />} />
        <Route path="/reset-password/:token" element={<ResetPass />} />
        <Route
          path="/*"
          element={
            <Sidebar>
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route
                  path="/student/stagedagboek"
                  element={<StudentStagedagboekOverview />}
                />
                <Route
                  path="/student/stagedagboek/ingave"
                  element={<StudentStagedagboekIngave />}
                />
                <Route
                  path="/student/stagedagboek/ingave/:id"
                  element={<StudentStagedagboekIngave />}
                />
                <Route
                  path="/student/dashboard"
                  element={<StudentDashboard />}
                />
                <Route path="/docent/dashboard" element={<DocentDashboard />} />
                <Route path="/student/taken/:taakId" element={<TaskDetail />} />
                <Route path="/docent/taken/:id" element={<TaskDetail />} />
                <Route
                  path="/docent/klasbeheer"
                  element={<ClassManagement />}
                />
              </Routes>
            </Sidebar>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
