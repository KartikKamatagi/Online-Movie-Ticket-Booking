import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import UserNavbar from "../components/UserNavbar";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Home.css";

const promoSlides = [
  {
    id: "promo-weekend",
    title: "Weekend Movie Carnival",
    subtitle: "Get up to 30% off on premium recliner seats for evening shows.",
    poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=80",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=80",
    cta: "Book Tickets",
    tag: "Limited Time Offer",
  },
  {
    id: "promo-imax",
    title: "IMAX Fan Fest",
    subtitle: "Experience larger-than-life visuals with curated blockbuster marathons.",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=900&q=80",
    backdrop: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1800&q=80",
    cta: "Explore Shows",
    tag: "IMAX Special",
  },
  {
    id: "promo-family",
    title: "Family Movie Mornings",
    subtitle: "Special combo pricing on weekend morning screenings for families.",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80",
    backdrop: "https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=1800&q=80",
    cta: "Book Now",
    tag: "Family Deal",
  },
];

function Home({ auth, onLogout }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [userLocation, setUserLocation] = useState("Detecting location...");
  const [movies, setMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [movieError, setMovieError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const setLocationSafely = (value) => {
      if (isMounted) setUserLocation(value);
    };

    const setLocationFromCoords = async (latitude, longitude) => {
      const lat = latitude.toFixed(2);
      const lng = longitude.toFixed(2);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const address = data?.address || {};
        const city = address.city || address.town || address.village || address.county;
        const state = address.state;
        const country = address.country_code ? address.country_code.toUpperCase() : null;
        if (city) {
          localStorage.setItem("user_city", city);
        }
        const parts = [city, state, country].filter(Boolean);
        setLocationSafely(parts.length ? parts.join(", ") : `${lat}, ${lng}`);
      } catch {
        setLocationSafely(`${lat}, ${lng}`);
      }
    };

    const setLocationFromIp = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        if (data?.city) {
          localStorage.setItem("user_city", data.city);
        }
        const parts = [data?.city, data?.region, data?.country_code].filter(Boolean);
        setLocationSafely(parts.length ? parts.join(", ") : "Location unavailable");
      } catch {
        setLocationSafely("Location unavailable");
      }
    };

    if (!navigator.geolocation) {
      setLocationFromIp();
      return () => {
        isMounted = false;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationFromCoords(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setLocationFromIp();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const loadMovies = async () => {
      setLoadingMovies(true);
      setMovieError("");
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
          setMovieError(err.message);
        }
      } finally {
        if (active) {
          setLoadingMovies(false);
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

  const heroSlides = useMemo(() => {
    const movieSlides = movies.slice(0, 4).map((movie) => ({
      id: `movie-${movie.id}`,
      title: movie.title || "Featured Movie",
      subtitle: movie.description || "Book your seats now for the latest blockbuster experience.",
      poster: movie.posterUrl || "https://via.placeholder.com/420x620?text=Movie",
      backdrop: movie.posterUrl || "https://via.placeholder.com/1600x900?text=Movie+Banner",
      cta: "Book Tickets",
      movieId: movie.id,
      tag: `${movie.language || "Multi-language"} • ${movie.genre || "General"}`,
    }));

    return movieSlides.length > 0
      ? [...movieSlides, ...promoSlides].slice(0, 6)
      : promoSlides;
  }, [movies]);

  const formatDuration = (value) => {
    if (value == null || value === "") return "N/A";
    const mins = Number(value);
    if (!Number.isNaN(mins)) return `${mins} mins`;
    return String(value);
  };

  const handleBookNow = (movieId) => {
    navigate(`/theaters?movieId=${movieId}`);
  };

  const handleHeroAction = (slide) => {
    if (slide.movieId) {
      navigate(`/theaters?movieId=${slide.movieId}&movieTitle=${encodeURIComponent(slide.title || "")}`);
      return;
    }
    navigate("/movies");
  };

  return (
    <div className="home-page">
      <UserNavbar navigate={navigate} auth={auth} onLogout={onLogout} />

      <section className="home-toolbar">
        <div className="home-location" title="Current location">
          {userLocation}
        </div>
        <input
          className="home-search"
          type="search"
          placeholder="Search movies..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search movies"
        />
      </section>

      <section className="home-hero" aria-label="Featured promotions">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          className="home-hero-swiper"
          loop={heroSlides.length > 1}
          speed={700}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <article className="hero-slide" style={{ backgroundImage: `url(${slide.backdrop})` }}>
                <div className="hero-slide-overlay" />
                <div className="hero-slide-inner">
                  <div className="hero-media">
                    <img src={slide.poster} alt={slide.title} loading="lazy" />
                  </div>
                  <div className="hero-copy">
                    <p className="hero-kicker">{slide.tag || "Now Screening"}</p>
                    <h1>{slide.title}</h1>
                    <p>{slide.subtitle}</p>
                    <button className="book-btn" type="button" onClick={() => handleHeroAction(slide)}>
                      {slide.cta || "Book Now"}
                    </button>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="movies-section">
        <div className="section-heading">
          <h2>Now Playing</h2>
          <p>Movies loaded live from database</p>
        </div>

        {loadingMovies && <p className="home-status">Loading movies...</p>}
        {!loadingMovies && movieError && <p className="home-status error">{movieError}</p>}
        {!loadingMovies && !movieError && filteredMovies.length === 0 && (
          <p className="home-status">No movies available</p>
        )}

        {!loadingMovies && !movieError && filteredMovies.length > 0 && (
          <div className="movie-grid">
            {filteredMovies.map((movie) => (
              <article className="movie-card" key={movie.id}>
                <div className="movie-poster-wrap">
                  <img src={movie.posterUrl} alt={movie.title} className="movie-poster" loading="lazy" />
                </div>
                <div className="movie-meta">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre || "General"}</p>
                  <span>{formatDuration(movie.duration)}</span>
                  <button className="quick-book-btn visible" type="button" onClick={() => handleBookNow(movie.id)}>
                    Book Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
