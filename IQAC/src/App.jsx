import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Hoddashboard from "./pages/Hoddashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/hoddashboard" element={<Hoddashboard />} />
    </Routes>
  );
}

export default App;