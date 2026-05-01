import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import FacultyDashboard from "./pages/FacultyDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import HODDashboard from "./pages/HODDashboard";

// function ProtectedRoute({ element }) {
//     const token = localStorage.getItem("token");
//     if (!token) {
//         window.location.href = "/";
//         return null;
//     }
//     return element;
// }
// CHANGE
// <Route path="/hoddashboard" element={<HODDashboard />} />
// <Route path="/facultydashboard" element={<FacultyDashboard />} />
// <Route path="/coordinatordashboard" element={<CoordinatorDashboard />} />

// TO
// <Route path="/hoddashboard" element={<ProtectedRoute element={<HODDashboard />} />} />
// <Route path="/facultydashboard" element={<ProtectedRoute element={<FacultyDashboard />} />} />
// <Route path="/coordinatordashboard" element={<ProtectedRoute element={<CoordinatorDashboard />} />} />



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/hoddashboard" element={<HODDashboard />} />

      <Route
        path="/facultydashboard"
        element={<FacultyDashboard />}
      />

      <Route
        path="/coordinatordashboard"
        element={<CoordinatorDashboard />}
      />
    </Routes>
  );
}

export default App;


