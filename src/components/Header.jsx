import { Link } from "react-router";
import LogoComponent from "./Logo";
import NavbarComponent from "./Navbar";

export default function HeaderComponent() {
  return (
    <header className="w-full p-3 flex justify-between items-center">
      <Link to={"/"}>
        <LogoComponent />
      </Link>
      <NavbarComponent />
    </header>
  );
}
