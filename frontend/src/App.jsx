import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./pages/auth/signup/SignUpPage.jsx";
import Loginpage from "./pages/auth/login/LoginPage.jsx";
import Homepage from "./pages/home/HomePage.jsx";
import Sidebar from "./components/common/SideBar.jsx";
import RightPanel from "./components/common/RightPanel.jsx";
import NotificationPage from "./pages/notiffication/NotifficationPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner.jsx";

function App() {
  const { data: authuser, isLoading } = useQuery({
    queryKey: ["authuser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return false;
        if (!res.ok) throw new Error(data.error || "some thing went wrong");
        console.log(data);
        return data;
      } catch (error) {
        throw error;
      }
    },
    retry: 2,
  });
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <>
      <div className="flex max-w-6xl mx-auto ">
        {/*         common because it is not wrapped under routes */}
        {authuser && <Sidebar />}
        <Routes>
          <Route
            path="/"
            element={authuser ? <Homepage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authuser ? <Loginpage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authuser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authuser ? <npm  /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:username"
            element={authuser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
        {authuser && <RightPanel />}
        <Toaster />
      </div>
    </>
  );
}

export default App;
