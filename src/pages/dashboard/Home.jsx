import AdminDbHome from "../../components/dashboard/home/AdminDb";
import AgentDbHome from "../../components/dashboard/home/AgentDb";
import UserDbHome from "../../components/dashboard/home/UserDb";
import PageLoader from "../../components/loaders/PageLoader/PageLoader";
import useRole from "../../hooks/useRole";
import { useAuthStore } from "../../stores/useAuthStore";

export default function DashboardHomePage() {
  const { isCookieReady } = useAuthStore();
  const { role, isRoleLoading } = useRole();
  if (isRoleLoading || !isCookieReady) {
    return <PageLoader />;
  }
  switch (role) {
    case "admin":
      return <AdminDbHome />;
    case "agent":
      return <AgentDbHome />;
    default:
      return <UserDbHome />;
  }
}
