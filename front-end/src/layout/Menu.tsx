import { Link, useLocation } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";

/**
 * Interface defining props for Menu component
 */
interface MenuProps {
  isHomePage: boolean;
}

/**
 * Navigation menu component that adjusts its active state based on the current location.
 * @param {MenuProps} props - Component props
 * @returns {JSX.Element}
 */
function Menu({ isHomePage }: MenuProps): JSX.Element {
  const location = useLocation();
  const navItems = [
    { name: "HOME", path: "/" },
    { name: "DASHBOARD", path: "/dashboard" },
    { name: "SEARCH", path: "/search" },
    { name: "NEW RESERVATION", path: "/reservations/new" },
    { name: "NEW TABLE", path: "/tables/new" },
  ];

  const menuAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(-20%)" },
    to: { opacity: 1, transform: "translateY(0%)" },
    config: { mass: 1, tension: 180, friction: 12 },
  });

  return (
    <animated.nav
      className={`navbar container justify-content-center align-items-center ${
        isHomePage ? "home-menu" : ""
      }`}
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
