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
import { DialogProvider } from "./contexts/DialogContext";
import { InputDialog } from "./components/shared/InputDialog";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <DialogProvider>
      <>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPass />} />
          <Route path="/reset-password/:token" element={<ResetPass />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Sidebar>
                  <Routes>
                    <Route path="/profile" element={<Profile />} />

                    {/* Student Routes */}
                    <Route
                      path="/student/stagedagboek"
                      element={
                        <ProtectedRoute allowedRole="student">
                          <StudentStagedagboekOverview />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/student/stagedagboek/ingave"
                      element={
                        <ProtectedRoute allowedRole="student">
                          <StudentStagedagboekIngave />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/student/stagedagboek/ingave/:id"
                      element={
                        <ProtectedRoute allowedRole="student">
                          <StudentStagedagboekIngave />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/student/dashboard"
                      element={
                        <ProtectedRoute allowedRole="student">
                          <StudentDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/student/taken/:taakId"
                      element={
                        <ProtectedRoute allowedRole="student">
                          <TaskDetail />
                        </ProtectedRoute>
                      }
                    />

                    {/* Docent Routes */}
                    <Route
                      path="/docent/dashboard"
                      element={
                        <ProtectedRoute allowedRole="docent">
                          <DocentDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/docent/taken/:id"
                      element={
                        <ProtectedRoute allowedRole="docent">
                          <TaskDetail />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/docent/klasbeheer"
                      element={
                        <ProtectedRoute allowedRole="docent">
                          <ClassManagement />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Sidebar>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
        <InputDialog />
      </>
    </DialogProvider>
  );
}

export default App;
