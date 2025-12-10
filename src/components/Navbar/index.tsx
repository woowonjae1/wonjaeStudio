"use client";

import { usePathname, useRouter } from "next/navigation";
import "./Navbar.css";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const handleNavClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();

    if (isHomePage) {
      // 在首页，直接滚动到对应区域
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // 在其他页面，先导航到首页，然后滚动
      router.push(`/#${sectionId}`);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" onClick={handleHomeClick} className="navbar-logo">
          WOOWONJAE
        </a>
        <ul className="navbar-menu">
          <li>
            <a href="/" onClick={handleHomeClick}>
              Home
            </a>
          </li>
          <li>
            <a href="/#music" onClick={(e) => handleNavClick(e, "music")}>
              Music
            </a>
          </li>
          <li>
            <a
              href="/tutorials"
              className={pathname === "/tutorials" ? "active" : ""}
            >
              Tutorials
            </a>
          </li>
          <li>
            <a
              href="/community"
              className={pathname?.startsWith("/community") ? "active" : ""}
            >
              Community
            </a>
          </li>
          <li>
            <a href="/#contact" onClick={(e) => handleNavClick(e, "contact")}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
