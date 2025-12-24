import { Link } from "react-router";

export default function NavbarComponent() {
  return (
    <nav className="flex gap-2">
      <Link to={"auth/login"} className="btn btn-primary">
        Login
      </Link>
      <Link to={"auth/register"} className="btn btn-primary">
        Register
      </Link>
    </nav>
  );
}
