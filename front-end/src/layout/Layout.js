import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Menu from "./Menu";
import Routes from "./Routes";
import { useMediaQuery } from "react-responsive";
import "./Layout.css";

/**
 * Defines the main layout of the application.
 * Uses media queries to adjust layout based on screen size.
 * @returns {JSX.Element}
 */
function Layout() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const location = useLocation();
  const [isHomePage, setIsHomePage] = useState(location.pathname === "/");

  useEffect(() => {
    setIsHomePage(location.pathname === "/");
  }, [location]);

  return (
    <div className="container-fluid">
      {isMobile && (
        <div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div id="logo">
              <div id="mobile-logo" className="lemonada-text">
                Periodic Tables
              </div>
            </div>
          </div>
          <Menu />
        </div>
      )}
      {!isMobile && !isHomePage && (
        <div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div id="logo" className="small-logo">
              <div id="logo-line-1" className="lemonada-text">
                Periodic Tables
              </div>
            </div>
          </div>
          <Menu />
        </div>
      )}
      {!isMobile && isHomePage && (
        <div>
          <Menu />
          <div className="home-logo d-flex flex-column justify-content-center align-items-center">
            <div id="logo">
              <div id="logo-line-1" className="lemonada-text">
                Periodic
              </div>
              <div id="logo-line-2" className="lemonada-text">
                Tables
              </div>
            </div>
          </div>
        </div>
      )}
      <Routes />
    </div>
  );
}

export default Layout;
