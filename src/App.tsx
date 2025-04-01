import "./App.css";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
