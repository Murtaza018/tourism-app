import "./TouristDashboard.css";
import { useState, useEffect } from "react";

function TouristDashboard() {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const storedFirstName = localStorage.getItem("first_name");
    if (storedFirstName) {
      setFirstName(storedFirstName);
    }
  }, []);

  return (
    <div>
      <h1>Hello {firstName}</h1>
    </div>
  );
}

export default TouristDashboard;
