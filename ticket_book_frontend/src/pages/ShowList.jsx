import { useEffect, useState } from "react";
import { api } from "../services/api";
import UserNavbar from "../components/UserNavbar";
import "./BookingFlow.css";

function ShowList({ route, navigate, logout, auth }) {
  const theaterId = route.query.get("theaterId");
  const movieTitle = route.query.get("movieTitle") || "";
  const movieId = route.query.get("movieId") || "";
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (theaterId) {
      setLoading(true);
      setError("");
      api.shows(theaterId)
        .then((items) => {
          if (movieId) {
            const filteredById = items.filter((show) => String(show.movie?.id) === String(movieId));
            setShows(filteredById);
            return;
          }
          if (!movieTitle) {
            setShows(items);
            return;
          }
          const filtered = items.filter((show) => show.movie?.title?.toLowerCase() === movieTitle.toLowerCase());
          setShows(filtered);
        })
        .catch((err) => {
          setShows([]);
          setError(err.message || "Unable to load show timings");
        })
        .finally(() => setLoading(false));
    }
  }, [theaterId, movieTitle, movieId]);

  return (
    <div className="show-page">
      <UserNavbar navigate={navigate} auth={auth} onLogout={logout} />
      <div className="page show-layout">
        <div className="card wide booking-shell show-shell">
          <aside className="show-sidebar">
            <h3>Booking Steps</h3>
            <button type="button" className="side-link" onClick={() => navigate("/movies")}>1. Movies</button>
            <button type="button" className="side-link" onClick={() => navigate("/theaters")}>2. Theaters</button>
            <button type="button" className="side-link active">3. Show Timings</button>
            <button type="button" className="side-link" disabled>4. Seat Selection</button>
          </aside>

          <section className="show-main">
            <div className="row show-header">
              <div>
                <p className="show-kicker">Show Dashboard</p>
                <h2>Show Timings</h2>
                {!!movieTitle && <p className="flow-kicker">Movie: {movieTitle}</p>}
              </div>
              <button className="show-back-btn" onClick={() => navigate("/movies")}>Back to Movies</button>
            </div>

            {loading && <p className="flow-info">Loading show timings...</p>}
            {!loading && error && <p className="flow-info">{error}</p>}
            {!loading && shows.length === 0 && <p className="flow-info">No shows found for this movie/theater.</p>}

            <div className="grid flow-grid show-grid">
              {shows.map((show) => (
                <article className="tile flow-tile show-card" key={show.id}>
                  <div className="show-card-body">
                    <h3>{show.movie.title}</h3>
                    <p className="flow-muted">{new Date(show.showTime).toLocaleString()}</p>
                    <p className="flow-price">Price: Rs {show.price}</p>
                  </div>
                  <button className="show-select-btn" onClick={() => navigate(`/seats?showId=${show.id}`)}>
                    Select Seats
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ShowList;
