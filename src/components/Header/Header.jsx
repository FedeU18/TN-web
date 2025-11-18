import { useAuthStore } from "../../store/auth";
import HeaderAdmin from "./HeaderAdmin";
import HeaderCliente from "./HeaderCliente";
import HeaderRepartidor from "./HeaderRepartidor";
import HeaderVendedor from "./HeaderVendedor";
import HeaderPublic from "./HeaderPublic";

function Header() {
  const { user } = useAuthStore(); // user viene del login
  const rol = user?.rol || null;

  switch (rol) {
    case "admin":
      return <HeaderAdmin />;
    case "cliente":
      return <HeaderCliente />;
    case "repartidor":
      return <HeaderRepartidor />;
    case "vendedor":
      return <HeaderVendedor />;
    default:
      return <HeaderPublic />; // usuario sin loguear
  }
}

export default Header;
