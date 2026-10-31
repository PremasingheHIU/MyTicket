import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./Auth";
import AdminDashboard from "./AdminDashboard";

function App() {
    const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("myticketUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [search, setSearch] = useState("");
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  // My Bookings state
const [showMyBookings, setShowMyBookings] = useState(false);
const [bookings, setBookings] = useState([]);
const [bookingsLoading, setBookingsLoading] = useState(false);
const [bookingsError, setBookingsError] = useState("");

  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("10:00");
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/movies");

        if (!response.ok) {
          throw new Error("Failed to retrieve movies.");
        }

        const data = await response.json();

        setMovies(data);
      } catch (err) {
        setError("Unable to load movies. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);
  
// Fetch bookings belonging to the logged-in user
const fetchBookings = async () => {
    setBookingsLoading(true);
    setBookingsError("");

    try {
        const token = localStorage.getItem("myticketToken");

        const response = await fetch(
            "http://localhost:5000/api/bookings",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to retrieve your bookings."
            );
        }

        setBookings(data);
    } catch (error) {
        setBookingsError(
            error.message || "Unable to load your bookings."
        );
    } finally {
        setBookingsLoading(false);
    }
};

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

    if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="app">
      {showAdminDashboard && user.role === "admin" ? (
            <AdminDashboard
    movies={movies}
    onClose={() => setShowAdminDashboard(false)}
    onMovieAdded={async () => {
        const response = await fetch(
            "http://localhost:5000/api/movies"
        );

        if (!response.ok) {
            throw new Error("Failed to refresh movies.");
        }

        const data = await response.json();
        setMovies(data);
    }}
/>
        ) : (
            <>
      <header className="navbar">
        <a href="#home" className="brand">
          MY<span>TICKET</span>
          <span className="brand-dot">.</span>
        </a>

        <nav className="nav-links">
          <a href="#home" className="active">
            Home
          </a>
          <a href="#movies">Movies</a>
          <a href="#about">About</a>
        </nav>

               <div className="nav-actions">
                {user.role === "admin" && (
    <button
        type="button"
        className="nav-button"
        onClick={() => setShowAdminDashboard(true)}
    >
        Admin Dashboard
    </button>
)}
          <a href="#movies" className="nav-button">
            Book Tickets <span>↗</span>
          </a>

          
<button
    type="button"
    className="nav-button"
    onClick={() => {
        setShowMyBookings(!showMyBookings);
        setShowAdminDashboard(false);

        if (!showMyBookings) {
            fetchBookings();
        }
    }}
>
    {showMyBookings ? "Back to Home" : "My Bookings"}
</button>


          <button
            type="button"
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("myticketToken");
              localStorage.removeItem("myticketUser");
              setUser(null);
            }}
          >
            Log Out
          </button>
        </div>
      </header>

      <main>
{showMyBookings ? (
    <section className="movies-section" id="my-bookings">
        <div className="section-heading">
            <div>
                <p className="section-label">YOUR ACCOUNT</p>
                <h2>My <span>Bookings.</span></h2>
                <p className="section-description">
                    View your movie tickets and booking details.
                </p>
            </div>
        </div>

        {bookingsLoading && (
            <p className="status-message">
                Loading your bookings...
            </p>
        )}

        {bookingsError && (
            <p className="status-message error-message">
                {bookingsError}
            </p>
        )}

        {!bookingsLoading &&
            !bookingsError &&
            bookings.length === 0 && (
                <div className="empty-state">
                    <h3>No bookings yet</h3>
                    <p>
                        You haven't booked any movie tickets yet.
                        Explore the movies and book your first ticket!
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => setShowMyBookings(false)}
                    >
                        Explore Movies →
                    </button>
                </div>
            )}

        {!bookingsLoading &&
            !bookingsError &&
            bookings.length > 0 && (
                <div className="movie-grid">
                    {bookings.map((booking) => (
                        <article
                            className="movie-card"
                            key={booking._id}
                        >
                            <div className="movie-info">
                                <h3>
                                    {booking.movie?.title ||
                                        "Movie unavailable"}
                                </h3>

                                <p className="movie-genre">
                                    {booking.movie?.genre || ""}
                                </p>

                                <p>
                                    <strong>Show Date:</strong>{" "}
                                    {new Date(
                                        booking.showDate
                                    ).toLocaleDateString()}
                                </p>

                                <p>
                                    <strong>Show Time:</strong>{" "}
                                    {booking.showTime}
                                </p>

                                <p>
                                    <strong>Tickets:</strong>{" "}
                                    {booking.ticketCount}
                                </p>

                                <p>
                                    <strong>Total Price:</strong>{" "}
                                    LKR{" "}
                                    {Number(
                                        booking.totalPrice
                                    ).toLocaleString("en-US")}
                                </p>

                                <p>
                                    <strong>Booking Date:</strong>{" "}
                                    {new Date(
                                        booking.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <p>
                                    <strong>Booking ID:</strong>{" "}
                                    {booking._id}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
    </section>
) : (
  <>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">
              <span className="live-dot"></span>
              YOUR NEXT CINEMA EXPERIENCE
            </p>

            <h1>
              Every Movie.
              <br />
              <span>One Ticket.</span>
            </h1>

            <p className="hero-description">
              Discover incredible stories, explore your favourite movies,
              and book your next cinema experience with MyTicket.
            </p>

            <div className="hero-actions">
              <a href="#movies" className="primary-button">
                Explore Movies <span>→</span>
              </a>

              <a href="#about" className="secondary-button">
                Discover MyTicket
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>01</strong>
                <span>Discover</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Choose</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Book</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow"></div>

          <div className="hero-poster poster-back">
            <div className="poster-placeholder">
            <span>MYTICKET</span>
            <p>Discover your next movie</p>
          </div>
</div>

           <div className="hero-poster poster-front">
  {movies.length > 0 && (
    <>
      <img
        src={movies[0].poster}
        alt={`${movies[0].title} movie poster`}
      />

      <div className="featured-label">
        <span>
          {movies[0].rating ? `★ ${movies[0].rating}` : "NOW SHOWING"}
        </span>

        <div>
          <strong>{movies[0].title}</strong>
          <small>Featured movie</small>
        </div>
      </div>
    </>
  )}

  {movies.length === 0 && (
    <div className="poster-placeholder">
      <span>MYTICKET</span>
      <p>Your next cinema experience</p>
    </div>
  )}
</div>

            <div className="floating-note">
              <span className="ticket-icon">▤</span>
              <div>
                <strong>Your next movie awaits</strong>
                <small>Find your next favourite</small>
              </div>
            </div>
          </div>
        </section>

        <section className="movies-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="section-label">NOW SHOWING</p>
              <h2>Find your next <span>favourite.</span></h2>
              <p className="section-description">
                Great stories deserve the big screen.
              </p>
            </div>

            <div className="movie-search">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search movies"
              />
            </div>
          </div>

{loading && <p className="status-message">Loading movies...</p>}

{error && <p className="status-message error-message">{error}</p>}

{!loading && !error && movies.length === 0 && (
  <p className="status-message">No movies are currently available.</p>
)}

<div className="movie-grid">
  {!loading &&
    !error &&
    filteredMovies.map((movie) => (
      <article className="movie-card" key={movie._id}>
        <div className="movie-poster">
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
          />

          {movie.rating && (
            <span className="rating">★ {movie.rating}</span>
          )}
        </div>

        <div className="movie-info">
          <div className="movie-title-row">
            <h3>{movie.title}</h3>
            <span className="movie-duration">
              {Math.floor(movie.duration / 60)}h{" "}
              {movie.duration % 60}m
            </span>
          </div>

          <p className="movie-genre">{movie.genre}</p>

          <div className="movie-card-bottom">
            <div className="movie-price">
              <small>Ticket price</small>
              <strong>
                LKR {Number(movie.ticketPrice).toLocaleString("en-US")}
              </strong>
            </div>

           <button
              type="button"
              className="movie-book-button"
              onClick={() => setSelectedMovie(movie)}
              aria-label={`Book tickets for ${movie.title}`}>
              Book Now →
           </button>
          </div>
        </div>
      </article>
    ))}
</div>

          {filteredMovies.length === 0 && (
            <div className="empty-state">
              <span>⌕</span>
              <h3>No movies found</h3>
              <p>Try searching for another movie title.</p>
            </div>
          )}
        </section>

       <section className="booking-banner" id="booking-info">
  <div>
    <p className="section-label">YOUR MOVIE NIGHT STARTS HERE</p>

    <h2>
      {selectedMovie
        ? `Book ${selectedMovie.title}`
        : "Ready for the next show?"}
    </h2>

    <p>
      {selectedMovie
        ? `Ticket price: LKR ${Number(
            selectedMovie.ticketPrice
          ).toLocaleString("en-US")}`
        : "Choose a movie above to start your booking."}
    </p>
  </div>

  {selectedMovie ? (
    <form
      className="booking-form"
      onSubmit={async (event) => {
        event.preventDefault();

        setBookingMessage("");
        setBookingError("");
        setBookingLoading(true);

        try {
          const response = await fetch(
            "http://localhost:5000/api/bookings",
            {
              method: "POST",
              headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("myticketToken")}`,
},
              body: JSON.stringify({
                customerName,
                customerEmail,
                movie: selectedMovie._id,
                showDate,
                showTime,
                ticketCount: Number(ticketCount),
                totalPrice:
                  Number(selectedMovie.ticketPrice) *
                  Number(ticketCount),
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Booking failed.");
          }

        setBookingMessage(
  `Booking successful! Your booking ID is ${data.booking._id}.`
);

          setCustomerName("");
          setCustomerEmail("");
          setShowDate("");
          setShowTime("10:00");
          setTicketCount(1);
        } catch (error) {
          setBookingError(
            error.message || "Unable to complete your booking."
          );
        } finally {
          setBookingLoading(false);
        }
      }}
    >
      <label>
        Customer Name
        <input
          type="text"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          minLength={2}
          required
        />
      </label>

      <label>
        Email Address
        <input
          type="email"
          value={customerEmail}
          onChange={(event) => setCustomerEmail(event.target.value)}
          required
        />
      </label>

      <label>
        Show Date
        <input
          type="date"
          value={showDate}
          onChange={(event) => setShowDate(event.target.value)}
          min={new Date().toLocaleDateString("en-CA")}
          required
        />
      </label>

      <label>
        Show Time
        <select
          value={showTime}
          onChange={(event) => setShowTime(event.target.value)}
          required
        >
          <option value="10:00">10:00 AM</option>
          <option value="13:00">1:00 PM</option>
          <option value="16:00">4:00 PM</option>
          <option value="19:00">7:00 PM</option>
        </select>
      </label>

      <label>
        Number of Tickets
        <input
          type="number"
          min="1"
          max="10"
          value={ticketCount}
          onChange={(event) => setTicketCount(event.target.value)}
          required
        />
      </label>

      <p className="booking-total">
        Total: LKR{" "}
        {(
          Number(selectedMovie.ticketPrice) * Number(ticketCount || 0)
        ).toLocaleString("en-US")}
      </p>

      <button
        type="submit"
        className="primary-button"
        disabled={bookingLoading}
      >
        {bookingLoading ? "Booking..." : "Confirm Booking →"}
      </button>

      {bookingMessage && (
        <p className="booking-success">{bookingMessage}</p>
      )}

      {bookingError && (
        <p className="booking-error">{bookingError}</p>
      )}
    </form>
  ) : (
    <a href="#movies" className="primary-button">
      Browse Movies <span>→</span>
    </a>
  )}
</section>

        <section className="about-section" id="about">
          <p className="section-label">ABOUT MYTICKET</p>
          <h2>Cinema plans, made <span>simple.</span></h2>
          <p>
            MyTicket is a movie ticket booking application designed to help
            users discover movies and manage their ticket bookings in one place.
          </p>
        </section>
        </>
        )}
      </main>

      <footer className="footer">
        <a href="#home" className="brand">
          MY<span>TICKET</span>
          <span className="brand-dot">.</span>
        </a>

        <p>Made for movie lovers.</p>

        <span>MyTicket © 2026</span>
      </footer>
              </>
        )}
    </div>
  );
}

export default App; 