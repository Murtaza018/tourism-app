import "./AirlineDashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, TextField } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FlightIcon from "@mui/icons-material/Flight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

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
  const [AccountData, setAccountData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country: "",
    city: "",
    address: "",
    phone: "",
    age: "",
    password: "",
  });

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
          setAccountData(() => ({
            first_name: data.data[0].first_name,
            last_name: data.data[0].last_name,
            age: data.data[0].age,
            phone: data.data[0].phone,
            email: data.data[0].email,
            address: data.data[0].address,
            country: data.data[0].country,
            city: data.data[0].city,
            password: data.data[0].password,
          }));
          console.log("Account Data:", AccountData);
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
        <h2 className="heading-AD">
          <strong>Details</strong>
        </h2>
        <p className="data-AD">
          <strong>First Name: {AccountData.first_name}</strong>
        </p>
        <p className="data-AD">
          <strong>Last Name: {AccountData.last_name}</strong>
        </p>
        <p className="data-AD">
          <strong>Email: {AccountData.email}</strong>
        </p>
        <p className="data-AD">
          <strong>Age: {AccountData.age}</strong>
        </p>
        <p className="data-AD">
          <strong>Phone: {AccountData.phone}</strong>
        </p>
        <p className="data-AD">
          <strong>Country: {AccountData.country}</strong>
        </p>
        <p className="data-AD">
          <strong>City: {AccountData.city}</strong>
        </p>
        <p className="data-AD">
          <strong>Address: {AccountData.address}</strong>
        </p>
        <p className="data-AD">
          <strong>Password: {"*".repeat(AccountData.password.length)}</strong>
        </p>
      </div>
    );
  };
  const FlightButton = styled(Button)(({ theme }) => ({
    backgroundColor: "transparent",
    border: "2px solid black",
    color: "black",
    fontSize: "1em",
    padding: "5px 10px",
    cursor: "pointer",
    transition: "transform 0.5s ease, color 0.5s ease, border-color 0.5s ease",
    marginTop: "5px",
    "&:hover": {
      transform: "scale(1.2)",
    },
    "&:nth-of-type(1):hover": {
      color: "blue",
      borderColor: "blue",
    },
    "&:nth-of-type(2):hover": {
      color: "green",
      borderColor: "green",
    },
    "&:nth-of-type(3):hover": {
      color: "red",
      borderColor: "red",
    },
  }));
  const [openFlightCard, setOpenFlightCard] = useState(false);

  const handleClickOpenFlightCard = () => {
    setOpenFlightCard(true);
  };

  const handleCloseFlightCard = () => {
    setOpenFlightCard(false);
  };
  const FlightCard = ({ open, onClose }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <Button className="close-button-AD" onClick={onClose}>
          <CloseIcon />
        </Button>
        <Card className="flight-card-AD">
          <DialogTitle>Add Flight</DialogTitle>
          <TextField
            variant="outlined"
            label="First Name"
            margin="dense"
            required
            //fullWidth
            defaultValue={AccountData.first_name}
          />
        </Card>
      </Dialog>
    );
  };
  const FlightContent = () => {
    return (
      <div>
        <div className="flight-content-AD">
          <h2 className="heading-AD">
            <strong>Flights</strong>
          </h2>
          <div className="flight-options-container-AD">
            <FlightButton
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleClickOpenFlightCard}
            >
              Add Flight
            </FlightButton>
            <FlightButton variant="outlined" startIcon={<EditIcon />}>
              Edit Flight
            </FlightButton>
            <FlightButton variant="outlined" startIcon={<DeleteIcon />}>
              Delete Flight
            </FlightButton>
          </div>
        </div>
        <FlightCard open={openFlightCard} onClose={handleCloseFlightCard} />
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
  const FeedbackContent = () => {
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
      case "FlightUpdates":
        return <FlightContent />;
      case "ReservationUpdates":
        return <ReservationContent />;
      case "Feedback":
        return <FeedbackContent />;
      case "SettingUpdates":
        return <SettingContent />;
      default:
        return null;
    }
  };
  return (
    <div>
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
                  onClick={() => {
                    setActiveCard("Home");
                    localStorage.setItem("activeCard", "Home");
                  }}
                >
                  <HomeIcon />
                  Home
                </button>
              </li>
              <li>
                <button
                  className="button-AD"
                  onClick={() => {
                    setActiveCard("FlightUpdates");
                    localStorage.setItem("activeCard", "FlightUpdates");
                  }}
                >
                  <FlightIcon />
                  Flights
                </button>
              </li>
              <li>
                <button
                  className="button-AD"
                  onClick={() => {
                    setActiveCard("ReservationUpdates");
                    localStorage.setItem("activeCard", "ReservationUpdates");
                  }}
                >
                  <CalendarMonthIcon />
                  Reservations
                </button>
              </li>
              <li>
                <button
                  className="button-AD"
                  onClick={() => {
                    setActiveCard("Feedback");
                    localStorage.setItem("activeCard", "Feedback");
                  }}
                >
                  <FeedbackIcon />
                  Feedback
                </button>
              </li>
              <li>
                <button
                  className="button-AD"
                  onClick={() => {
                    setActiveCard("SettingUpdates");
                    localStorage.setItem("activeCard", "SettingUpdates");
                  }}
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
