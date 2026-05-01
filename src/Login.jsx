import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Header from "./components/Header";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("HOD"); // default

  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const response = await fetch("http://localhost:8080/iqac/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    });

    console.log("STATUS:", response.status);

    const data = await response.json();
    console.log("RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", data.token);
    // ADD these after localStorage.setItem("token", data.token)
    // localStorage.setItem("role", data.role);
    // localStorage.setItem("dept", data.department);
    localStorage.setItem("role", data.role);
    localStorage.setItem("dept", data.department);


    if (data.role === "HOD") navigate("/hoddashboard");
    else if (data.role === "FACULTY") navigate("/facultydashboard");
    else if (data.role === "IQAC_COORDINATOR") navigate("/coordinatordashboard");

  } catch (err) {
    console.error(err);
    alert("Login Failed");
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
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;