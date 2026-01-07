"use client";

import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme";
import "./Navbar.css";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" onClick={handleHomeClick} className="navbar-logo">
          WJ
        </a>
        <div className="navbar-content">
          <ul className="navbar-menu">
            <li>
              <a
                href="/"
                onClick={handleHomeClick}
                className={pathname === "/" ? "active" : ""}
              >
                文章
              </a>
            </li>
            <li>
              <a
                href="/notes/new"
                className={pathname === "/notes/new" ? "active" : ""}
              >
                写作
              </a>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
