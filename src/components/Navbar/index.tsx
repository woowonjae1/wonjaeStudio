"use client";

import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme";
import { LanguageToggle } from "@/components/LanguageToggle";
import "./Navbar.css";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    router.push(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a
          href="/"
          onClick={(e) => handleNavClick(e, "/")}
          className="navbar-logo"
        >
          woowonjaeQAQ
        </a>

        <div className="navbar-content">
          <ul className="navbar-menu">
            <li>
              <a
                href="/"
                onClick={(e) => handleNavClick(e, "/")}
                className={
                  pathname === "/" &&
                  !pathname.startsWith("/english") &&
                  !pathname.startsWith("/music")
                    ? "active"
                    : ""
                }
              >
                Notes
              </a>
            </li>
            <li>
              <a
                href="/music"
                onClick={(e) => handleNavClick(e, "/music")}
                className={pathname.startsWith("/music") ? "active" : ""}
              >
                Music
              </a>
            </li>
            <li>
              <a
                href="/english"
                onClick={(e) => handleNavClick(e, "/english")}
                className={pathname.startsWith("/english") ? "active" : ""}
              >
                English
              </a>
            </li>
            <li>
              <a
                href="/notes/new"
                onClick={(e) => handleNavClick(e, "/notes/new")}
                className={`nav-write ${pathname === "/notes/new" ? "active" : ""}`}
              >
                Write
              </a>
            </li>
          </ul>

          <div className="navbar-actions">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
