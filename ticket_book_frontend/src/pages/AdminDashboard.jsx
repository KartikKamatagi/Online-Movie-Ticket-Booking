import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import "./AdminDashboard.css";

const sections = ["dashboard", "movies", "theaters", "users", "bookings"];

const movieInitial = {
  title: "",
  language: "",
  duration: "",
  description: "",
  rating: "",
  imageUrl: "",
};

const theaterInitial = {
  name: "",
  location: "",
  image: "",
};

const showInitial = {
  id: null,
  theaterId: "",
  movieId: "",
  showTime: "",
};

const toDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const toApiDateTime = (value) => (value.length === 16 ? `${value}:00` : value);

function AdminDashboard({ route, navigate, logout }) {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [shows, setShows] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [movieForm, setMovieForm] = useState(movieInitial);
  const [theaterForm, setTheaterForm] = useState(theaterInitial);
  const [showForm, setShowForm] = useState(showInitial);

  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editingTheaterId, setEditingTheaterId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const pathSection = route?.path?.split("/")[2]?.toLowerCase();
  const querySection = route?.query?.get("section")?.toLowerCase();
  const requestedSection = pathSection || querySection;
  const activeSection = sections.includes(requestedSection) ? requestedSection : "dashboard";

  const stats = useMemo(
    () => [
      { label: "Movies", value: movies.length },
      { label: "Theaters", value: theaters.length },
      { label: "Users", value: users.length },
      { label: "Bookings", value: bookings.length },
    ],
    [movies.length, theaters.length, users.length, bookings.length]
  );

  const clearStatus = () => {
    setMessage("");
    setError("");
  };

  const loadDashboard = async () => {
    const [m, t, u, b] = await Promise.allSettled([
      api.adminMovies(),
      api.adminTheaters(),
      api.adminUsers(),
      api.adminBookings(),
    ]);

    setMovies(m.status === "fulfilled" ? m.value : []);
    setTheaters(t.status === "fulfilled" ? t.value : []);
    setUsers(u.status === "fulfilled" ? u.value : []);
    setBookings(b.status === "fulfilled" ? b.value : []);
  };

  const loadMovies = async () => {
    const items = await api.adminMovies();
    setMovies(items);
  };

  const loadTheatersSection = async () => {
    const [t, m] = await Promise.all([api.adminTheaters(), api.adminMovies()]);
    setTheaters(t);
    setMovies(m);
    try {
      const s = await api.adminShows();
      setShows(s);
    } catch {
      setShows([]);
    }
  };

  const loadUsers = async () => {
    const items = await api.adminUsers();
    setUsers(items);
  };

  const loadBookings = async () => {
    const items = await api.adminBookings();
    setBookings(items);
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      clearStatus();
      try {
        if (activeSection === "dashboard") {
          await loadDashboard();
        } else if (activeSection === "movies") {
          await loadMovies();
        } else if (activeSection === "theaters") {
          await loadTheatersSection();
        } else if (activeSection === "users") {
          await loadUsers();
        } else if (activeSection === "bookings") {
          await loadBookings();
        }
      } catch (err) {
        setError(err.message === "Not Found" ? "Unable to load admin data from backend APIs." : err.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [activeSection]);

  const openMovieEdit = (movie) => {
    setEditingMovieId(movie.id);
    setMovieForm({
      title: movie.title || "",
      language: movie.language || "",
      duration: movie.duration != null ? String((Number(movie.duration) / 60).toFixed(2).replace(/\.?0+$/, "")) : "",
      description: movie.description || "",
      rating: String(movie.rating ?? ""),
      imageUrl: movie.imageUrl || movie.posterUrl || "",
    });
    clearStatus();
  };

  const submitMovie = async (event) => {
    event.preventDefault();
    clearStatus();
    try {
      const payload = {
        title: movieForm.title.trim(),
        language: movieForm.language.trim(),
        duration: Math.round(Number(movieForm.duration) * 60),
        description: movieForm.description.trim(),
        rating: Number(movieForm.rating),
        imageUrl: movieForm.imageUrl.trim(),
      };
      if (editingMovieId) {
        await api.updateMovie(editingMovieId, payload);
        setMessage("Movie updated");
      } else {
        await api.addMovie(payload);
        setMessage("Movie added");
      }
      setEditingMovieId(null);
      setMovieForm(movieInitial);
      await loadMovies();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteMovie = async (id) => {
    clearStatus();
    try {
      await api.deleteMovie(id);
      setMessage("Movie deleted");
      await loadMovies();
    } catch (err) {
      setError(err.message);
    }
  };

  const openTheaterEdit = (theater) => {
    setEditingTheaterId(theater.id);
    setTheaterForm({
      name: theater.name || "",
      location: theater.location || "",
      image: theater.imageUrl || "",
    });
    clearStatus();
  };

  const submitTheater = async (event) => {
    event.preventDefault();
    clearStatus();
    try {
      const payload = {
        name: theaterForm.name.trim(),
        location: theaterForm.location.trim(),
        image: theaterForm.image.trim(),
      };
      if (editingTheaterId) {
        await api.updateTheaterDetails(editingTheaterId, payload);
        setMessage("Theater updated");
      } else {
        await api.addTheaterDetails(payload);
        setMessage("Theater added");
      }
      setEditingTheaterId(null);
      setTheaterForm(theaterInitial);
      await loadTheatersSection();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTheater = async (id) => {
    clearStatus();
    try {
      await api.deleteTheaterDetails(id);
      setMessage("Theater deleted");
      await loadTheatersSection();
    } catch (err) {
      setError(err.message);
    }
  };

  const openAddShow = (theaterId) => {
    setShowForm({ ...showInitial, theaterId: String(theaterId) });
    clearStatus();
  };

  const openEditShow = (show) => {
    setShowForm({
      id: show.id,
      theaterId: String(show.theater?.id || ""),
      movieId: String(show.movie?.id || ""),
      showTime: toDateTimeLocal(show.showTime),
    });
    clearStatus();
  };

  const submitShow = async (event) => {
    event.preventDefault();
    clearStatus();
    try {
      const payload = {
        movieId: Number(showForm.movieId),
        theaterId: Number(showForm.theaterId),
        showTime: toApiDateTime(showForm.showTime),
      };
      if (showForm.id) {
        await api.updateShow(showForm.id, payload);
        setMessage("Show updated");
      } else {
        await api.addShow(payload);
        setMessage("Show added to theater");
      }
      setShowForm(showInitial);
      await loadTheatersSection();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteShow = async (id) => {
    clearStatus();
    try {
      await api.deleteShow(id);
      setMessage("Show removed from theater");
      await loadTheatersSection();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <h2>Cinema Admin</h2>
        <button className={activeSection === "dashboard" ? "active" : ""} onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </button>
        <button className={activeSection === "movies" ? "active" : ""} onClick={() => navigate("/admin/movies")}>
          Movies
        </button>
        <button className={activeSection === "theaters" ? "active" : ""} onClick={() => navigate("/admin/theaters")}>
          Theaters
        </button>
        <button className={activeSection === "users" ? "active" : ""} onClick={() => navigate("/admin/users")}>
          Users
        </button>
        <button className={activeSection === "bookings" ? "active" : ""} onClick={() => navigate("/admin/bookings")}>
          Bookings
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage movies, theaters, users, and bookings</p>
          </div>
          <div className="admin-top-actions">
            <button onClick={() => navigate("/home")}>Home</button>
            <button onClick={logout}>Logout</button>
          </div>
        </header>

        {loading && <p className="admin-note">Loading data...</p>}
        {message && <p className="admin-note success">{message}</p>}
        {error && <p className="admin-note error">{error}</p>}

        {activeSection === "dashboard" && (
          <section className="admin-content">
            <div className="stats-grid">
              {stats.map((item) => (
                <article key={item.label} className="stat-card">
                  <p>{item.label}</p>
                  <h3>{item.value}</h3>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === "movies" && (
          <section className="admin-content">
            <h2>Movies Management</h2>
            <form className="admin-form" onSubmit={submitMovie}>
              <input
                placeholder="Title"
                value={movieForm.title}
                onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
              />
              <input
                placeholder="Language"
                value={movieForm.language}
                onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
              />
              <input
                placeholder="Duration (hours)"
                type="number"
                min="0.1"
                step="0.1"
                value={movieForm.duration}
                onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                required
              />
              <input
                placeholder="Description"
                value={movieForm.description}
                onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                required
              />
              <input
                placeholder="Rating"
                value={movieForm.rating}
                onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
              />
              <input
                placeholder="Image URL"
                value={movieForm.imageUrl}
                onChange={(e) => setMovieForm({ ...movieForm, imageUrl: e.target.value })}
              />
              <button type="submit">{editingMovieId ? "Update Movie" : "Add Movie"}</button>
            </form>

            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Poster</th>
                    <th>Title</th>
                    <th>Language</th>
                    <th>Duration</th>
                    <th>Description</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie.id}>
                      <td>
                        <img className="table-thumb" src={movie.imageUrl || movie.posterUrl} alt={movie.title} />
                      </td>
                      <td>{movie.title}</td>
                      <td>{movie.language}</td>
                      <td>{movie.duration != null ? `${(Number(movie.duration) / 60).toFixed(2).replace(/\.?0+$/, "")} hrs` : "N/A"}</td>
                      <td>{movie.description || "N/A"}</td>
                      <td>{movie.rating ?? "N/A"}</td>
                      <td>
                        <div className="row-actions">
                          <button onClick={() => openMovieEdit(movie)}>Edit</button>
                          <button className="danger" onClick={() => deleteMovie(movie.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "theaters" && (
          <section className="admin-content">
            <h2>Theater Management</h2>

            <form className="admin-form" onSubmit={submitTheater}>
              <input
                placeholder="Theater Name"
                value={theaterForm.name}
                onChange={(e) => setTheaterForm({ ...theaterForm, name: e.target.value })}
              />
              <input
                placeholder="Location"
                value={theaterForm.location}
                onChange={(e) => setTheaterForm({ ...theaterForm, location: e.target.value })}
              />
              <input
                placeholder="Image URL"
                value={theaterForm.image}
                onChange={(e) => setTheaterForm({ ...theaterForm, image: e.target.value })}
              />
              <button type="submit">{editingTheaterId ? "Update Theater" : "Add Theater"}</button>
            </form>

            <h3>Add / Edit Theater Movie Timing</h3>
            <form className="admin-form" onSubmit={submitShow}>
              <select
                value={showForm.theaterId}
                onChange={(e) => setShowForm({ ...showForm, theaterId: e.target.value })}
              >
                <option value="">Select Theater</option>
                {theaters.map((theater) => (
                  <option key={theater.id} value={theater.id}>
                    {theater.name}
                  </option>
                ))}
              </select>
              <select
                value={showForm.movieId}
                onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
              >
                <option value="">Select Movie</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={showForm.showTime}
                onChange={(e) => setShowForm({ ...showForm, showTime: e.target.value })}
              />
              <button type="submit">{showForm.id ? "Update Timing" : "Add Timing"}</button>
            </form>

            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Theater</th>
                    <th>Location</th>
                    <th>Actions</th>
                    <th>Current Movie Timings</th>
                  </tr>
                </thead>
                <tbody>
                  {theaters.map((theater) => {
                    const theaterShows = shows.filter((show) => show.theater?.id === theater.id);
                    return (
                      <tr key={theater.id}>
                        <td>
                          <img className="table-thumb" src={theater.imageUrl} alt={theater.name} />
                        </td>
                        <td>{theater.name}</td>
                        <td>{theater.location}</td>
                        <td>
                          <div className="row-actions">
                            <button onClick={() => openTheaterEdit(theater)}>Edit</button>
                            <button className="danger" onClick={() => deleteTheater(theater.id)}>Delete</button>
                            <button className="subtle" onClick={() => openAddShow(theater.id)}>Add Timing</button>
                          </div>
                        </td>
                        <td>
                          <div className="show-list">
                            {theaterShows.length === 0 && <p className="muted">No timings</p>}
                            {theaterShows.map((show) => (
                              <div key={show.id} className="show-row">
                                <span>{show.movie?.title}</span>
                                <span>{new Date(show.showTime).toLocaleString()}</span>
                                <div className="row-actions">
                                  <button onClick={() => openEditShow(show)}>Edit</button>
                                  <button className="danger" onClick={() => deleteShow(show.id)}>Delete</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeSection === "users" && (
          <section className="admin-content">
            <h2>Registered Users</h2>
            <div className="list-grid">
              {users.map((user) => (
                <article key={user.id} className="list-card">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p>{user.role}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeSection === "bookings" && (
          <section className="admin-content">
            <h2>Booking History</h2>
            <div className="list-grid">
              {bookings.map((booking) => (
                <article key={booking.id} className="list-card">
                  <h3>{booking.show?.movie?.title}</h3>
                  <p>User: {booking.user?.name}</p>
                  <p>Theater: {booking.show?.theater?.name}</p>
                  <p>Show: {booking.show?.showTime ? new Date(booking.show.showTime).toLocaleString() : "N/A"}</p>
                  <p>Amount: Rs {booking.totalAmount}</p>
                  <p>Status: {booking.paymentStatus}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
