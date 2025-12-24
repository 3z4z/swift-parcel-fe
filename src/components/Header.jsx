import { Link } from "react-router";
import LogoComponent from "./Logo";
import NavbarComponent from "./Navbar";

export default function HeaderComponent() {
  return (
    <header className="p-3 bg-white flex justify-between items-center shadow">
      <Link to={"/"}>
        <LogoComponent />
      </Link>
      <NavbarComponent />
    </header>
  );
}
