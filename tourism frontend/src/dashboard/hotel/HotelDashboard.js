import { useState, useEffect } from "react";
import "./HotelDashboard.css";
import { useNavigate } from "react-router-dom";

function HotelDashboard() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user_data"));
    if (storedData && storedData.first_name) {
      setFirstName(storedData.first_name);
    }
  }, []);

  const logOut = () => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("user_data");
    navigate("/signin");
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const mainContainer = document.querySelector(".main-container-HD");
    if (mainContainer) {
      mainContainer.classList.toggle("menu-open", isOpen);
    }
  }, [isOpen]);

  return (
    <div className="main-container-HD">
      <div className="hamburger-menu-HD">
        <button
          className={`hamburger-icon-HD ${isOpen ? "open-HD" : ""}`}
          onClick={toggleMenu}
        >
          <span
            className={`line-HD line-top-HD ${isOpen ? "open-HD" : ""}`}
          ></span>
          <span
            className={`line-HD line-middle-HD ${isOpen ? "open-HD" : ""}`}
          ></span>
          <span
            className={`line-HD line-bottom-HD ${isOpen ? "open-HD" : ""}`}
          ></span>
        </button>

        <nav className={`menu-HD ${isOpen ? "open-HD" : ""}`}>
          <ul>
            <li>
              <button className="button-HD">Home</button>
            </li>
            <li>
              <button className="button-HD">About</button>
            </li>
            <li>
              <button className="button-HD">Services</button>
            </li>
            <li>
              <button className="button-HD">Contact</button>
            </li>
            <li>
              <button className="button-HD" onClick={logOut}>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="content-HD">
        <p>Hello Hotel {firstName}</p>
      </div>
    </div>
  );
}

export default HotelDashboard;
