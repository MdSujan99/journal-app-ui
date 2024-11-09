import { Outlet } from "react-router";
import MainNav from "./MainNav";
function RootLayout() {
  return (
    <div>
      <MainNav />
      <Outlet />
    </div>
  );
}

export default RootLayout;
