import React from "react";
import logo from "../static/ritlogo.png"; 

function Header() {
  return (
    <div style={styles.header}>
      { <img src={logo} alt=" Logo" style={styles.logo} /> }
      <h2 style={styles.title}>INTERNAL QUALITY ASSURANCE CELL</h2>
    </div>
  );
}

const styles = {
  header: {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",  // center everything
    position: "relative",      // needed for logo positioning
    padding: "10px",
    background: "#2563eb",
    color: "white",
    height: "80px",
    width: "100%",
  },
  logo: {
    position: "absolute",
    left: "1%",   // fix logo to left
    width: "15%",
    height: "80px",
    marginRight: "15px",

  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default Header;
