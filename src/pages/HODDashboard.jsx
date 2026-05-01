import "./hoddashboard.css";
import { useState } from "react";
import Header from "../components/Header";

function HODDashboard() {
  const [active, setActive] = useState("dashboard");
  const [openMenus, setOpenMenus] = useState({});

  // 🔥 FULL MENU STRUCTURE (3 LEVELS)
  const menuItems = [
    { name: "Dashboard" },

    {
      name: "Academics",
      subMenu: [
        {
          name: "Planning",
          subMenu: [
            "Time Table",
            "Class Incharge",
            "Class Mentors",
            "Lesson Plan",
            "Curriculum & Syllabus",
            "Material & Notes",
            "COCM - Members",
            "CCM - Members",
            "E-Resource",
            "Video Lectures"
          ]
        },
        {
          name: "Teaching Schedule",
          subMenu: ["Model Demo", "E-Resources"]
        },
        {
          name: "Assessment",
          subMenu: [
            "Assignment",
            "CAT Mark",
            "Quiz",
            "End Semester Mark"
          ]
        },
        {
          name: "Projects"
        }
      ]
    },

    { name: "Research" },
    { name: "Faculty Information" },
    { name: "Faculty Contribution" },
    { name: "Student Support" },
    { name: "Facilities" },
    { name: "Dept Administration" },
    { name: "Best Practices" },
    { name: "Events" }
  ];

  // 🔹 TOGGLE MENU
  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 🔹 RECURSIVE MENU RENDER (IMPORTANT)
  const renderMenu = (items, level = 0) => {
    return items.map((item, index) => {
      const key = `${item.name}-${level}-${index}`;
      const isOpen = openMenus[key];

      return (
        <div key={key}>
          
          {/* MENU ITEM */}
          <div
            className={`menu-item level-${level} ${
              active === item.name.toLowerCase() ? "active" : ""
            }`}
            onClick={() => {
              if (item.subMenu) {
                toggleMenu(key);
              } else {
                setActive(item.name.toLowerCase());
              }
            }}
          >
            {item.name}
          </div>

          {/* SUB MENU */}
          {item.subMenu && isOpen && (
            <div className="submenu">
              {item.subMenu.map((sub, i) =>
                typeof sub === "string" ? (
                  <div
                    key={i}
                    className={`menu-item level-${level + 1} ${
                      active === sub.toLowerCase() ? "active-sub" : ""
                    }`}
                    onClick={() => setActive(sub.toLowerCase())}
                  >
                    {sub}
                  </div>
                ) : (
                  renderMenu([sub], level + 1)
                )
              )}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <Header />

      <div className="hod-layout">
        
        {/* 🔹 SIDEBAR */}
        <div className="sidebar">
          <h2 className="logo">HOD Panel</h2>
          {renderMenu(menuItems)}
        </div>

        {/* 🔹 MAIN CONTENT */}
        <div className="main-content">
          <h1 className="title">{active.toUpperCase()}</h1>

          {active === "dashboard" && (
            <div className="cards">
              <div className="card">
                <h3>Total Reports</h3>
                <p>45</p>
              </div>
              <div className="card">
                <h3>Pending</h3>
                <p>12</p>
              </div>
              <div className="card">
                <h3>Approved</h3>
                <p>33</p>
              </div>
            </div>
          )}

          {active !== "dashboard" && (
            <div className="content-box">
              <h2>{active}</h2>
              <p>Content for {active} goes here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HODDashboard;