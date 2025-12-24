import AdminDbHome from "../../components/dashboard/home/AdminDb";
import AgentDbHome from "../../components/dashboard/home/AgentDb";
import UserDbHome from "../../components/dashboard/home/UserDb";
import PageLoader from "../../components/loaders/PageLoader/PageLoader";
import useRole from "../../hooks/useRole";

export default function DashboardHomePage() {
  const { role, isRoleLoading } = useRole();
  if (isRoleLoading) {
    return <PageLoader />;
  }
  console.log("userRole", role);
  switch (role) {
    case "admin":
      return <AdminDbHome />;
    case "agent":
      return <AgentDbHome />;
    default:
      return <UserDbHome />;
  }
}
