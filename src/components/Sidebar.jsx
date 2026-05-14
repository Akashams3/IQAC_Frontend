import { useState } from "react";

const navItems = {
  FACULTY: [
    { label: "Dashboard", icon: "🏠", key: "dashboard" },
    { label: "My Profile", icon: "👤", key: "profile" },
    { 
      label: "Academic", 
      icon: "📚", 
      key: "academic",
      isDropdown: true,
      children: [
        { label: "Lesson Plans", icon: "📋", key: "lessonplans" },
        { label: "Materials", icon: "📁", key: "materials" },
        { label: "E-Resources", icon: "🔗", key: "eresources" },
        { label: "Video Lectures", icon: "🎥", key: "videoLectures" },
        { label: "Timetable", icon: "🗓️", key: "timetable" },
        { label: "Curriculum", icon: "📚", key: "curriculum" },
      ]
    },
  ],
  HOD: [
    { label: "Dashboard", icon: "🏠", key: "dashboard" },
    { label: "My Profile", icon: "👤", key: "profile" },
    { label: "Faculty", icon: "👥", key: "faculty" },
    { 
      label: "Academic", 
      icon: "📚", 
      key: "academic",
      isDropdown: true,
      children: [
        { label: "Lesson Plans", icon: "📋", key: "lessonplans" },
        { label: "Timetable", icon: "🗓️", key: "timetable" },
        { label: "Materials", icon: "📁", key: "materials" },
        { label: "E-Resources", icon: "🔗", key: "eresources" },
        { label: "Video Lectures", icon: "🎥", key: "videoLectures" },
        { label: "Curriculum", icon: "📚", key: "curriculum" },
      ]
    },
    { 
      label: "Members", 
      icon: "👥", 
      key: "members",
      isDropdown: true,
      children: [
        { label: "CCM Members", icon: "🏛️", key: "ccm" },
        { label: "COCM Members", icon: "🏛️", key: "cocm" },
        { label: "Class Incharge", icon: "🎓", key: "incharge" },
        { label: "Class Mentor", icon: "🎓", key: "mentor" },
      ]
    },
  ],
  IQAC_COORDINATOR: [
    { label: "Dashboard", icon: "🏠", key: "dashboard" },
    { label: "My Profile", icon: "👤", key: "profile" },
    { label: "Departments", icon: "🏢", key: "departments" },
    { label: "HODs", icon: "👔", key: "hods" },
    { label: "Faculty", icon: "👥", key: "faculty" },
    { 
      label: "Academic", 
      icon: "📚", 
      key: "academic",
      isDropdown: true,
      children: [
        { label: "Lesson Plans", icon: "📋", key: "lessonplans" },
        { label: "Timetable", icon: "🗓️", key: "timetable" },
        { label: "Materials", icon: "📁", key: "materials" },
        { label: "E-Resources", icon: "🔗", key: "eresources" },
        { label: "Video Lectures", icon: "🎥", key: "videoLectures" },
        { label: "Curriculum", icon: "📚", key: "curriculum" },
      ]
    },
    { 
      label: "Members", 
      icon: "👥", 
      key: "members",
      isDropdown: true,
      children: [
        { label: "CCM Members", icon: "🏛️", key: "ccm" },
        { label: "COCM Members", icon: "🏛️", key: "cocm" },
        { label: "Class Incharge", icon: "🎓", key: "incharge" },
        { label: "Class Mentor", icon: "🎓", key: "mentor" },
      ]
    },
  ],
};

export default function Sidebar({ role, active, onSelect }) {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const collapsed = false;
  const items = navItems[role] || [];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderNavItem = (item) => {
    if (item.isDropdown) {
      const isOpen = openDropdowns[item.key];
      const hasActiveChild = item.children?.some(child => child.key === active);
      
      return (
        <div key={item.key}>
          <button
            onClick={() => toggleDropdown(item.key)}
            title={collapsed ? item.label : ""}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              width: "100%",
              padding: collapsed ? "12px 0" : "11px 20px",
              justifyContent: collapsed ? "center" : "space-between",
              background: hasActiveChild ? "rgba(240,192,64,0.08)" : "none",
              border: "none",
              borderLeft: hasActiveChild ? "3px solid #f0c040" : "3px solid transparent",
              color: hasActiveChild ? "#f0c040" : "rgba(255,255,255,0.78)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: hasActiveChild ? 600 : 400,
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </div>
            {!collapsed && <span style={{ fontSize: 12 }}>{isOpen ? "▼" : "▶"}</span>}
          </button>
          {!collapsed && isOpen && (
            <div style={{ background: "rgba(0,0,0,0.15)" }}>
              {item.children?.map(child => (
                <button
                  key={child.key}
                  onClick={() => onSelect(child.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "10px 20px 10px 40px",
                    background: active === child.key ? "rgba(240,192,64,0.15)" : "none",
                    border: "none",
                    borderLeft: active === child.key ? "3px solid #f0c040" : "3px solid transparent",
                    color: active === child.key ? "#f0c040" : "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: active === child.key ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{child.icon}</span>
                  <span>{child.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        key={item.key}
        onClick={() => onSelect(item.key)}
        title={collapsed ? item.label : ""}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
          padding: collapsed ? "12px 0" : "11px 20px",
          justifyContent: collapsed ? "center" : "flex-start",
          background: active === item.key ? "rgba(240,192,64,0.15)" : "none",
          border: "none",
          borderLeft: active === item.key ? "3px solid #f0c040" : "3px solid transparent",
          color: active === item.key ? "#f0c040" : "rgba(255,255,255,0.78)",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: active === item.key ? 600 : 400,
          transition: "all 0.15s",
        }}
      >
        <span style={{ fontSize: 17 }}>{item.icon}</span>
        {!collapsed && <span>{item.label}</span>}
      </button>
    );
  };

  return (
    <aside
      style={{
        width: collapsed ? 60 : 240,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #1a3a5c 0%, #0d2137 100%)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s",
        boxShadow: "2px 0 8px rgba(0,0,0,0.18)",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          <div style={{ color: "#f0c040", fontWeight: 700, fontSize: 16, letterSpacing: 1 }}>IQAC</div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>{role?.replace("_", " ")}</div>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {items.map(renderNavItem)}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "14px 0" : "14px 20px",
          background: "none",
          border: "none",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          color: "#ff6b6b",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        <span style={{ fontSize: 17 }}>🚪</span>
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
