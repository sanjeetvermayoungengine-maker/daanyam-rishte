import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { hasStartedBioData } from "../utils/formHelpers";
import { useAppSelector } from "../store/hooks";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Biodata", to: "/biodata/personal" },
  { label: "Preview", to: "/preview" },
  { label: "Shares", to: "/shares" }
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isConfigured, signInWithGoogle, signOut } = useAuth();
  const bioData = useAppSelector((state) => state.bioData);
  const statusLabel = bioData.submittedAt
    ? "Published"
    : hasStartedBioData(bioData)
      ? "Draft"
      : "New";

  return (
    <header className="site-header">
      <NavLink className="brand" to="/" onClick={() => setIsOpen(false)}>
        <span className="brand-mark" aria-hidden="true">
          R
        </span>
        <span>
          <strong>Rishte</strong>
          <small>{statusLabel}</small>
        </span>
      </NavLink>

      <button
        className="menu-button"
        type="button"
        aria-expanded={isOpen}
        aria-controls="primary-nav"
        onClick={() => setIsOpen((current) => !current)}
      >
        Menu
      </button>

      <nav className={isOpen ? "primary-nav primary-nav--open" : "primary-nav"} id="primary-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? "nav-link nav-link--active" : "nav-link")}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </NavLink>
        ))}
        {isConfigured ? (
          user ? (
            <button
              className="text-button"
              type="button"
              onClick={() => {
                void signOut();
                setIsOpen(false);
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="text-button"
              type="button"
              onClick={() => {
                void signInWithGoogle();
                setIsOpen(false);
              }}
            >
              Sign in with Google
            </button>
          )
        ) : null}
      </nav>
    </header>
  );
}
