import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./home.css";

function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [activeCard, setActiveCard] = useState(false);
  const [roleID, setRoleID] = useState(0);
  useEffect(() => {
    // Check and set loggedIn status from localStorage
    const status = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(status);
    if (status) {
      fetch("http://localhost:8008/Tourism/UserDataRetreival", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: localStorage.getItem("email") }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.data);
            setFirstName(data.data[0].first_name || "");
            setRoleID(data.data[0].role_ID);
          } else {
            console.log("Data not retreived!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  console.log(roleID);
  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const toggleCard = () => {
    setActiveCard(!activeCard);
  };

  const closeCard = () => {
    setActiveCard(false);
  };

  const logOut = () => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("first_name");
    window.location.reload(); // Refresh the page
  };
  const Dashboard = () => {
    if (roleID === 1) {
      navigate("/TouristDashboard");
    }
    if (roleID === 2) {
      navigate("/HotelDashboard");
    }
    if (roleID === 3) {
      navigate("/AirlineDashboard");
    }
    if (roleID === 4) {
      navigate("/GuideDashboard");
    }
    if (roleID === 5) {
      navigate("/AdminDashboard");
    }
  };
  return (
    <div>
      {loggedIn ? (
        <button onClick={toggleCard}>{firstName}</button>
      ) : (
        <div>
          <button onClick={handleSignIn}>Sign In</button>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      )}
      {loggedIn && activeCard && (
        <div className="card1">
          <button onClick={closeCard} className="button1">
            &times;
          </button>
          <button onClick={logOut}>Log Out</button>
          <button onClick={Dashboard}>Dashboard</button>
        </div>
      )}
    </div>
  );
}

export default Home;
