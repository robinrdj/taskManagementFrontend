import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import config from "../../config";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Password cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${config.API_BASE_URL}/api/users/register`,
        { email, password }
      );
      alert(
        "Registration successful. You will be directed to the login page. Please use the same credentials to log in."
      );
      navigate("/login");
    } catch (err) {
      setError(
        "Registration failed. Please try again. Also check that you're not using an already registered email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>

      {error && <p className="register-error">{error}</p>}

      <div className="register-form">
        <label>
          Email:
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
          />
        </label>
        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="login-text">
          Already have an account?
          <button onClick={() => navigate("/login")} disabled={loading}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
