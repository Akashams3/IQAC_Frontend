import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Header from "./components/Header";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // ✅ correct

  const handleLogin = () => {
    if (email === "hod@gmail.com" && password === "1234") {
      navigate("/hoddashboard"); // ✅ correct route
    } else {
      alert("Invalid Credentials");
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

            <button className="button" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;