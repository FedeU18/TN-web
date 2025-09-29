import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from "./pages/Home/Home";
import Header from "./components/Header";
import Footer from "./components/Footer/footer";
import RecuperarContra from "./pages/recuperarContra/recuperarContra";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ClienteDashboard from "./pages/ClienteDashboard/ClienteDashboard";
import RepartidorDashboard from "./pages/RepartidorDashboard/RepartidorDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

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
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/cliente-dashboard" element={<ClienteDashboard />} />
          <Route path="/repartidor-dashboard" element={<RepartidorDashboard />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App
