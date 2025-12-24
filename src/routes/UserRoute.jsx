import PageLoader from "../components/loaders/PageLoader/PageLoader";
import useRole from "../hooks/useRole";
import useUserStatus from "../hooks/useUserStatus";
import UnauthorizedPage from "../pages/Unauthorized";

export default function UserRoute({ children }) {
  const { role, isRoleLoading } = useRole();
  const { status, isStatusLoading } = useUserStatus();
  if (isRoleLoading && isStatusLoading) return <PageLoader />;
  if (role === "user" && status === "approved") {
    return children;
  } else {
    return <UnauthorizedPage />;
  }
}
