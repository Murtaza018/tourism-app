import { useNavigate } from "react-router-dom";
import "./GuideDashboard.css";
import { useState, useEffect, Suspense } from "react";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FeedbackIcon from "@mui/icons-material/Feedback";

function GuideDashboard() {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(() => {
    const storedCard = localStorage.getItem("activeCard");
    if (storedCard && storedCard !== "Home") {
      return storedCard;
    }
    return "Home";
  });
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
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
    setError("");
    //  if (activeCard === "ReservationUpdates") {
    //     getReservationData();
    //   } else if (activeCard === "Feedback") {
    //     getFeedbackData();
    //   } else if (activeCard === "SettingUpdates") {
    //     getAccountStatus();
    //   }
  }, [activeCard]);
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
    const mainContainer = document.querySelector(".main-container-GD");
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
      <div className="details-container-GD">
        <h2 className="heading-GD">
          <strong>Details</strong>
        </h2>
        <p className="data-GD">
          <strong>First Name: {AccountData.first_name}</strong>
        </p>
        <p className="data-GD">
          <strong>Last Name: {AccountData.last_name}</strong>
        </p>
        <p className="data-GD">
          <strong>Email: {AccountData.email}</strong>
        </p>
        <p className="data-GD">
          <strong>Age: {AccountData.age}</strong>
        </p>
        <p className="data-GD">
          <strong>Phone: {AccountData.phone}</strong>
        </p>
        <p className="data-GD">
          <strong>Country: {AccountData.country}</strong>
        </p>
        <p className="data-GD">
          <strong>City: {AccountData.city}</strong>
        </p>
        <p className="data-GD">
          <strong>Address: {AccountData.address}</strong>
        </p>
        <p className="data-GD">
          <strong>Password: {"*".repeat(AccountData.password.length)}</strong>
        </p>
      </div>
    );
  };

  const ReservationContent = () => {
    return (
      <div>
        <h1>Hello Reservation</h1>
      </div>
    );
  };
  const FeedbackContent = () => {
    return (
      <div>
        <h1>Hello Feedback</h1>
      </div>
    );
  };
  const SettingContent = () => {
    return (
      <div>
        <h1>Hello Setting</h1>
      </div>
    );
  };

  const cardComponents = {
    Home: HomeContent,
    ReservationUpdates: ReservationContent,
    Feedback: FeedbackContent,
    SettingUpdates: SettingContent,
  };
  const renderContent = () => {
    const CardComponent = cardComponents[activeCard];
    return CardComponent ? (
      <Suspense fallback={<div>Loading...</div>}>
        <CardComponent />
      </Suspense>
    ) : null;
  };
  return (
    <div>
      <div className="background-GD"></div>
      <div className="main-container-GD">
        <div className="hamburger-menu-GD">
          <button
            className={`hamburger-icon-GD ${isOpen ? "open-GD" : ""}`}
            onClick={toggleMenu}
          >
            <span
              className={`line-GD line-top-GD ${isOpen ? "open-GD" : ""}`}
            ></span>
            <span
              className={`line-GD line-middle-GD ${isOpen ? "open-GD" : ""}`}
            ></span>
            <span
              className={`line-GD line-bottom-GD ${isOpen ? "open-GD" : ""}`}
            ></span>
          </button>

          <nav className={`menu-GD ${isOpen ? "open-GD" : ""}`}>
            <ul>
              <li>
                <button
                  className="button-GD"
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
                  className="button-GD"
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
                  className="button-GD"
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
                  className="button-GD"
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
                <button className="button-GD" onClick={logOut}>
                  <LogoutIcon />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content-GD">
          <div className="details-GD">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default GuideDashboard;
