import PageLoader from "../components/loaders/PageLoader/PageLoader";
import useRole from "../hooks/useRole";
import UnauthorizedPage from "../pages/Unauthorized";
import { useAuthStore } from "../stores/useAuthStore";

export default function AgentRoute({ children }) {
  const { role, isRoleLoading } = useRole();
  const { isSigningIn } = useAuthStore();
  if (isRoleLoading && isSigningIn) return <PageLoader />;
  if (role === "agent") {
    return children;
  } else {
    return <UnauthorizedPage />;
  }
}
