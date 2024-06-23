import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSpring, animated } from "react-spring";

function Menu({ isHomePage }) {
  const location = useLocation();
  const navItems = [
    { name: "HOME", path: "/" },
    { name: "DASHBOARD", path: "/dashboard" },
    { name: "SEARCH", path: "/search" },
    { name: "NEW RESERVATION", path: "/reservations/new" },
    { name: "NEW TABLE", path: "/tables/new" },
  ];

  const menuAnimation = useSpring({
    opacity: 1,
    transform: "translateY(0%)",
    config: { mass: 1, tension: 180, friction: 12 },
  });

  return (
    <animated.nav
      className="navbar container justify-content-center align-items-center"
      style={menuAnimation}
    >
      <ul className="nav justify-content-center w-100">
        {navItems.map((item) => (
          <li className="nav-item" key={item.name}>
            <Link
              className={`nav-link pill ${location.pathname === item.path ? "active" : ""}`}
              to={location.pathname === item.path ? "#" : item.path}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </animated.nav>
  );
}

export default Menu;
