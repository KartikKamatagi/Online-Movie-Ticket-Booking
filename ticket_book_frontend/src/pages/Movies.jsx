import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import "./Movies.css";

function Movies({ auth, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAuthenticated = Boolean(auth?.token);

  useEffect(() => {
    const storedCity = localStorage.getItem("user_city");
    if (storedCity) {
      setCity(storedCity);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const loadMovies = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch("http://localhost:8080/api/movies");
        const data = await response.json().catch(() => []);
        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch movies");
        }
        if (active) {
          setMovies(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) {
          setMovies([]);
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadMovies();
    return () => {
      active = false;
    };
  }, []);

  const filteredMovies = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return movies;
    return movies.filter((movie) => movie.title?.toLowerCase().includes(term));
  }, [movies, query]);

  const handleBook = (movie) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    navigate(`/theaters?city=${encodeURIComponent(city)}&movieId=${movie.id}&movieTitle=${encodeURIComponent(movie.title || "")}`);
  };

  const formatDuration = (value) => {
    if (value == null || value === "") return "N/A";
    const mins = Number(value);
    if (!Number.isNaN(mins)) {
      const hours = mins / 60;
      return `${hours.toFixed(2).replace(/\.?0+$/, "")} hrs`;
    }
    return String(value);
  };

  return (
    <div className="movies-page">
      <UserNavbar navigate={navigate} auth={auth} onLogout={onLogout} />

      <div className="movies-content">
        <header className="movies-topbar">
          <h1>Movies</h1>
          <div className="movies-actions">
            <input
              type="search"
              placeholder="Search movies"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </header>

        <p className="movies-location">Theaters near: {city}</p>

        {loading && <p className="movies-status">Loading movies...</p>}
        {!loading && error && <p className="movies-status error">{error}</p>}
        {!loading && !error && filteredMovies.length === 0 && <p className="movies-status">No movies available</p>}

        {!loading && !error && filteredMovies.length > 0 && (
          <section className="movies-grid">
            {filteredMovies.map((movie) => (
              <article className="movie-tile" key={movie.id}>
                <img src={movie.posterUrl} alt={movie.title} />
                <div className="movie-tile-body">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre || "General"}</p>
                  <p className="movie-description">{movie.description || "No description available."}</p>
                  <span>{formatDuration(movie.duration)}</span>
                  <button type="button" onClick={() => handleBook(movie)}>
                    Book Tickets
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default Movies;
