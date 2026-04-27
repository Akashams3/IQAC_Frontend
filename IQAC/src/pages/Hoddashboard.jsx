import Header from "../components/Header";
import "./Hoddashboard.css";

function Hoddashboard() {
  const departments = [
    "CSE",
    "CSBS",
    "CCE",
    "AIML",
    "AIDS",
    "ECE",
    "VLSI",
    "MECH",
    "BIOTECH",
    "H&S"
  ];

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <h2 className="title">HOD Dashboard</h2>

        <div className="card-grid">
          {departments.map((dept, index) => (
            <div key={index} className="card">
              {dept}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Hoddashboard;