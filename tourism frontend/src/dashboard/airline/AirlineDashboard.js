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
import StarIcon from "@mui/icons-material/Star";

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
    setError("");
    if (activeCard === "FlightUpdates") {
      getFlightData();
    } else if (activeCard === "ReservationUpdates") {
      getReservationData();
    } else if (activeCard === "Feedback") {
      getFeedbackData();
    }
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
    setError("");
    setOpenFlightCard(true);
  };

  const handleCloseFlightCard = () => {
    setError("");
    setOpenFlightCard(false);
  };

  const addFlightData = (
    flightName,
    seatsAvailable,
    seatType,
    price,
    selectedArrivalCity,
    selectedArrivalCountryName,
    selectedDepartureCity,
    selectedDepartureCountryName,
    departureDate,
    departureTime,
    arrivalDate,
    arrivalTime
  ) => {
    fetch("http://localhost:8008/Tourism/InsertFlight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: localStorage.getItem("email"),
        departureDate,
        departureTime,
        selectedDepartureCity,
        selectedArrivalCountryName,
        arrivalDate,
        arrivalTime,
        selectedArrivalCity,
        selectedDepartureCountryName,
        seatsAvailable,
        flightName,
        seatType,
        price,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("Flight added!");
          window.location.reload();
        } else {
          console.log("Flight not added!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const addFlight = (
    event,
    flightName,
    seatsAvailable,
    seatType,
    price,
    selectedArrivalCity,
    selectedArrivalCountryName,
    selectedDepartureCity,
    selectedDepartureCountryName,
    departureDate,
    departureTime,
    arrivalDate,
    arrivalTime
  ) => {
    event.preventDefault();
    if (selectedDepartureCountryName === "") {
      setError("Select a valid departure country!");
      return;
    }
    if (selectedDepartureCity === "") {
      setError("Select a valid departure city!");
      return;
    }
    if (departureDate === "") {
      setError("Select a valid date!");
      return;
    }
    if (departureTime === "") {
      setError("Select a valid time!");
      return;
    }
    if (selectedArrivalCountryName === "") {
      setError("Select a valid arrival country!");
      return;
    }
    if (selectedArrivalCity === "") {
      setError("Select a valid arrival city!");
      return;
    }

    if (arrivalDate === "") {
      setError("Select a valid date!");
      return;
    }
    if (arrivalTime === "") {
      setError("Select a valid time!");
      return;
    }
    if (arrivalDate < departureDate) {
      setError("Arrival Date can not be before departure date!");
      return;
    }
    if (seatsAvailable < 1) {
      setError("Select a valid seat avaialble!");
      return;
    }
    if (flightName === "") {
      setError("Select a valid flight name!");
      return;
    }
    if (seatType === "") {
      setError("Select a valid type!");
      return;
    }
    if (price <= 0) {
      setError("Select a valid price!");
      return;
    }
    setError("");
    addFlightData(
      flightName,
      seatsAvailable,
      seatType,
      price,
      selectedArrivalCity,
      selectedArrivalCountryName,
      selectedDepartureCity,
      selectedDepartureCountryName,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime
    );
  };
  const [displayFlightData, setDisplayFlightData] = useState([]);
  const getFlightData = async () => {
    fetch("http://localhost:8008/Tourism/getFlightData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: localStorage.getItem("email") }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setDisplayFlightData(data.data);
        } else {
          console.log("Error to fetch data!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const FlightCard = ({ open, onClose }) => {
    const seat = [
      { value: "Economy", label: "Economy" },
      { value: "Premium Economy", label: "Premium Economy" },
      { value: "Business", label: "Business" },
      { value: "First Class", label: "First Class" },
    ];
    const [selectedDepartureCountry, setSelectedDepartureCountry] =
      useState("");
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
    const [seatsAvailable, setSeatsAvailable] = useState("");
    const [flightName, setFlightName] = useState("");
    const [seatType, setSeatType] = useState("");
    const [price, setPrice] = useState("");

    const handleDepartureDateChange = (event) => {
      setDepartureDate(event.target.value);
    };
    const handleArrivalDateChange = (event) => {
      setArrivalDate(event.target.value);
    };
    const handleSeatTypeChange = (event) => {
      setSeatType(event.target.value);
    };
    const handlePriceChange = (event) => {
      setPrice(event.target.value);
    };

    const handleDepartureTimeChange = (event) => {
      setDepartureTime(event.target.value);
    };
    const handleArrivalTimeChange = (event) => {
      setArrivalTime(event.target.value);
    };
    const handleFlightNameChange = (event) => {
      setFlightName(event.target.value);
    };
    const handleSeatsAvailableChange = (event) => {
      setSeatsAvailable(event.target.value);
    };
    const DepartureCountryChange = (event) => {
      event.preventDefault();
      if (event.target.value === "") {
        return;
      }
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
      if (event.target.value === "") {
        return;
      }
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
      if (event.target.value === "") {
        return;
      }
      setSelectedDepartureCity(event.target.value);
      console.log(selectedDepartureCountryName);
    };
    const ArrivalCityChange = (event) => {
      event.preventDefault();
      if (event.target.value === "") {
        return;
      }
      setSelectedArrivalCity(event.target.value);
      console.log(selectedArrivalCountryName);
    };
    return (
      <Dialog open={open} onClose={onClose} className="dialog-container-AD">
        <div className="dialog-content-wrapper-AD">
          <div className="dialog-header-AD">
            <Button className="close-button-AD" onClick={onClose}>
              <CloseIcon className="close-icon-AD" />
            </Button>
            <div>
              <h3 className="flight-card-heading-AD">Add Flight</h3>
            </div>
            <div className="flight-card-top-div-AD">
              <TextField
                type="text"
                className="seats-input-AD"
                label="Flight Name"
                value={flightName}
                onChange={handleFlightNameChange}
              >
                Flight Name
              </TextField>
              <TextField
                type="number"
                className="seats-input-AD"
                label="Available Seats"
                value={seatsAvailable}
                onChange={handleSeatsAvailableChange}
              ></TextField>
              <FormControl className="top-div-input-menu-AD">
                <InputLabel id="country-label">Select Seat Type</InputLabel>
                <Select
                  required
                  labelId="seat-type-label"
                  id="seat-type"
                  size="small"
                  value={seatType}
                  label="Select Seat Type"
                  fullWidth
                  onChange={handleSeatTypeChange}
                >
                  <MenuItem value="">Select Seat Type</MenuItem>
                  {seat.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                type="number"
                className="seats-input-AD"
                label="Price Per Seat($)"
                value={price}
                onChange={handlePriceChange}
              ></TextField>
            </div>
            <div className="flight-card-div-AD">
              <Card className="flight-card-AD">
                <h5 className="flight-card-heading-AD">Departure</h5>
                <FormControl className="input-menu-AD">
                  <InputLabel id="country-label">Select Country</InputLabel>
                  <Select
                    required
                    labelId="country-label"
                    id="country"
                    size="small"
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

                <FormControl className="input-menu-AD">
                  <InputLabel id="city-label">Select City</InputLabel>

                  <Select
                    required
                    labelId="city-label"
                    id="city"
                    disabled={!selectedDepartureCountry}
                    fullWidth
                    value={selectedDepartureCity}
                    label="Select City"
                    size="small"
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
                  required
                  type="date"
                  id="date"
                  name="date"
                  value={departureDate}
                  className="date-input-AD"
                  onChange={handleDepartureDateChange}
                />

                <label htmlFor="time">Time(Local Time):</label>
                <input
                  required
                  type="time"
                  id="time"
                  className="date-input-AD"
                  name="time"
                  value={departureTime}
                  onChange={handleDepartureTimeChange}
                />
              </Card>
              <Card className="flight-card-AD">
                <h5 className="flight-card-heading-AD">Arrival</h5>

                <FormControl className="input-menu-AD">
                  <InputLabel id="country-label">Select Country</InputLabel>
                  <Select
                    required
                    labelId="country-label"
                    id="country"
                    size="small"
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

                <FormControl className="input-menu-AD">
                  <InputLabel id="city-label">Select City</InputLabel>

                  <Select
                    required
                    size="small"
                    labelId="city-label"
                    id="city"
                    fullWidth
                    disabled={!selectedArrivalCountry}
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
                  required
                  type="date"
                  id="date"
                  name="date"
                  className="date-input-AD"
                  value={arrivalDate}
                  onChange={handleArrivalDateChange}
                />

                <label htmlFor="time">Time(Local Time):</label>
                <input
                  required
                  type="time"
                  id="time"
                  className="date-input-AD"
                  name="time"
                  value={arrivalTime}
                  onChange={handleArrivalTimeChange}
                />
              </Card>
            </div>
            {error && <p className="error-message2-AD">{error}</p>}
            <Button
              className="add-flight-button-AD"
              onClick={(e) =>
                addFlight(
                  e,
                  flightName,
                  seatsAvailable,
                  seatType,
                  price,
                  selectedArrivalCity,
                  selectedArrivalCountryName,
                  selectedDepartureCity,
                  selectedDepartureCountryName,
                  departureDate,
                  departureTime,
                  arrivalDate,
                  arrivalTime
                )
              }
            >
              Submit
            </Button>
          </div>
        </div>
      </Dialog>
    );
  };
  const DeleteFlights = async (SF) => {
    console.log(SF);
    fetch("http://localhost:8008/Tourism/DeleteFlight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(SF),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("Flight Deleted");
          window.location.reload();
        } else {
          console.log("Flight not deleted!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeleteSelectedFlights = () => {
    if (selectedFlights.length === 0) {
      alert("Please select flights to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected flights?"
    );
    if (confirmDelete) {
      DeleteFlights(selectedFlights); // Call the onDeleteRooms function passed as a prop
      setShowCheckboxes(false); // Hide checkboxes after deletion
      setSelectedFlights([]); // Clear selected rooms
    }
  };
  const updateFlight = () => {
    console.log(editedFlightData);
    fetch("http://localhost:8008/Tourism/updateFlight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedFlightData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("Flight Edited");
        } else {
          console.log("Flight not edited!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEditClick = (flight) => {
    setEditingFlightId(flight.flight_id);
    setEditedFlightData({ ...flight }); // Initialize edited data with current room data
  };

  const handleSaveClick = () => {
    if (editedFlightData.departure_date === "") {
      setError("Please select a departure date!");
      return;
    }
    if (editedFlightData.departure_time === "") {
      setError("Please select a departure time!");
      return;
    }
    if (editedFlightData.arrival_date === "") {
      setError("Please select a arrival date!");
      return;
    }
    if (editedFlightData.arrival_time === "") {
      setError("Please select a arrival time!");
      return;
    }
    if (editedFlightData.seats_available < 0) {
      setError("Please select a valid seat amount!");
      return;
    }
    if (editedFlightData.price <= 0) {
      setError("Please select a valid price!");
      return;
    }

    setError("");
    updateFlight(editedFlightData); // Call the update function
    setEditingFlightId(null); // Exit edit mode
    window.location.reload();
  };

  const handleCancelClick = () => {
    setError("");
    setEditingFlightId(null); // Exit edit mode without saving changes
  };
  const handleToggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
    setSelectedFlights([]);
    if (editboxes) {
      setEditboxes(false);
    }
  };
  const toggleEditButton = () => {
    setEditboxes(!editboxes);
    if (editingFlightId) {
      setEditingFlightId(null);
    }
    if (showCheckboxes) {
      setShowCheckboxes(false);
    }
  };
  const [editboxes, setEditboxes] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedFlights, setSelectedFlights] = useState([]);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [editedFlightData, setEditedFlightData] = useState({});
  const handleInputChange = (event, field) => {
    setEditedFlightData((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }));
  };
  const handleCheckboxChange = (flightId) => {
    setSelectedFlights((prevSelectedFlights) => {
      if (prevSelectedFlights.includes(flightId)) {
        return prevSelectedFlights.filter((id) => id !== flightId);
      } else {
        return [...prevSelectedFlights, flightId];
      }
    });
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
              className="flight-option-AD"
              startIcon={<AddIcon />}
              onClick={handleClickOpenFlightCard}
            >
              Add Flight
            </FlightButton>
            <FlightButton
              variant="outlined"
              startIcon={<EditIcon />}
              className="flight-option-AD"
              onClick={toggleEditButton}
            >
              {editboxes ? "Cancel Edit" : "Edit Flight"}
            </FlightButton>
            <FlightButton
              variant="outlined"
              startIcon={<DeleteIcon />}
              className="flight-option-AD"
              onClick={handleToggleCheckboxes}
            >
              {showCheckboxes ? "Cancel Delete" : "Delete Flight"}
            </FlightButton>
          </div>
          <div className="table-container-AD">
            {displayFlightData.length > 0 ? (
              <div>
                <table className="flight-table-AD">
                  <thead className="table-head-AD">
                    <tr>
                      {showCheckboxes && (
                        <th className="table-header-AD">Select</th>
                      )}
                      <th className="table-header-AD">Flight Name</th>
                      <th className="table-header-AD">Seats Available</th>
                      <th className="table-header-AD">Seat Type</th>
                      <th className="table-header-AD">Price per Seat($)</th>
                      <th className="table-header-AD">Departure Country</th>
                      <th className="table-header-AD">Departure City</th>
                      <th className="table-header-AD">
                        Departure Date(YYYY-MM-DD)
                      </th>
                      <th className="table-header-AD">
                        Departure Time(Local Time)
                      </th>
                      <th className="table-header-AD">Arrival Country</th>
                      <th className="table-header-AD">Arrival City</th>
                      <th className="table-header-AD">
                        Arrival Date(YYYY-MM-DD)
                      </th>
                      <th className="table-header-AD">
                        Arrival Time(Local Time)
                      </th>
                      {editboxes && <th className="table-header-AD">Edit</th>}
                    </tr>
                  </thead>
                  <tbody className="table-body-AD">
                    {displayFlightData.map((flight) => (
                      <tr key={flight.flight_id} className="table-row-AD">
                        {showCheckboxes && (
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedFlights.includes(
                                flight.flight_id
                              )}
                              onChange={() =>
                                handleCheckboxChange(flight.flight_id)
                              }
                            />
                          </td>
                        )}
                        {editingFlightId === flight.flight_id ? ( // Edit mode
                          <>
                            <td className="table-cell-AD">
                              {flight.flight_name}
                            </td>
                            <td className="table-cell-AD">
                              <input
                                className="input-editflight-AD"
                                type="number"
                                value={editedFlightData.seats_available}
                                onChange={(e) =>
                                  handleInputChange(e, "seats_available")
                                }
                              />
                            </td>
                            <td className="table-cell-AD">
                              {flight.seat_type}
                            </td>
                            <td className="table-cell-AD">
                              <input
                                className="input-editflight-AD"
                                type="number"
                                value={editedFlightData.price}
                                onChange={(e) => handleInputChange(e, "price")}
                              />
                            </td>
                            <td className="table-cell-AD">
                              {flight.departure_country}
                            </td>
                            <td className="table-cell-AD">
                              {flight.departure_city}
                            </td>
                            <td>
                              <input
                                className="input-editflight-AD"
                                type="date"
                                value={editedFlightData.departure_date}
                                onChange={(e) =>
                                  handleInputChange(e, "departure_date")
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="input-editflight-AD"
                                type="time"
                                value={editedFlightData.departure_time}
                                onChange={(e) =>
                                  handleInputChange(e, "departure_time")
                                }
                              />
                            </td>
                            <td className="table-cell-AD">
                              {flight.arrival_country}
                            </td>
                            <td className="table-cell-AD">
                              {flight.arrival_city}
                            </td>
                            <td>
                              <input
                                className="input-editflight-AD"
                                type="date"
                                value={editedFlightData.arrival_date}
                                onChange={(e) =>
                                  handleInputChange(e, "arrival_date")
                                }
                              />
                            </td>
                            <td>
                              <input
                                className="input-editflight-AD"
                                type="time"
                                value={editedFlightData.arrival_time}
                                onChange={(e) =>
                                  handleInputChange(e, "arrival_time")
                                }
                              />
                            </td>
                            <td>
                              <div className="button-group-AD">
                                <button
                                  className="save-button-AD"
                                  onClick={() =>
                                    handleSaveClick(flight.flight_id)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  className="cancel-button-AD"
                                  onClick={handleCancelClick}
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="table-cell-AD">
                              {flight.flight_name}
                            </td>
                            <td className="table-cell-AD">
                              {flight.seats_available}
                            </td>
                            <td className="table-cell-AD">
                              {flight.seat_type}
                            </td>
                            <td className="table-cell-AD">{flight.price}</td>
                            <td className="table-cell-AD">
                              {flight.departure_country}
                            </td>
                            <td className="table-cell-AD">
                              {flight.departure_city}
                            </td>
                            <td className="table-cell-AD">
                              {flight.departure_date}
                            </td>
                            <td className="table-cell-AD">
                              {flight.departure_time}
                            </td>
                            <td className="table-cell-AD">
                              {flight.arrival_country}
                            </td>
                            <td className="table-cell-AD">
                              {flight.arrival_city}
                            </td>
                            <td className="table-cell-AD">
                              {flight.arrival_date}
                            </td>
                            <td className="table-cell-AD">
                              {flight.arrival_time}
                            </td>
                            {editboxes && (
                              <td>
                                <button
                                  className="edit-button-AD"
                                  onClick={() => handleEditClick(flight)}
                                >
                                  Edit
                                </button>
                              </td>
                            )}
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {showCheckboxes && (
                  <button
                    className="delete-selected-AD"
                    onClick={handleDeleteSelectedFlights}
                  >
                    Delete Selected Flights
                  </button>
                )}
                {error && <p className="error-message-AD">{error}</p>}
              </div>
            ) : (
              <p className="no-data-message-AD">No data available.</p>
            )}
          </div>
        </div>
        <FlightCard open={openFlightCard} onClose={handleCloseFlightCard} />
      </div>
    );
  };
  const [selectedReservs, setSelectedReservs] = useState([]);
  const [reservEditId, setReservEditId] = useState(null);
  const [editedReservData, setEditedReservData] = useState({});
  const [reservDeleteboxes, setReservDeleteboxes] = useState(false);
  const [displayReservationData, setDisplayReservationData] = useState([]);
  const [reservEditboxes, setReserveEditboxes] = useState(false);
  const FlightStatus = [
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
  ];
  const getReservationData = async () => {
    fetch("http://localhost:8008/Tourism/getFlightReservationData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: localStorage.getItem("email") }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setDisplayReservationData(data.data);
        } else {
          console.log("Error to fetch data!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateReserv = () => {
    fetch("http://localhost:8008/Tourism/updateFlightReservationData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedReservData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("Reservation Edited");
        } else {
          console.log("Reservation not edited!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const DeleteReservation = (selectedData) => {
    fetch("http://localhost:8008/Tourism/deleteFlightReservationData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("Reservation Deleted");
        } else {
          console.log("Reservation not Deleted!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const toggleReservationEditButton = () => {
    if (reservDeleteboxes) {
      setReservDeleteboxes(false);
    }
    setReserveEditboxes(!reservEditboxes);
    if (reservEditId) {
      setReservEditId(null);
    }
  };
  const handleReservEditClick = (reserv) => {
    setReservEditId(reserv.reservation_id);
    setEditedReservData({ ...reserv }); // Initialize edited data with current room data
  };

  const handleSaveReservClick = () => {
    if (editedReservData.status === "") {
      setError("Please select a status!");
      return;
    }
    setError("");
    updateReserv(editedReservData); // Call the update function
    setReservEditId(null); // Exit edit mode
    window.location.reload();
  };

  const handleCancelReservClick = () => {
    setReservEditId(null); // Exit edit mode without saving changes
  };

  const handleReservInputChange = (event, field) => {
    setEditedReservData((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }));
  };

  const toggleReservationDeleteButton = () => {
    setReservDeleteboxes(!reservDeleteboxes);
    setSelectedFlights([]);
    if (reservEditboxes) {
      setReserveEditboxes(false);
    }
  };

  const handleReservCheckboxChange = (reservId) => {
    setSelectedReservs((prevSelectedReservs) => {
      if (prevSelectedReservs.includes(reservId)) {
        return prevSelectedReservs.filter((id) => id !== reservId);
      } else {
        return [...prevSelectedReservs, reservId];
      }
    });
  };

  const handleDeleteSelectedReserv = () => {
    if (selectedReservs.length === 0) {
      alert("Please select reservations to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected reservations?"
    );
    if (confirmDelete) {
      DeleteReservation(selectedReservs); // Call the onDeleteRooms function passed as a prop
      setReservDeleteboxes(false); // Hide checkboxes after deletion
      setSelectedReservs([]); // Clear selected rooms
      window.location.reload();
    }
  };
  const ReservationContent = () => {
    return (
      <div>
        <div className="flight-content-AD">
          <h1 className="heading-AD">
            <strong>Reservations</strong>
          </h1>
          <div className="flight-options-container-AD">
            <FlightButton
              variant="outlined"
              sx={{
                "&:hover": {
                  color: "green !important",
                  borderColor: "green !important",
                },
              }}
              startIcon={<EditIcon />}
              onClick={toggleReservationEditButton}
            >
              {reservEditboxes ? "Cancel Edit" : "Edit Booking"}
            </FlightButton>
            <FlightButton
              variant="outlined"
              sx={{
                "&:hover": {
                  color: "red !important",
                  borderColor: "red !important",
                },
              }}
              startIcon={<DeleteIcon />}
              onClick={toggleReservationDeleteButton}
            >
              {reservDeleteboxes ? "Cancel Delete" : "Delete Booking"}
            </FlightButton>
          </div>
          <div className="table-container-AD">
            {displayReservationData.length > 0 ? (
              <div>
                <table className="flight-table-AD">
                  <thead className="table-head-AD">
                    <tr>
                      {reservDeleteboxes && (
                        <th className="table-header-AD">Select</th>
                      )}
                      <th className="table-header-AD">Flight Name</th>
                      <th className="table-header-AD">Seat Type</th>
                      <th className="table-header-AD">Seats Booked</th>
                      <th className="table-header-AD">Status</th>
                      <th className="table-header-AD">Passenger Name</th>
                      <th className="table-header-AD">Passenger Phone</th>
                      {reservEditboxes && (
                        <th className="table-header-AD">Edit</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="table-body-AD">
                    {displayReservationData.map((reserv) => (
                      <tr key={reserv.reservation_id} className="table-row-AD">
                        {reservDeleteboxes && (
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedReservs.includes(
                                reserv.reservation_id
                              )}
                              onChange={() =>
                                handleReservCheckboxChange(
                                  reserv.reservation_id
                                )
                              }
                            />
                          </td>
                        )}
                        {reservEditId === reserv.reservation_id ? (
                          <>
                            <td className="table-cell-AD">
                              {reserv.flight_name}
                            </td>
                            <td className="table-cell-AD">
                              {reserv.seat_type}
                            </td>
                            <td className="table-cell-AD">
                              {reserv.seats_booked}
                            </td>
                            <td>
                              <Select
                                required
                                labelId="status-label"
                                id="status"
                                size="small"
                                label="Select Status"
                                fullWidth
                                value={editedReservData.status}
                                onChange={(e) =>
                                  handleReservInputChange(e, "status")
                                }
                              >
                                <MenuItem value="">Select Status</MenuItem>
                                {FlightStatus.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>
                            <td className="table-cell-AD">
                              {reserv.first_name}
                            </td>
                            <td className="table-cell-AD">{reserv.phone}</td>

                            <td>
                              <div className="button-group-AD">
                                <button
                                  className="save-button-AD"
                                  onClick={() =>
                                    handleSaveReservClick(reserv.reservation_id)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  className="cancel-button-AD"
                                  onClick={handleCancelReservClick}
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="table-cell-AD">
                              {reserv.flight_name}
                            </td>
                            <td className="table-cell-AD">
                              {reserv.seat_type}
                            </td>
                            <td className="table-cell-AD">
                              {reserv.seats_booked}
                            </td>
                            <td className="table-cell-AD">{reserv.status}</td>
                            <td className="table-cell-AD">
                              {reserv.first_name}
                            </td>
                            <td className="table-cell-AD">{reserv.phone}</td>
                            {reservEditboxes && (
                              <td>
                                <button
                                  className="edit-button-AD"
                                  onClick={() => handleReservEditClick(reserv)}
                                >
                                  Edit
                                </button>
                              </td>
                            )}
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reservDeleteboxes && (
                  <button
                    className="delete-selected-AD"
                    onClick={handleDeleteSelectedReserv}
                  >
                    Delete Selected Reservations
                  </button>
                )}
                {error && <p className="error-message2-AD">{error}</p>}
              </div>
            ) : (
              <p className="no-data-message-AD">No data available.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const [displayFeedbackData, setDisplayFeedbackData] = useState([]);
  const getFeedbackData = () => {
    fetch("http://localhost:8008/Tourism/getFeedbackData", {
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
          setDisplayFeedbackData(data.data);
        } else {
          console.log("Error to fetch data!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const StarRating = ({ rating }) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`star ${index < rating ? "filled" : "empty"}`}
          >
            <StarIcon />
          </span>
        ))}
      </div>
    );
  };

  const FeedbackContent = () => {
    return (
      <div>
        <div className="flight-content-AD">
          <h2 className="heading-AD">
            <strong>Feedback</strong>
          </h2>
          {displayFeedbackData.length > 0 ? (
            <>
              {displayFeedbackData.map((reserv) => (
                <details className="feedback-details" key={reserv.feedback_id}>
                  <summary className="feedback-summary">
                    {reserv.first_name} {reserv.last_name}({reserv.sender_email}
                    )
                  </summary>
                  <div className="feedback-content">
                    <div className="feedback-rating">
                      Rating: <StarRating rating={reserv.rating} />
                    </div>

                    <p className="feedback-text">
                      Description:&nbsp;
                      {reserv.description}
                    </p>
                  </div>
                </details>
              ))}
            </>
          ) : (
            <p className="no-data-message-AD">No feedback available.</p>
          )}
        </div>
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
