import { useEffect, useState } from "react";
import { api } from "../services/api";
import UserNavbar from "../components/UserNavbar";
import "./BookingFlow.css";

function TheaterList({ route, navigate, logout, auth }) {
  const [theaters, setTheaters] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const city = route?.query.get("city") || localStorage.getItem("user_city") || "Bengaluru";
  const movieTitle = route?.query.get("movieTitle") || "";
  const movieId = route?.query.get("movieId") || "";
  const hasMovieFilter = Boolean(movieId);
  const hasCityQuery = Boolean(route?.query.get("city"));

  useEffect(() => {
    setLoading(true);
    setTitle(hasMovieFilter ? "Available Theaters" : `${city} Theaters`);

    const theaterRequest = hasMovieFilter
      ? api.theaters({ movieId })
      : hasCityQuery
        ? api.theaters({ city })
        : api.theaters();

    theaterRequest
      .then((items) => {
        setTheaters(items);
        if (!hasMovieFilter && hasCityQuery && !items.length && city !== "Bengaluru") {
          setTitle(`${city} Theaters (showing Bengaluru results)`);
          return api.theaters({ city: "Bengaluru" }).then(setTheaters);
        }
        return null;
      })
      .catch(() => setTheaters([]))
      .finally(() => setLoading(false));
  }, [city, movieId, hasCityQuery]);

  return (
    <div className="theater-page">
      <UserNavbar navigate={navigate} auth={auth} onLogout={logout} />
      <div className="page theater-layout">
        <div className="card wide booking-shell theater-shell">
          <section className="theater-hero">
            <div className="theater-hero-copy">
              <p className="theater-eyebrow">Ticket Booking</p>
              <h2>{title}</h2>
              <p className="theater-subline">
                {hasMovieFilter
                  ? "Choose your preferred cinema and continue to show timings."
                  : "Explore nearby theaters and check available shows."}
              </p>
              <div className="theater-meta-row">
                {!!movieTitle && <span className="theater-chip">Movie: {movieTitle}</span>}
                <span className="theater-chip">City: {city}</span>
              </div>
            </div>
            <div className="theater-hero-actions">
              <button className="theater-back-btn" onClick={() => navigate("/movies")}>
                Browse Movies
              </button>
            </div>
          </section>

          {loading && <p className="flow-info">Loading theaters...</p>}
          {!loading && theaters.length === 0 && (
            <p className="flow-info">{movieId ? "No theaters available for this movie" : "No theaters available"}</p>
          )}

          <div className="grid flow-grid theater-grid">
            {theaters.map((theater) => (
              <article key={theater.id} className="tile flow-tile theater-card">
                <div className="theater-card-top">
                  {!!theater.imageUrl ? (
                    <img src={theater.imageUrl} alt={theater.name} className="flow-image theater-image" />
                  ) : (
                    <div className="theater-image theater-image-fallback" aria-hidden="true">
                      {theater.name?.slice(0, 2)?.toUpperCase() || "TH"}
                    </div>
                  )}
                  <div className="theater-card-main">
                    <h3>{theater.name}</h3>
                    <p className="flow-muted">{theater.location}</p>
                    <div className="theater-badges">
                      <span>Online Booking</span>
                      <span>Instant Confirmation</span>
                    </div>
                  </div>
                </div>
                <div className="theater-card-actions">
                  <button
                    className="theater-view-btn"
                  onClick={() =>
                    navigate(`/shows?theaterId=${theater.id}&movieTitle=${encodeURIComponent(movieTitle)}&movieId=${encodeURIComponent(movieId)}`)
                  }
                >
                  View Shows
                </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TheaterList;


