import { Link } from "react-router-dom";
import UserProfile from "../../components/UserProfile/UserProfile";
import OrderHistory from "../../components/OrderHistory/OrderHistory";

export default function Profile() {
    return (
      <div>
        <UserProfile />
        <hr/>
        <OrderHistory />
      <div style={{ marginTop: 20 }}>
        <Link to="../cliente-dashboard">Volver al Dashboard</Link>
      </div>
    </div> 
  );
}