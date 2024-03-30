import Header from "./Header";
import CartOverview from "../features/cart/CartOverview";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="layout">
      <Header />

      <main>
        <h1>CONTENT</h1>
        <Outlet />
      </main>

      <CartOverview />
    </div>
  );
}

export default AppLayout;
