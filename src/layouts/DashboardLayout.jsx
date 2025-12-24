import { Outlet } from "react-router";
import HeaderComponent from "../components/Header";

export default function DashboardLayout() {
  return (
    <>
      <HeaderComponent />
      <p>welcome to dashboard</p>
      <Outlet />
    </>
  );
}
