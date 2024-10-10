import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx";
import Loginpage from "./pages/auth/login/LoginPage.jsx";
import Homepage from "./pages/home/HomePage.jsx";
import Sidebar from "./components/common/SideBar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import NotificationPage from "./pages/notiffication/NotifficationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

function App() {
  return (
    <>
      <div className="flex max-w-6xl mx-auto ">
        {/*         common because it is not wrapped under routes */}
        <Sidebar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
        </Routes>
        <RightPanel />
        <Toaster />
      </div>
    </>
  );
}

export default App;
