import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          <span className="logo-icon">✓</span>
          Pollify
        </Link>

        {/* NAVIGATION */}
        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          {token ? (
            <>
              <Link to="/create-poll">
                Create Poll
              </Link>

              <div className="user-menu">
                <span className="user-name">
                  Hi, {user?.name || "User"}
                </span>

                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>

              <Link to="/register" className="nav-button">
                Get Started
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;