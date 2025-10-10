import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import RecuperarContra from "./pages/recuperarContra/recuperarContra";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ClienteDashboard from "./pages/ClienteDashboard/ClienteDashboard";
import RepartidorDashboard from "./pages/RepartidorDashboard/RepartidorDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import VerificarToken from "./components/VerificarToken/VerificarToken";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import AdminPanel from "./pages/Admin/AdminPanel/AdminPanel";
import { ProtectedRoute } from "./components/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperarContra" element={<RecuperarContra />} />
          <Route path="/verify-token" element={<VerificarToken />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/*Dashboards protegidos*/}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cliente-dashboard"
            element={
              <ProtectedRoute roles={["cliente"]}>
                <ClienteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repartidor-dashboard"
            element={
              <ProtectedRoute roles={["repartidor"]}>
                <RepartidorDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App
