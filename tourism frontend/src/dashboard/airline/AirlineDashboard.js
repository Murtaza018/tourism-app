import "./AirlineDashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
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
import { Country, City } from "country-state-city";
import CloseIcon from "@mui/icons-material/Close";

function AirlineDashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
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
  const [selectedDepartureCountry, setSelectedDepartureCountry] = useState("");
  const [selectedArrivalCountry, setSelectedArrivalCountry] = useState("");
  const [selectedDepartureCity, setSelectedDepartureCity] = useState("");
  const [selectedArrivalCity, setSelectedArrivalCity] = useState("");
  const [selectedDepartureCountryName, setSelectedDepartureCountryName] =
    useState("");
  const [selectedArrivalCountryName, setSelectedArrivalCountryName] =
    useState("");
  const [departureCities, setDepartureCities] = useState([]);
  const [arrivalCities, setArrivalCities] = useState([]);
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const handleDepartureDateChange = (event) => {
    setDepartureDate(event.target.value);
  };
  const handleArrivalDateChange = (event) => {
    setArrivalDate(event.target.value);
  };

  const handleDepartureTimeChange = (event) => {
    setDepartureTime(event.target.value);
  };
  const handleArrivalTimeChange = (event) => {
    setArrivalTime(event.target.value);
  };
  const handleClickOpenFlightCard = () => {
    setOpenFlightCard(true);
  };

  const handleCloseFlightCard = () => {
    setOpenFlightCard(false);
  };
  const DepartureCountryChange = (event) => {
    event.preventDefault();
    const countryIsoCode = event.target.value;
    setSelectedDepartureCountry(countryIsoCode);
    setSelectedDepartureCountryName(
      Country.getCountryByCode(countryIsoCode).name
    );
    setSelectedDepartureCity(""); // Reset city when the country changes

    // Fetch cities for the selected country
    if (countryIsoCode) {
      const countryCities = City.getCitiesOfCountry(countryIsoCode);
      setDepartureCities(countryCities);
    } else {
      setDepartureCities([]); // Reset cities if no country is selected
    }
  };

  const ArrivalCountryChange = (event) => {
    event.preventDefault();
    const countryIsoCode = event.target.value;
    setSelectedArrivalCountry(countryIsoCode);
    setSelectedArrivalCountryName(
      Country.getCountryByCode(countryIsoCode).name
    );
    setSelectedArrivalCity(""); // Reset city when the country changes

    // Fetch cities for the selected country
    if (countryIsoCode) {
      const countryCities = City.getCitiesOfCountry(countryIsoCode);
      setArrivalCities(countryCities);
    } else {
      setArrivalCities([]); // Reset cities if no country is selected
    }
  };
  // Handle city selection
  const DepartureCityChange = (event) => {
    event.preventDefault();
    setSelectedDepartureCity(event.target.value);
    console.log(selectedDepartureCountryName);
  };
  const ArrivalCityChange = (event) => {
    event.preventDefault();
    setSelectedArrivalCity(event.target.value);
    console.log(selectedArrivalCountryName);
  };
  const addFlight = (event) => {
    event.preventDefault();
    setError("Hello");
  };
  const FlightCard = ({ open, onClose }) => {
    return (
      <Dialog open={open} onClose={onClose} className="dialog-container-AD">
        <div className="dialog-content-wrapper-AD">
          <div className="dialog-header-AD">
            <Button className="close-button-AD" onClick={onClose}>
              <CloseIcon className="close-icon-AD" />
            </Button>
            <div>
              <h1 className="flight-card-heading-AD">Add Flight</h1>
            </div>
            <div className="flight-card-div-AD">
              <Card className="flight-card-AD">
                <h3 className="flight-card-heading-AD">Departure</h3>
                <FormControl className="input-menu-AD">
                  <InputLabel id="country-label">Select Country</InputLabel>
                  <Select
                    labelId="country-label"
                    id="country"
                    value={selectedDepartureCountry}
                    label="Select Country"
                    fullWidth
                    onChange={DepartureCountryChange}
                  >
                    <MenuItem value="">Select Country</MenuItem>
                    {Country.getAllCountries().map((country) => (
                      <MenuItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  className="input-menu-AD"
                  disabled={!selectedDepartureCountry}
                >
                  <InputLabel id="city-label">Select City</InputLabel>

                  <Select
                    labelId="city-label"
                    id="city"
                    fullWidth
                    value={selectedDepartureCity}
                    label="Select City"
                    onChange={DepartureCityChange}
                  >
                    <MenuItem value="">Select City</MenuItem>
                    {departureCities.map((city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={departureDate}
                  className="date-input-AD"
                  onChange={handleDepartureDateChange}
                />

                <label htmlFor="time">Time(UTC):</label>
                <input
                  type="time"
                  id="time"
                  className="date-input-AD"
                  name="time"
                  value={departureTime}
                  onChange={handleDepartureTimeChange}
                />
              </Card>
              <Card className="flight-card-AD">
                <h3 className="flight-card-heading-AD">Arrival</h3>

                <FormControl className="input-menu-AD">
                  <InputLabel id="country-label">Select Country</InputLabel>
                  <Select
                    labelId="country-label"
                    id="country"
                    value={selectedArrivalCountry}
                    label="Select Country"
                    fullWidth
                    onChange={ArrivalCountryChange}
                  >
                    <MenuItem value="">Select Country</MenuItem>
                    {Country.getAllCountries().map((country) => (
                      <MenuItem key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl
                  className="input-menu-AD"
                  disabled={!selectedArrivalCountry}
                >
                  <InputLabel id="city-label">Select City</InputLabel>

                  <Select
                    labelId="city-label"
                    id="city"
                    fullWidth
                    value={selectedArrivalCity}
                    label="Select City"
                    onChange={ArrivalCityChange}
                  >
                    <MenuItem value="">Select City</MenuItem>
                    {arrivalCities.map((city) => (
                      <MenuItem key={city.name} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="date-input-AD"
                  value={arrivalDate}
                  onChange={handleArrivalDateChange}
                />

                <label htmlFor="time">Time(UTC):</label>
                <input
                  type="time"
                  id="time"
                  className="date-input-AD"
                  name="time"
                  value={arrivalTime}
                  onChange={handleArrivalTimeChange}
                />
              </Card>
            </div>
            {error && <p className="error-message-AD">{error}</p>}
            <Button className="add-flight-button-AD" onClick={addFlight}>
              Submit
            </Button>
          </div>
        </div>
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
