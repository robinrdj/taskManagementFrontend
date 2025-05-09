import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const isLoggedIn = !!localStorage.getItem("id");
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            localStorage.getItem("id") ? <Dashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
