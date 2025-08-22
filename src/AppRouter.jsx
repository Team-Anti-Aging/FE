import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import TrailDetail from "./components/Trails/DetailTrails/TrailDetail";
import ReportPage from "./components/Trails/ReportPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/trail/:id" element={<TrailDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
