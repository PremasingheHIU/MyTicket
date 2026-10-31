
import { useState } from "react";

function AdminDashboard({ movies, onClose, onMovieAdded }) {
    const [activeTab, setActiveTab] = useState("movies");
    const [showForm, setShowForm] = useState(false);
    const [editingMovieId, setEditingMovieId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        genre: "",
        duration: "",
        description: "",
        poster: "",
        ticketPrice: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleEdit = (movie) => {
    setEditingMovieId(movie._id);

    setFormData({
        title: movie.title || "",
        genre: movie.genre || "",
        duration: movie.duration ?? "",
        description: movie.description || "",
        poster: movie.poster || "",
        ticketPrice: movie.ticketPrice ?? ""
    });

    setShowForm(true);
    setMessage("");
    setError("");
};

   const handleDelete = async (movie) => {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${movie.title}"?`
    );

    if (!confirmed) {
        return;
    }

    setMessage("");
    setError("");

    try {
        const token = localStorage.getItem("myticketToken");

        const response = await fetch(
            `http://localhost:5000/api/movies/${movie._id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to delete movie."
            );
        }

        setMessage("Movie deleted successfully!");

        // Close the edit form if the deleted movie was being edited
        if (editingMovieId === movie._id) {
            setEditingMovieId(null);
            setShowForm(false);
        }

        // Refresh the movie list
        await onMovieAdded();
    } catch (err) {
        setError(err.message || "Something went wrong.");
    }
}; 

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {
            const token = localStorage.getItem("myticketToken");

            const isEditing = editingMovieId !== null;

const url = isEditing
    ? `http://localhost:5000/api/movies/${editingMovieId}`
    : "http://localhost:5000/api/movies";

const response = await fetch(url, {
    method: isEditing ? "PUT" : "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
        ...formData,
        duration: Number(formData.duration),
        ticketPrice: Number(formData.ticketPrice)
    })
});

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to create movie."
                );
            }

            setMessage(
    isEditing
        ? "Movie updated successfully!"
        : "Movie added successfully!"
);

            setFormData({
                title: "",
                genre: "",
                duration: "",
                description: "",
                poster: "",
                ticketPrice: ""
            });

            setShowForm(false);
            setEditingMovieId(null);

            // Update the movie list in the parent component
            await onMovieAdded();
        } catch (err) {
            setError(err.message || "Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <p className="section-label">
                        MYTICKET MANAGEMENT
                    </p>

                    <h2>Admin Dashboard</h2>

                    <p>Manage your movies and ticket prices.</p>
                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onClose}
                >
                    Back to Home
                </button>
            </div>

            <div className="admin-tabs">
                <button
                    type="button"
                    className={activeTab === "movies" ? "active" : ""}
                    onClick={() => setActiveTab("movies")}
                >
                    Manage Movies
                </button>
            </div>

            {activeTab === "movies" && (
                <div className="admin-movie-section">
                    <div className="admin-section-heading">
                        <h3>Existing Movies</h3>

                        <span>{movies.length} movies</span>
                    </div>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => {
                            setShowForm(!showForm);
                            setMessage("");
                            setError("");
                        }}
                    >
                        {showForm ? "Cancel" : "+ Add Movie"}
                    </button>

                    {message && (
                        <p className="booking-success">{message}</p>
                    )}

                    {error && (
                        <p className="booking-error">{error}</p>
                    )}

                    {showForm && (
                        <form
                            className="admin-movie-form"
                            onSubmit={handleSubmit}
                        >
                            <h3>{editingMovieId ? "Edit Movie" : "Add a New Movie"}</h3>

                            <label>
                                Movie Title
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Genre
                                <input
                                    type="text"
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Duration (minutes)
                                <input
                                    type="number"
                                    name="duration"
                                    min="1"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label>
                                Description
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                />
                            </label>

                            <label>
                                Poster Image URL (optional)
                                <input
                                    type="url"
                                    name="poster"
                                    value={formData.poster}
                                    onChange={handleChange}
                                    placeholder="https://example.com/poster.jpg"
                                />
                            </label>

                            <label>
                                Ticket Price (LKR)
                                <input
                                    type="number"
                                    name="ticketPrice"
                                    min="0.01"
                                    step="0.01"
                                    value={formData.ticketPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={saving}
                            >
                               {saving
    ? (editingMovieId ? "Saving Changes..." : "Adding Movie...")
    : (editingMovieId ? "Save Changes" : "Save Movie")}
                            </button>
                        </form>
                    )}

                    <div className="admin-movie-list">
                        {movies.map((movie) => (
                         <div className="admin-movie-item" key={movie._id}>
    <div className="admin-movie-details">
        <strong>{movie.title}</strong>
        <p>{movie.genre}</p>
        <span>
            LKR {Number(movie.ticketPrice).toLocaleString("en-US")}
        </span>
    </div>

    <button
        type="button"
        className="admin-edit-button"
        onClick={() => handleEdit(movie)}
    >
        Edit Movie
    </button>
    <button
    type="button"
    className="admin-delete-button"
    onClick={() => handleDelete(movie)}
>
    Delete Movie
</button>
</div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default AdminDashboard;
