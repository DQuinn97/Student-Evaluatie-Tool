import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import Register from "./components/Register";
import Login from "./components/Login";
import ResetPass from "./components/ResetPass";
import Profile from "./components/Profile";
import StudentStagedagboekIngave from "./components/StudentStagedagboekIngave";
import StudentDashboard from "./components/StudentDashboard";
import StudentTaken from "./components/StudentTaken";
import { TaskDetail } from "./components/TaskDetail";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPass />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/student/stagedagboek/ingave"
          element={<StudentStagedagboekIngave />}
        />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/taken" element={<StudentTaken />} />
        <Route path="/student/taken/:id" element={<TaskDetail />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
