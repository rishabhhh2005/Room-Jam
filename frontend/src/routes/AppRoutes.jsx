import {Routes , Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import RoomPage from "../pages/RoomPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import WorkspacesPage from "../pages/WorkspacesPage";
import CreateRoomPage from "../pages/CreateRoomPage";
import JoinRoomPage from "../pages/JoinRoomPage";
import ProblemLibraryPage from "../pages/ProblemLibraryPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes(){
    return(
        <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />

      <Route path="/problem-library" element={
        <ProtectedRoute>
          <ProblemLibraryPage />
        </ProtectedRoute>
      } />

      <Route path="/workspaces" element={
        <ProtectedRoute>
          <WorkspacesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/create-room" element={
        <ProtectedRoute>
          <CreateRoomPage />
        </ProtectedRoute>
      } />
      
      <Route path="/join-room" element={
        <ProtectedRoute>
          <JoinRoomPage />
        </ProtectedRoute>
      } />
      
      <Route path="/room/:roomKey" element={
        <ProtectedRoute>
          <RoomPage />
        </ProtectedRoute>
      } />
    </Routes>
    )
}

export default AppRoutes;