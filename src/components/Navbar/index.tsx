"use client";

import { usePathname, useRouter } from "next/navigation";
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
        <ul className="navbar-menu">
          <li>
            <a
              href="/"
              onClick={handleHomeClick}
              className={pathname === "/" ? "active" : ""}
            >
              笔记
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
          <li>
            <a
              href="/tutorials"
              className={pathname === "/tutorials" ? "active" : ""}
            >
              教程
            </a>
          </li>
          <li>
            <a
              href="/community"
              className={pathname?.startsWith("/community") ? "active" : ""}
            >
              社区
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
