import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Header from "./components/Header";
import { login, forgotPassword } from "./api/endpoints";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("HOD"); // default

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await login({ email, password });
      const data = response.data;
      
      console.log("Login successful:", data);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("dept", data.department || "");
      
      if (data.role === "HOD") navigate("/hoddashboard");
      else if (data.role === "FACULTY") navigate("/facultydashboard");
      else if (data.role === "IQAC_COORDINATOR") navigate("/coordinatordashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Login Failed. Please check your credentials.");
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email address:");
    if (email) {
      try {
        await forgotPassword({ email });
        alert("Password reset link sent to your email.");
      } catch (err) {
        console.error("Forgot password error:", err);
        alert(err.response?.data?.message || "Failed to send reset link.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="left">
          <h1>IQAC</h1>
        </div>

        <div className="right">
          <div className="form-box">
            <h2>Login</h2>

            {/* 🔥 ROLE TOGGLE */}
            <div className="role-toggle">
              <div
                className="slider"
                style={{
                  transform:
                    role === "HOD"
                      ? "translateX(0%)"
                      : role === "FACULTY"
                      ? "translateX(100%)"
                      : "translateX(200%)",
                }}
              ></div>

              <button
                type="button"
                className={role === "HOD" ? "active" : ""}
                onClick={() => setRole("HOD")}
              >
                HOD
              </button>

              <button
                type="button"
                className={role === "FACULTY" ? "active" : ""}
                onClick={() => setRole("FACULTY")}
              >
                Faculty
              </button>

              <button
                type="button"
                className={role === "IQAC_COORDINATOR" ? "active" : ""}
                onClick={() => setRole("IQAC_COORDINATOR")}
              >
                Co-ordinator
              </button>
            </div>
            <input
              type="email"
              placeholder="Email"
              className="input"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="input"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="button" className="button" onClick={handleLogin}>
              Login
            </button>

            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;