import "./UserNavbar.css";
import logo from "../assets/fotx-movies-logo.svg";

function UserNavbar({ navigate, auth, onLogout, hideActions = false }) {
  return (
    <header className="user-nav">
      <button className="user-nav-brand" type="button" onClick={() => navigate("/home")} aria-label="FOTX Movies home">
        <img src={logo} alt="FOTX MOVIES" className="user-nav-logo" />
      </button>
      <nav className="user-nav-links" aria-label="Main navigation">
        <button type="button" onClick={() => navigate("/home")}>Home</button>
        <button type="button" onClick={() => navigate("/movies")}>Movies</button>
        <button type="button" onClick={() => navigate("/theaters")}>Theaters</button>
        <button type="button" onClick={() => navigate(auth?.token ? "/my-bookings" : "/login")}>Bookings</button>
      </nav>
      {!hideActions && (
        <div className="user-nav-actions">
          {!auth?.token && (
            <button className="user-nav-primary" type="button" onClick={() => navigate("/login")}>Sign in</button>
          )}
          {auth?.token && (
            <button
              className="user-nav-ghost"
              type="button"
              onClick={() => {
                onLogout?.();
                navigate("/home");
              }}
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default UserNavbar;
