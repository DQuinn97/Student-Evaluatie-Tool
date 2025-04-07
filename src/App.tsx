import "./App.css";
import { Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import Register from "./components/Register";
import Login from "./components/Login";
import ResetPass from "./components/ResetPass";
import Profile from "./components/Profile";
import StudentStagedagboekIngave from "./components/StudentStagedagboekIngave";
import StudentDashboard from "./components/StudentDashboard";
import { TaskDetail } from "./components/TaskDetail";
import StudentStagedagboekOverview from "./components/StudentStagedagboekOverview";
import Sidebar from "./app/sidebar/page";

function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPass />} />
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
                <Route path="/student/taken/:id" element={<TaskDetail />} />
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
