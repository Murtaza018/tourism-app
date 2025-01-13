import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./home.css";

function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [activeCard, setActiveCard] = useState(false);
  useEffect(() => {
    // Check and set loggedIn status from localStorage
    const status = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(status);
    if (status) {
      setFirstName(localStorage.getItem("first_name") || "");
    }
  }, []);

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
        </div>
      )}
    </div>
  );
}

export default Home;
