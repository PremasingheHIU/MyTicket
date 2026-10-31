import { useState } from "react";

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "register" : "login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const response = await fetch(
        `http://localhost:5000/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (isRegister) {
        setMessage("Registration successful! You can now log in.");
        setIsRegister(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        localStorage.setItem("myticketToken", data.token);
        localStorage.setItem("myticketUser", JSON.stringify(data.user));

        onLogin(data.user);
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <a href="#home" className="brand auth-brand">
          MY<span>TICKET</span>
          <span className="brand-dot">.</span>
        </a>

        <p className="section-label">
          YOUR NEXT CINEMA EXPERIENCE
        </p>

        <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>

        <p className="auth-description">
          {isRegister
            ? "Join MyTicket and get ready for your next movie night."
            : "Log in to continue your cinema experience."}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Full Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                required
                autoComplete="name"
                placeholder="Enter your full name"
              />
            </label>
          )}

          <label>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="Enter your password"
            />
          </label>

          {message && <p className="auth-success">{message}</p>}

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account →"
                : "Log In →"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister
            ? "Already have an account?"
            : "New to MyTicket?"}{" "}

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
              setError("");
            }}
          >
            {isRegister ? "Log in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;