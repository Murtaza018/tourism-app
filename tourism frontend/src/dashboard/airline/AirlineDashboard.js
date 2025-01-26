import "./AirlineDashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { TextField } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BedIcon from "@mui/icons-material/Bed";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";

function AirlineDashboard() {
  const navigate = useNavigate();

  const [activeCard, setActiveCard] = useState(() => {
    const storedCard = localStorage.getItem("activeCard");
    if (storedCard && storedCard !== "Home") {
      return storedCard;
    }
    return "Home";
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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
          //set data in variables
        } else {
          console.log("Data not retreived!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const mainContainer = document.querySelector(".main-container-AD");
    if (mainContainer) {
      mainContainer.classList.toggle("menu-open", isOpen);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const logOut = () => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("email");
    navigate("/signin");
  };
  const HomeContent = () => {
    return (
      <div>
        <p>Hello World</p>
        <p>Hello World</p>
      </div>
    );
  };
  const RoomContent = () => {
    return (
      <div>
        <p>Hello World</p>
        <p>Hello World</p>
      </div>
    );
  };
  const ReservationContent = () => {
    return (
      <div>
        <p>Hello World</p>
        <p>Hello World</p>
      </div>
    );
  };
  const SettingContent = () => {
    return (
      <div>
        <p>Hello World</p>
        <p>Hello World</p>
      </div>
    );
  };
  const renderContent = () => {
    switch (activeCard) {
      case "Home":
        return <HomeContent />;
      case "RoomUpdates":
        return <RoomContent />;
      case "ReservationUpdates":
        return <ReservationContent />;
      case "SettingUpdates":
        return <SettingContent />;
      default:
        return null;
    }
  };
  return (
    <div>
      <h1>Hello Airline</h1>
      <div className="background-AD"></div>
      <div className="main-container-AD">
        <div className="hamburger-menu-AD">
          <button
            className={`hamburger-icon-AD ${isOpen ? "open-AD" : ""}`}
            onClick={toggleMenu}
          >
            <span
              className={`line-AD line-top-AD ${isOpen ? "open-AD" : ""}`}
            ></span>
            <span
              className={`line-AD line-middle-AD ${isOpen ? "open-AD" : ""}`}
            ></span>
            <span
              className={`line-AD line-bottom-AD ${isOpen ? "open-AD" : ""}`}
            ></span>
          </button>

          <nav className={`menu-AD ${isOpen ? "open-AD" : ""}`}>
            <ul>
              <li>
                <button
                  className="button-AD"
                  onClick={() => setActiveCard("Home")}
                >
                  <HomeIcon />
                  Home
                </button>
              </li>
              <li>
                <button
                  className="button-AD"
                  onClick={() => setActiveCard("RoomUpdates")}
                >
                  <BedIcon />
                  Rooms
                </button>
              </li>
              <li>
                <button
                  className="button-AD"
                  onClick={() => setActiveCard("ReservationUpdates")}
                >
                  <CalendarMonthIcon />
                  Reservations
                </button>
              </li>
              <li>
                <button
                  className="button-AD"
                  onClick={() => setActiveCard("SettingUpdates")}
                >
                  <SettingsIcon />
                  Settings
                </button>
              </li>
              <li>
                <button className="button-AD" onClick={logOut}>
                  <LogoutIcon />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content-AD">
          <div className="details-AD">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default AirlineDashboard;
