import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("REGISTER BUTTON CLICKED");

    setError("");
    setSuccess("");

    // ===============================
    // FRONTEND VALIDATION
    // ===============================

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // ===============================
      // API URL
      // ===============================

      const apiUrl = import.meta.env.VITE_API_URL;

      console.log("API URL:", apiUrl);

      // ===============================
      // DATA TO SEND
      // ===============================

      const userData = {
        name: name.trim(),
        email: email.trim(),
        password: password,
      };

      console.log("DATA BEING SENT:", userData);

      // ===============================
      // SEND REQUEST
      // ===============================

      const response = await fetch(
        `${apiUrl}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(userData),
        }
      );

      console.log("STATUS:", response.status);

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      // ===============================
      // ERROR RESPONSE
      // ===============================

      if (!response.ok) {
        setError(
          data.message || "Registration failed."
        );

        return;
      }

      // ===============================
      // SUCCESS
      // ===============================

      setSuccess(
        "Account created successfully! Redirecting..."
      );

      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("REGISTER FETCH ERROR:", error);

      setError(
        "Cannot connect to backend. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <div className="auth-icon">
            ✓
          </div>

          <h1>Create Account</h1>

          <p>
            Join Pollify and start creating and
            voting in polls.
          </p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="auth-footer">
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;