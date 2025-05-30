import { useNavigate } from "react-router-dom";
import "./TouristDashboard.css";
import { useState, useEffect, Suspense } from "react";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Country, City } from "country-state-city";
import PublicIcon from "@mui/icons-material/Public";
import HistoryIcon from "@mui/icons-material/History";
import { DateTime } from "luxon";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import {
  Button,
  Dialog,
  DialogContent,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import {
  ChevronLeft,
  ChevronRight,
  LockIcon,
  LockOpenIcon,
} from "lucide-react";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { StarOutline } from "@mui/icons-material";
import PackageStepper from "./PackageStepper";
import Stepper, { Step } from "../../components/Stepper";
import moment from "moment";

function TouristDashboard() {
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
    if (activeCard === "Feedback") {
      getFeedbackData();
    } else if (activeCard === "SettingUpdates") {
      getAccountStatus();
    } else if (activeCard === "Packages") {
      getPackages();
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

  const logOut = () => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("email");
    navigate("/signin");
  };
  const HomeContent = () => {
    return (
      <div className="details-container-TD">
        <h2 className="heading-TD">Details</h2>
        <div className="home-content-div-HD">
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
      </div>
    );
  };
  const [packageData, setPackageData] = useState(null);
  const getPackages = () => {
    fetch("http://localhost:8008/Tourism/getPackages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: localStorage.getItem("email") }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data.packages);
          setPackageData(data.packages);
        } else {
          console.log("Package Data not retreived!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Packages = () => {
    const [flightData, setFlightData] = useState(null);
    const [loadingState, setLoadingState] = useState(null);
    const [flightDetailsDisplay, setFlightDetailsDisplay] = useState(false);
    const [addFlight, setAddFlight] = useState(false);
    const [addGuide, setAddGuide] = useState(false);
    const [addRental, setAddRental] = useState(false);
    const getFlightDetails = (flight_id) => {
      console.log("flight_id:", flight_id);
      fetch("http://localhost:8008/Tourism/getIndividualFlight", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flight_id: flight_id }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.data);
            setFlightData(data.data);
            setLoadingState("complete");
          } else {
            console.log("Flight Data not retreived!", data.data);
            setLoadingState("error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const [singlePackageData, setSinglePackageData] = useState(null);
    const [packageCity, setPackageCity] = useState(null);
    const [days, setDays] = useState(null);
    const handleOpenFlightDetails = () => {
      setFlightDetailsDisplay(true);
    };

    const handleCloseFlightDetails = () => {
      setFlightDetailsDisplay(false);
    };
    const handleOpenAddFlight = (packageItem) => {
      setAddFlight(true);
      setSinglePackageData(packageItem);
    };

    const handleCloseAddFlight = () => {
      setAddFlight(false);
    };
    const handleOpenAddGuide = (packageItem, city) => {
      setAddGuide(true);
      setSinglePackageData(packageItem);
      setDays(packageItem.dataObject[city].days);
      setPackageCity(city);
      GuideDataAPICall(city, packageItem.dataObject, packageItem.start_date);
    };

    const handleCloseAddGuide = () => {
      setAddGuide(false);
    };
    const handleOpenAddRental = (packageItem, city) => {
      setAddRental(true);
      setSinglePackageData(packageItem);
      setDays(packageItem.dataObject[city].days);
      setPackageCity(city);
      RentalDataAPICall(city, packageItem.dataObject, packageItem.start_date);
    };

    const handleCloseAddRental = () => {
      setAddRental(false);
    };
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const GuideDataAPICall = (param_city, daysStay, flightDate) => {
      let intervalDays = 0;
      for (const city in daysStay) {
        if (city === param_city) {
          break;
        }
        intervalDays += daysStay[city].days;
      }
      intervalDays = parseInt(intervalDays, 10);
      const date2 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const start_date = date2.format("YYYY-MM-DD");

      intervalDays += Number(daysStay[param_city].days);
      const date3 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const end_date = date3.format("YYYY-MM-DD");
      setStartDate(start_date);
      setEndDate(end_date);
      getGuideData(param_city, start_date, end_date);
    };
    const [guideData, setGuideData] = useState(null);
    const [rentalData, setRentalData] = useState(null);
    const getGuideData = (city, start_date, end_date) => {
      fetch("http://localhost:8008/Tourism/getGuides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: city,
          start_date: start_date,
          end_date: end_date,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.data);
            setGuideData(data.data);
          } else {
            console.log("Data not retreived!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getRentalData = (city, start_date, end_date) => {
      fetch("http://localhost:8008/Tourism/getRentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: city,
          start_date: start_date,
          end_date: end_date,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.data);
            setRentalData(data.data);
          } else {
            console.log("Data not retreived!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const RentalDataAPICall = (param_city, daysStay, flightDate) => {
      let intervalDays = 0;
      for (const city in daysStay) {
        if (city === param_city) {
          break;
        }
        intervalDays += daysStay[city].days;
      }
      intervalDays = parseInt(intervalDays, 10);
      const date2 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const start_date = date2.format("YYYY-MM-DD");

      intervalDays += Number(daysStay[param_city].days);
      const date3 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const end_date = date3.format("YYYY-MM-DD");
      setStartDate(start_date);
      setEndDate(end_date);
      getRentalData(param_city, start_date, end_date);
    };
    const FlightDetails = ({ open, onClose }) => {
      return (
        <div>
          <Dialog
            open={open}
            onClose={onClose}
            className="dialog-container2-TD"
          >
            <DialogContent className="dialog-content2-TD">
              <div className="flight-details-heading-TD">
                <h2>Flight Details</h2>
              </div>
              {loadingState && loadingState === "loading" ? (
                <>Loading...</>
              ) : loadingState && loadingState === "complete" ? (
                <>
                  {(() => {
                    const localDepartureDateTime = DateTime.fromISO(
                      flightData.departure_date +
                        "T" +
                        flightData.departure_time,
                      { zone: "UTC" }
                    ).setZone(userTimeZone);

                    const formattedDepartureDateTime =
                      localDepartureDateTime.toLocaleString(
                        DateTime.DATETIME_MED
                      );

                    const localArrivalDateTime = DateTime.fromISO(
                      flightData.arrival_date + "T" + flightData.arrival_time,
                      { zone: "UTC" }
                    ).setZone(userTimeZone);

                    const formattedArrivalDateTime =
                      localArrivalDateTime.toLocaleString(
                        DateTime.DATETIME_MED
                      );

                    return (
                      <>
                        <div className="flight-details-container-TD">
                          <div className="flight-name-section-TD">
                            <p>Flight Name: {flightData.flight_name}</p>
                            <p>Seat Type: {flightData.seat_type}</p>
                          </div>
                          <div className="flight-route-details-TD">
                            <div className="departure-section-TD">
                              <p>
                                Departure: {flightData.departure_city},
                                {flightData.departure_country}
                              </p>
                              <p className="departure-time-TD">
                                Departure Time: {formattedDepartureDateTime}
                              </p>
                            </div>
                            <div className="flight-icon-section-TD">
                              <FlightIcon />
                            </div>
                            <div className="arrival-section-TD">
                              <p>
                                Arrival: {flightData.arrival_city},
                                {flightData.arrival_country}
                              </p>
                              <p className="arrival-time-TD">
                                Arrival Time: {formattedArrivalDateTime}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </>
              ) : (
                <>error</>
              )}
            </DialogContent>
          </Dialog>
        </div>
      );
    };

    const AddFlight = ({ open, onClose }) => {
      function isDateBeforeOtherDate(date1, date2) {
        // Create Date objects for the given dates
        const givenDate1 = new Date(date1);
        const givenDate2 = new Date(date2);

        // Set the time components to 00:00:00 for accurate comparison
        givenDate1.setHours(0, 0, 0, 0);
        givenDate2.setHours(0, 0, 0, 0);

        // Compare the dates
        return givenDate1 < givenDate2;
      }
      const [flightReturnDate, setFlightReturnDate] = useState(null);
      const [returnFlightData, setReturnFlightData] = useState(null);
      const [returnFlightSelected, setReturnFlightSelected] = useState(false);
      const [selectedReturnFlightID, setSelectedReturnFlightID] =
        useState(null);
      const getReturnFlights = (date, quantity) => {
        console.log("date:", date);
        fetch("http://localhost:8008/Tourism/getFlights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: date,
            departure_country: singlePackageData.arrivalCountry,
            departure_city: Object.keys(singlePackageData.dataObject)[
              Object.keys(singlePackageData.dataObject).length - 1
            ],
            arrival_country: singlePackageData.departureCountry,
            arrival_city: singlePackageData.departureCity,
            quantity: singlePackageData.quantity,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              console.log(data.data);
              setReturnFlightData(data.data);
            } else {
              console.log("Data not retreived!", data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      const [formData, setFormData] = useState({
        card: "",
        expiry: "",
        cvv: "",
        amount: "",
      });

      // Error state
      const [errors, setErrors] = useState({});

      // Handle input changes
      // Handle input changes
      const handleChange = (e) => {
        const { id, value } = e.target;

        let formattedValue = value;

        // Format card number with spaces every 4 digits
        if (id === "card") {
          // First, filter out non-numeric characters from the input
          const numericValue = value.replace(/[^\d]/g, "");

          // Then format with spaces every 4 digits
          formattedValue = numericValue.replace(/(.{4})/g, "$1 ").trim();

          // Limit to 19 characters (16 digits + 3 spaces)
          formattedValue = formattedValue.substring(0, 19);
        }

        // Format expiry as MM/YY
        if (id === "expiry") {
          formattedValue = value.replace(/\D/g, "");
          if (formattedValue.length > 2) {
            formattedValue =
              formattedValue.substring(0, 2) +
              "/" +
              formattedValue.substring(2, 4);
          }
          // Limit to 5 characters (MM/YY)
          formattedValue = formattedValue.substring(0, 5);
        }

        // Format CVV as numbers only, max 3-4 digits
        if (id === "cvv") {
          formattedValue = value.replace(/\D/g, "").substring(0, 4);
        }

        // Format amount as currency
        if (id === "amount") {
          // Remove non-numeric characters except decimal point
          formattedValue = value.replace(/[^\d.]/g, "");

          // Ensure only one decimal point
          const parts = formattedValue.split(".");
          if (parts.length > 2) {
            formattedValue = parts[0] + "." + parts.slice(1).join("");
          }

          // Limit to two decimal places
          if (parts.length > 1) {
            formattedValue = parts[0] + "." + parts[1].substring(0, 2);
          }

          // Add dollar sign if there's a value
          if (formattedValue) {
            formattedValue = "$" + formattedValue.replace(/^\$/, "");
          }
        }

        setFormData({
          ...formData,
          [id]: formattedValue,
        });
      };
      // Validate form
      const validateForm = () => {
        const newErrors = {};

        // Validate card number (simple check for length)
        if (formData.card.replace(/\s/g, "").length !== 16) {
          newErrors.card = "Card number must be 16 digits";
        }

        // Validate expiry (check format and if not expired)
        if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
          newErrors.expiry = "Expiry must be in MM/YY format";
        } else {
          const [month, year] = formData.expiry.split("/");
          const expiryDate = new Date(
            2000 + parseInt(year),
            parseInt(month) - 1
          );
          if (expiryDate < new Date()) {
            newErrors.expiry = "Card has expired";
          }
        }

        // Validate CVV (3-4 digits)
        if (!/^\d{3,4}$/.test(formData.cvv)) {
          newErrors.cvv = "CVV must be 3-4 digits";
        }

        // Validate amount (must be a number greater than 0)

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const [formState, setFormState] = useState("visible");
      const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
          // Process payment here
          insertFlight();

          // Start the shrinking animation
          setFormState("shrinking");

          // After animation completes, fully hide the form
          setTimeout(() => {
            // Hide the form
            setFormState("hidden");

            // Show appropriate success/failure message
          }, 600); // Slightly longer than the animation duration
        }
      };
      const insertFlight = async () => {
        fetch("http://localhost:8008/Tourism/insertPackageFlight", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            package_id: singlePackageData.package_id,
            return_date: flightReturnDate,
            flight_id: selectedReturnFlightID,
            price: flightPrice,
            flight_email: flightEmail,
            quantity: singlePackageData.quantity,
            email: localStorage.getItem("email"),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              console.log(data.data);
              setTimeout(() => {
                setShowSuccessMessage("success");
              }, 600);
            } else {
              console.log("Flight not inserted!", data.data);
              setTimeout(() => {
                setShowSuccessMessage("fail");
              }, 600);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      const [flightEmail, setFlightEmail] = useState(null);
      const [showSuccessMessage, setShowSuccessMessage] = useState("undefined");
      const [flightPrice, setFlightPrice] = useState(null);
      return (
        <Dialog open={open} onClose={onClose} className="dialog-container-TD">
          <DialogContent className="dialog-content-TD">
            {singlePackageData ? (
              <Stepper
                initialStep={1}
                onStepChange={(step) => {
                  console.log(step);
                }}
                onFinalStepCompleted={() => console.log("All steps completed!")}
                backButtonText={<ChevronLeft />}
                nextButtonText={<ChevronRight />}
                validateStep={async (step) => {
                  if (step === 1) {
                    if (!selectedReturnFlightID) {
                      return "Select a Flight!";
                    }
                  }
                  return true;
                }}
              >
                <Step>
                  <h2 className="step-heading-TD">
                    {
                      Object.keys(singlePackageData.dataObject)[
                        Object.keys(singlePackageData.dataObject).length - 1
                      ]
                    }
                    ,{singlePackageData.arrivalCountry}
                    <FlightTakeoffIcon />
                    {singlePackageData.departureCity ? (
                      <>{singlePackageData.departureCity},</>
                    ) : (
                      <>?</>
                    )}
                    {singlePackageData.departureCountry ? (
                      <>{singlePackageData.departureCountry}</>
                    ) : (
                      <>?</>
                    )}
                  </h2>
                  <div className="flight-data-stepper-input-div-TD">
                    <TextField
                      type="date"
                      className="seats-input3-TD"
                      value={flightReturnDate}
                      onChange={(e) => {
                        if (isDateBeforeOtherDate(e.target.value, new Date())) {
                          window.alert("Date can not be in the past!");
                          return;
                        } else {
                          setFlightReturnDate(e.target.value);
                          getReturnFlights(
                            e.target.value,
                            singlePackageData.quantity
                          );
                        }
                      }}
                      sx={{
                        backgroundColor: "transparent !important",
                        color: "cyan !important",
                        "& .MuiInputBase-input": {
                          backgroundColor: "transparent !important",
                          color: "cyan !important",
                        },
                        "& .MuiInputBase-root": {
                          backgroundColor: "transparent !important",
                          color: "cyan !important",
                        },
                        '& input[type="date"]::-webkit-calendar-picker-indicator':
                          {
                            filter:
                              "invert(50%) sepia(100%) saturate(500%) hue-rotate(170deg)", // Cyan color
                          },
                      }}
                    ></TextField>
                    <TextField
                      type="number"
                      className="seats-input3-TD"
                      value={singlePackageData.quantity}
                      disabled
                      placeholder="Number of persons"
                      sx={{
                        backgroundColor: "transparent !important",
                        color: "cyan !important",
                        "& .MuiInputBase-input": {
                          backgroundColor: "transparent !important",
                          color: "cyan !important",
                        },
                        "& .MuiInputBase-root": {
                          backgroundColor: "transparent !important",
                          color: "cyan !important",
                        },
                        '& input[type="date"]::-webkit-calendar-picker-indicator':
                          {
                            filter:
                              "invert(50%) sepia(100%) saturate(500%) hue-rotate(170deg)", // Cyan color
                          },
                      }}
                    ></TextField>
                  </div>
                  <div className="table-container-TD">
                    {returnFlightData && returnFlightData.length > 0 ? (
                      <div>
                        <table className="Tourist-table-TD">
                          <thead className="table-head2-TD">
                            <tr>
                              <th className="table-header-TD">Flight Name</th>
                              <th className="table-header-TD">Departure</th>
                              <th className="table-header-TD">
                                Departure Time
                              </th>
                              <th className="table-header-TD">Arrival</th>
                              <th className="table-header-TD">Arrival Time</th>
                              <th className="table-header-TD">
                                Available Seats
                              </th>
                              <th className="table-header-TD">Seat Type</th>
                              <th className="table-header-TD">Price($)</th>
                              <th className="table-header-TD">
                                Airline Rating
                              </th>

                              <th className="table-header-TD">Booking</th>
                            </tr>
                          </thead>
                          <tbody className="table-body-TD">
                            {returnFlightData.map((flight) => {
                              const localDepartureDateTime = DateTime.fromISO(
                                flight.departure_date +
                                  "T" +
                                  flight.departure_time,
                                { zone: "UTC" }
                              ).setZone(userTimeZone);

                              // Format date/time for display
                              const formattedDepartureDateTime =
                                localDepartureDateTime.toLocaleString(
                                  DateTime.DATETIME_MED
                                );
                              const localArrivalDateTime = DateTime.fromISO(
                                flight.arrival_date + "T" + flight.arrival_time,
                                { zone: "UTC" }
                              ).setZone(userTimeZone);

                              // Format date/time for display
                              const formattedArrivalDateTime =
                                localArrivalDateTime.toLocaleString(
                                  DateTime.DATETIME_MED
                                );
                              return (
                                <tr
                                  key={flight.flight_id}
                                  className="table-row-TD"
                                >
                                  <td className="table-cell-TD table-cell2-TD">
                                    {flight.flight_name}
                                  </td>
                                  <td className="table-cell-TD table-cell2-TD">
                                    {flight.departure_city},
                                    {flight.departure_country}
                                  </td>

                                  <td className="table-cell-TD table-cell2-TD">
                                    {formattedDepartureDateTime}
                                  </td>
                                  <td className="table-cell-TD table-cell2-TD">
                                    {flight.arrival_city},
                                    {flight.arrival_country}
                                  </td>

                                  <td className="table-cell-TD table-cell2-TD">
                                    {formattedArrivalDateTime}
                                  </td>
                                  <td className="table-cell-TD table-cell2-TD">
                                    {flight.seats_available}
                                  </td>
                                  <td className="table-cell-TD table-cell2-TD">
                                    {flight.seat_type}
                                  </td>
                                  <td className="table-cell-TD table-cell2-TD">
                                    {flight.price}
                                  </td>
                                  <td className="table-cell-TD table-cell2-TD">
                                    {flight.rating.toFixed(2)}
                                  </td>
                                  <td className="table-cell-TD table-cell2-TD">
                                    {returnFlightSelected ? (
                                      <>
                                        {selectedReturnFlightID ===
                                        flight.flight_id ? (
                                          <>
                                            <button
                                              className="edit-button-TD"
                                              onClick={() => {
                                                setSelectedReturnFlightID(null);
                                                setReturnFlightSelected(false);
                                                setFlightPrice(null);
                                                setFlightEmail(null);
                                              }}
                                            >
                                              Selected
                                            </button>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    ) : (
                                      <button
                                        className="edit-button-TD"
                                        onClick={() => {
                                          setSelectedReturnFlightID(
                                            flight.flight_id
                                          );
                                          setReturnFlightSelected(true);
                                          setFlightPrice(flight.price);
                                          setFlightEmail(flight.email);
                                        }}
                                      >
                                        Select
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="no-data-message-TD">
                        No Flights available.
                      </p>
                    )}
                  </div>
                </Step>
                <Step>
                  <div className={`payment-container-TD form-${formState}-TD`}>
                    <form
                      id="myForm"
                      className="payment-form-TD"
                      onSubmit={handleSubmit}
                    >
                      <h2 className="payment-header-TD">Payment Details</h2>
                      <div className="form-group-TD card-number-TD">
                        <label className="form-label-TD" htmlFor="card">
                          Card Number
                        </label>
                        <input
                          className={`form-input-TD ${
                            errors.card ? "input-error-TD" : ""
                          }`}
                          type="text"
                          id="card"
                          placeholder="1234 5678 9012 3456"
                          value={formData.card}
                          onChange={handleChange}
                        />
                        {errors.card && (
                          <div className="error-message-TD">{errors.card}</div>
                        )}
                      </div>

                      <div className="card-info-TD">
                        <div className="form-group-TD card-expiry-TD">
                          <label className="form-label-TD" htmlFor="expiry">
                            Expiry Date
                          </label>
                          <input
                            className={`form-input-TD ${
                              errors.expiry ? "input-error-TD" : ""
                            }`}
                            type="text"
                            id="expiry"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleChange}
                          />
                          {errors.expiry && (
                            <div className="error-message-TD">
                              {errors.expiry}
                            </div>
                          )}
                        </div>

                        <div className="form-group-TD card-cvv-TD">
                          <label className="form-label-TD" htmlFor="cvv">
                            CVV
                          </label>
                          <input
                            className={`form-input-TD ${
                              errors.cvv ? "input-error-TD" : ""
                            }`}
                            type="text"
                            id="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                          />
                          {errors.cvv && (
                            <div className="error-message-TD">{errors.cvv}</div>
                          )}
                        </div>
                      </div>

                      <div className="form-group-TD">
                        <label className="form-label-TD" htmlFor="amount">
                          Amount
                        </label>
                        <input
                          className={`form-input-TD ${
                            errors.amount ? "input-error-TD" : ""
                          }`}
                          type="text"
                          id="amount"
                          placeholder="$0.00"
                          value={
                            "$" + flightPrice * singlePackageData.quantity * 0.9
                          }
                          disabled
                        />
                        {errors.amount && (
                          <div className="error-message-TD">
                            {errors.amount}
                          </div>
                        )}
                      </div>

                      <button className="payment-button-TD" type="submit">
                        Pay Now
                      </button>

                      <div className="secure-badge-TD">
                        Secure payment processing
                      </div>
                    </form>
                    {formState === "shrinking" && (
                      <div className="payment-success-TD">
                        <div className="success-checkmark-TD">✓</div>
                      </div>
                    )}
                  </div>
                  {showSuccessMessage && showSuccessMessage === "success" && (
                    <div className="payment-complete-message-TD">
                      <div className="success-icon-TD">✓</div>
                      <h2 className="success-title-TD">Package Completed</h2>
                      <p className="success-text-TD">
                        Your transaction was successful!
                      </p>
                    </div>
                  )}
                  {showSuccessMessage && showSuccessMessage === "fail" && (
                    <div className="payment-failure-message-TD">
                      <div className="failure-icon-TD">✗</div>
                      <h2 className="failure-title-TD">Package Failed</h2>
                      <p className="failure-text-TD">
                        There was an issue processing your transaction.
                      </p>
                    </div>
                  )}
                  {/* <button className="payment-button-TD" onClick={handleSubmit}>
                Call API
                </button> */}
                </Step>
              </Stepper>
            ) : (
              <>Loading...</>
            )}
          </DialogContent>
        </Dialog>
      );
    };
    const AddGuide = ({ open, onClose }) => {
      const [formData, setFormData] = useState({
        card: "",
        expiry: "",
        cvv: "",
        amount: "",
      });

      // Error state
      const [errors, setErrors] = useState({});

      // Handle input changes
      // Handle input changes
      const handleChange = (e) => {
        const { id, value } = e.target;

        let formattedValue = value;

        // Format card number with spaces every 4 digits
        if (id === "card") {
          // First, filter out non-numeric characters from the input
          const numericValue = value.replace(/[^\d]/g, "");

          // Then format with spaces every 4 digits
          formattedValue = numericValue.replace(/(.{4})/g, "$1 ").trim();

          // Limit to 19 characters (16 digits + 3 spaces)
          formattedValue = formattedValue.substring(0, 19);
        }

        // Format expiry as MM/YY
        if (id === "expiry") {
          formattedValue = value.replace(/\D/g, "");
          if (formattedValue.length > 2) {
            formattedValue =
              formattedValue.substring(0, 2) +
              "/" +
              formattedValue.substring(2, 4);
          }
          // Limit to 5 characters (MM/YY)
          formattedValue = formattedValue.substring(0, 5);
        }

        // Format CVV as numbers only, max 3-4 digits
        if (id === "cvv") {
          formattedValue = value.replace(/\D/g, "").substring(0, 4);
        }

        // Format amount as currency
        if (id === "amount") {
          // Remove non-numeric characters except decimal point
          formattedValue = value.replace(/[^\d.]/g, "");

          // Ensure only one decimal point
          const parts = formattedValue.split(".");
          if (parts.length > 2) {
            formattedValue = parts[0] + "." + parts.slice(1).join("");
          }

          // Limit to two decimal places
          if (parts.length > 1) {
            formattedValue = parts[0] + "." + parts[1].substring(0, 2);
          }

          // Add dollar sign if there's a value
          if (formattedValue) {
            formattedValue = "$" + formattedValue.replace(/^\$/, "");
          }
        }

        setFormData({
          ...formData,
          [id]: formattedValue,
        });
      };
      // Validate form
      const validateForm = () => {
        const newErrors = {};

        // Validate card number (simple check for length)
        if (formData.card.replace(/\s/g, "").length !== 16) {
          newErrors.card = "Card number must be 16 digits";
        }

        // Validate expiry (check format and if not expired)
        if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
          newErrors.expiry = "Expiry must be in MM/YY format";
        } else {
          const [month, year] = formData.expiry.split("/");
          const expiryDate = new Date(
            2000 + parseInt(year),
            parseInt(month) - 1
          );
          if (expiryDate < new Date()) {
            newErrors.expiry = "Card has expired";
          }
        }

        // Validate CVV (3-4 digits)
        if (!/^\d{3,4}$/.test(formData.cvv)) {
          newErrors.cvv = "CVV must be 3-4 digits";
        }

        // Validate amount (must be a number greater than 0)

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const [formState, setFormState] = useState("visible");
      const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
          // Process payment here
          insertGuide();

          // Start the shrinking animation
          setFormState("shrinking");

          // After animation completes, fully hide the form
          setTimeout(() => {
            // Hide the form
            setFormState("hidden");

            // Show appropriate success/failure message
          }, 600); // Slightly longer than the animation duration
        }
      };
      const insertGuide = async () => {
        fetch("http://localhost:8008/Tourism/insertPackageGuide", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            package_id: singlePackageData.package_id,
            start_date: startDate,
            end_date: endDate,
            price: guidePrice,
            guide_email: guideEmail,
            city: packageCity,
            email: localStorage.getItem("email"),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              console.log(data.data);
              setTimeout(() => {
                setShowSuccessMessage("success");
              }, 600);
            } else {
              console.log("Flight not inserted!", data.data);
              setTimeout(() => {
                setShowSuccessMessage("fail");
              }, 600);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      const [guideEmail, setGuideEmail] = useState(null);
      const [showSuccessMessage, setShowSuccessMessage] = useState("undefined");
      const [guidePrice, setGuidePrice] = useState(null);
      return (
        <Dialog open={open} onClose={onClose} className="dialog-container-TD">
          <DialogContent className="dialog-content-TD">
            {singlePackageData ? (
              <Stepper
                initialStep={1}
                onStepChange={(step) => {
                  console.log(step);
                }}
                onFinalStepCompleted={() => console.log("All steps completed!")}
                backButtonText={<ChevronLeft />}
                nextButtonText={<ChevronRight />}
                validateStep={async (step) => {
                  if (step === 1) {
                    if (!guideEmail) {
                      return "Select a Guide!";
                    }
                  }
                  return true;
                }}
              >
                <Step>
                  <h2 className="step-heading-TD">
                    Select Tour Guide in {packageCity},
                    {singlePackageData.arrivalCountry}
                  </h2>
                  <div className="feedback-content2-TD">
                    {guideData && guideData.length > 0 ? (
                      guideData.map((guide) => (
                        <details
                          className="feedback-details2-TD"
                          key={guide.email}
                        >
                          <summary className="feedback-summary2-TD">
                            {guide.first_name} {guide.last_name}
                            <p className="summary-rating-TD">
                              ({guide.rating.toFixed(2)}
                              <StarIcon />)
                            </p>
                            {guideEmail === guide.email ? (
                              <>(Selected)</>
                            ) : (
                              <></>
                            )}
                          </summary>
                          <div className="feedback-content2-TD">
                            <div className="hotel-details-TD">
                              <div className="details2-TD">
                                <p className="summary-rating2-TD">
                                  Rating: ({guide.rating.toFixed(2)}
                                  <StarIcon />)
                                </p>
                                <p className="summary-rating2-TD">
                                  Phone:{guide.phone}
                                </p>
                                <p className="summary-rating2-TD">
                                  Price Per Day($):{guide.price_per_day}
                                </p>
                              </div>
                              <div className="hotel-details-right-div-TD">
                                <button
                                  className="hotel-details-right-div-button-TD"
                                  onClick={() => {
                                    if (guideEmail === guide.email) {
                                      setGuideEmail(null);
                                      setGuidePrice(null);
                                    } else {
                                      setGuideEmail(guide.email);
                                      setGuidePrice(guide.price_per_day);
                                      console.log(
                                        "price:",
                                        guide.price_per_day
                                      );
                                      console.log("days:", days);
                                    }
                                  }}
                                >
                                  {guideEmail === guide.email ? (
                                    <>Selected</>
                                  ) : (
                                    <>Select</>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </details>
                      ))
                    ) : (
                      <p>No Tour Guides Available in this city.</p>
                    )}
                  </div>
                </Step>
                <Step>
                  <div className={`payment-container-TD form-${formState}-TD`}>
                    <form
                      id="myForm"
                      className="payment-form-TD"
                      onSubmit={handleSubmit}
                    >
                      <h2 className="payment-header-TD">Payment Details</h2>
                      <div className="form-group-TD card-number-TD">
                        <label className="form-label-TD" htmlFor="card">
                          Card Number
                        </label>
                        <input
                          className={`form-input-TD ${
                            errors.card ? "input-error-TD" : ""
                          }`}
                          type="text"
                          id="card"
                          placeholder="1234 5678 9012 3456"
                          value={formData.card}
                          onChange={handleChange}
                        />
                        {errors.card && (
                          <div className="error-message-TD">{errors.card}</div>
                        )}
                      </div>

                      <div className="card-info-TD">
                        <div className="form-group-TD card-expiry-TD">
                          <label className="form-label-TD" htmlFor="expiry">
                            Expiry Date
                          </label>
                          <input
                            className={`form-input-TD ${
                              errors.expiry ? "input-error-TD" : ""
                            }`}
                            type="text"
                            id="expiry"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleChange}
                          />
                          {errors.expiry && (
                            <div className="error-message-TD">
                              {errors.expiry}
                            </div>
                          )}
                        </div>

                        <div className="form-group-TD card-cvv-TD">
                          <label className="form-label-TD" htmlFor="cvv">
                            CVV
                          </label>
                          <input
                            className={`form-input-TD ${
                              errors.cvv ? "input-error-TD" : ""
                            }`}
                            type="text"
                            id="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                          />
                          {errors.cvv && (
                            <div className="error-message-TD">{errors.cvv}</div>
                          )}
                        </div>
                      </div>

                      <div className="form-group-TD">
                        <label className="form-label-TD" htmlFor="amount">
                          Amount
                        </label>
                        <input
                          className={`form-input-TD ${
                            errors.amount ? "input-error-TD" : ""
                          }`}
                          type="text"
                          id="amount"
                          placeholder="$0.00"
                          value={"$" + guidePrice * days * 0.9}
                          disabled
                        />
                        {errors.amount && (
                          <div className="error-message-TD">
                            {errors.amount}
                          </div>
                        )}
                      </div>

                      <button className="payment-button-TD" type="submit">
                        Pay Now
                      </button>

                      <div className="secure-badge-TD">
                        Secure payment processing
                      </div>
                    </form>
                    {formState === "shrinking" && (
                      <div className="payment-success-TD">
                        <div className="success-checkmark-TD">✓</div>
                      </div>
                    )}
                  </div>
                  {showSuccessMessage && showSuccessMessage === "success" && (
                    <div className="payment-complete-message-TD">
                      <div className="success-icon-TD">✓</div>
                      <h2 className="success-title-TD">Package Completed</h2>
                      <p className="success-text-TD">
                        Your transaction was successful!
                      </p>
                    </div>
                  )}
                  {showSuccessMessage && showSuccessMessage === "fail" && (
                    <div className="payment-failure-message-TD">
                      <div className="failure-icon-TD">✗</div>
                      <h2 className="failure-title-TD">Package Failed</h2>
                      <p className="failure-text-TD">
                        There was an issue processing your transaction.
                      </p>
                    </div>
                  )}
                  {/* <button className="payment-button-TD" onClick={handleSubmit}>
                Call API
                </button> */}
                </Step>
              </Stepper>
            ) : (
              <>Loading...</>
            )}
          </DialogContent>
        </Dialog>
      );
    };
    const AddRental = ({ open, onClose }) => {
      const [formData, setFormData] = useState({
        card: "",
        expiry: "",
        cvv: "",
        amount: "",
      });

      // Error state
      const [errors, setErrors] = useState({});

      // Handle input changes
      // Handle input changes
      const handleChange = (e) => {
        const { id, value } = e.target;

        let formattedValue = value;

        // Format card number with spaces every 4 digits
        if (id === "card") {
          // First, filter out non-numeric characters from the input
          const numericValue = value.replace(/[^\d]/g, "");

          // Then format with spaces every 4 digits
          formattedValue = numericValue.replace(/(.{4})/g, "$1 ").trim();

          // Limit to 19 characters (16 digits + 3 spaces)
          formattedValue = formattedValue.substring(0, 19);
        }

        // Format expiry as MM/YY
        if (id === "expiry") {
          formattedValue = value.replace(/\D/g, "");
          if (formattedValue.length > 2) {
            formattedValue =
              formattedValue.substring(0, 2) +
              "/" +
              formattedValue.substring(2, 4);
          }
          // Limit to 5 characters (MM/YY)
          formattedValue = formattedValue.substring(0, 5);
        }

        // Format CVV as numbers only, max 3-4 digits
        if (id === "cvv") {
          formattedValue = value.replace(/\D/g, "").substring(0, 4);
        }

        // Format amount as currency
        if (id === "amount") {
          // Remove non-numeric characters except decimal point
          formattedValue = value.replace(/[^\d.]/g, "");

          // Ensure only one decimal point
          const parts = formattedValue.split(".");
          if (parts.length > 2) {
            formattedValue = parts[0] + "." + parts.slice(1).join("");
          }

          // Limit to two decimal places
          if (parts.length > 1) {
            formattedValue = parts[0] + "." + parts[1].substring(0, 2);
          }

          // Add dollar sign if there's a value
          if (formattedValue) {
            formattedValue = "$" + formattedValue.replace(/^\$/, "");
          }
        }

        setFormData({
          ...formData,
          [id]: formattedValue,
        });
      };
      // Validate form
      const validateForm = () => {
        const newErrors = {};

        // Validate card number (simple check for length)
        if (formData.card.replace(/\s/g, "").length !== 16) {
          newErrors.card = "Card number must be 16 digits";
        }

        // Validate expiry (check format and if not expired)
        if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
          newErrors.expiry = "Expiry must be in MM/YY format";
        } else {
          const [month, year] = formData.expiry.split("/");
          const expiryDate = new Date(
            2000 + parseInt(year),
            parseInt(month) - 1
          );
          if (expiryDate < new Date()) {
            newErrors.expiry = "Card has expired";
          }
        }

        // Validate CVV (3-4 digits)
        if (!/^\d{3,4}$/.test(formData.cvv)) {
          newErrors.cvv = "CVV must be 3-4 digits";
        }

        // Validate amount (must be a number greater than 0)

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };

      const [formState, setFormState] = useState("visible");
      const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
          // Process payment here
          insertRental();

          // Start the shrinking animation
          setFormState("shrinking");

          // After animation completes, fully hide the form
          setTimeout(() => {
            // Hide the form
            setFormState("hidden");

            // Show appropriate success/failure message
          }, 600); // Slightly longer than the animation duration
        }
      };
      const insertRental = async () => {
        fetch("http://localhost:8008/Tourism/insertPackageRental", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            package_id: singlePackageData.package_id,
            start_date: startDate,
            end_date: endDate,
            price: rentalPrice,
            rental_email: rentalEmail,
            city: packageCity,
            email: localStorage.getItem("email"),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              console.log(data.data);
              setTimeout(() => {
                setShowSuccessMessage("success");
              }, 600);
            } else {
              console.log("Flight not inserted!", data.data);
              setTimeout(() => {
                setShowSuccessMessage("fail");
              }, 600);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      const [rentalEmail, setRentalEmail] = useState(null);
      const [showSuccessMessage, setShowSuccessMessage] = useState("undefined");
      const [rentalPrice, setRentalPrice] = useState(null);
      return (
        <Dialog open={open} onClose={onClose} className="dialog-container-TD">
          <DialogContent className="dialog-content-TD">
            {singlePackageData ? (
              <Stepper
                initialStep={1}
                onStepChange={(step) => {
                  console.log(step);
                }}
                onFinalStepCompleted={() => console.log("All steps completed!")}
                backButtonText={<ChevronLeft />}
                nextButtonText={<ChevronRight />}
                validateStep={async (step) => {
                  if (step === 1) {
                    if (!rentalEmail) {
                      return "Select a Car Rental!";
                    }
                  }
                  return true;
                }}
              >
                <Step>
                  <h2 className="step-heading-TD">
                    Select Car Rental in {packageCity},
                    {singlePackageData.arrivalCountry}
                  </h2>
                  <div className="feedback-content2-TD">
                    {rentalData && rentalData.length > 0 ? (
                      rentalData.map((rental) => (
                        <details
                          className="feedback-details2-TD"
                          key={rental.email}
                        >
                          <summary className="feedback-summary2-TD">
                            {rental.first_name} {rental.last_name}
                            <p className="summary-rating-TD">
                              ({rental.rating.toFixed(2)}
                              <StarIcon />)
                            </p>
                            {rentalEmail === rental.email ? (
                              <>(Selected)</>
                            ) : (
                              <></>
                            )}
                          </summary>
                          <div className="feedback-content2-TD">
                            <div className="hotel-details-TD">
                              <div className="details2-TD">
                                <p className="summary-rating2-TD">
                                  Rating: ({rental.rating.toFixed(2)}
                                  <StarIcon />)
                                </p>
                                <p className="summary-rating2-TD">
                                  Phone:{rental.phone}
                                </p>
                                <p className="summary-rating2-TD">
                                  Price Per Day($):{rental.price_per_day}
                                </p>
                              </div>
                              <div className="hotel-details-right-div-TD">
                                <button
                                  className="hotel-details-right-div-button-TD"
                                  onClick={() => {
                                    if (rentalEmail === rental.email) {
                                      setRentalEmail(null);
                                      setRentalPrice(null);
                                    } else {
                                      setRentalEmail(rental.email);
                                      setRentalPrice(rental.price_per_day);
                                      console.log(
                                        "price:",
                                        rental.price_per_day
                                      );
                                      console.log("days:", days);
                                    }
                                  }}
                                >
                                  {rentalEmail === rental.email ? (
                                    <>Selected</>
                                  ) : (
                                    <>Select</>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </details>
                      ))
                    ) : (
                      <p>No Car Rentals Available in this city.</p>
                    )}
                  </div>
                </Step>
                <Step>
                  <div className={`payment-container-TD form-${formState}-TD`}>
                    <form
                      id="myForm"
                      className="payment-form-TD"
                      onSubmit={handleSubmit}
                    >
                      <h2 className="payment-header-TD">Payment Details</h2>
                      <div className="form-group-TD card-number-TD">
                        <label className="form-label-TD" htmlFor="card">
                          Card Number
                        </label>
                        <input
                          className={`form-input-TD ${
                            errors.card ? "input-error-TD" : ""
                          }`}
                          type="text"
                          id="card"
                          placeholder="1234 5678 9012 3456"
                          value={formData.card}
                          onChange={handleChange}
                        />
                        {errors.card && (
                          <div className="error-message-TD">{errors.card}</div>
                        )}
                      </div>

                      <div className="card-info-TD">
                        <div className="form-group-TD card-expiry-TD">
                          <label className="form-label-TD" htmlFor="expiry">
                            Expiry Date
                          </label>
                          <input
                            className={`form-input-TD ${
                              errors.expiry ? "input-error-TD" : ""
                            }`}
                            type="text"
                            id="expiry"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleChange}
                          />
                          {errors.expiry && (
                            <div className="error-message-TD">
                              {errors.expiry}
                            </div>
                          )}
                        </div>

                        <div className="form-group-TD card-cvv-TD">
                          <label className="form-label-TD" htmlFor="cvv">
                            CVV
                          </label>
                          <input
                            className={`form-input-TD ${
                              errors.cvv ? "input-error-TD" : ""
                            }`}
                            type="text"
                            id="cvv"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange}
                          />
                          {errors.cvv && (
                            <div className="error-message-TD">{errors.cvv}</div>
                          )}
                        </div>
                      </div>

                      <div className="form-group-TD">
                        <label className="form-label-TD" htmlFor="amount">
                          Amount
                        </label>
                        <input
                          className={`form-input-TD ${
                            errors.amount ? "input-error-TD" : ""
                          }`}
                          type="text"
                          id="amount"
                          placeholder="$0.00"
                          value={"$" + rentalPrice * days * 0.9}
                          disabled
                        />
                        {errors.amount && (
                          <div className="error-message-TD">
                            {errors.amount}
                          </div>
                        )}
                      </div>

                      <button className="payment-button-TD" type="submit">
                        Pay Now
                      </button>

                      <div className="secure-badge-TD">
                        Secure payment processing
                      </div>
                    </form>
                    {formState === "shrinking" && (
                      <div className="payment-success-TD">
                        <div className="success-checkmark-TD">✓</div>
                      </div>
                    )}
                  </div>
                  {showSuccessMessage && showSuccessMessage === "success" && (
                    <div className="payment-complete-message-TD">
                      <div className="success-icon-TD">✓</div>
                      <h2 className="success-title-TD">Package Completed</h2>
                      <p className="success-text-TD">
                        Your transaction was successful!
                      </p>
                    </div>
                  )}
                  {showSuccessMessage && showSuccessMessage === "fail" && (
                    <div className="payment-failure-message-TD">
                      <div className="failure-icon-TD">✗</div>
                      <h2 className="failure-title-TD">Package Failed</h2>
                      <p className="failure-text-TD">
                        There was an issue processing your transaction.
                      </p>
                    </div>
                  )}
                  {/* <button className="payment-button-TD" onClick={handleSubmit}>
                Call API
                </button> */}
                </Step>
              </Stepper>
            ) : (
              <>Loading...</>
            )}
          </DialogContent>
        </Dialog>
      );
    };
    const [openFeedbackCard, setOpenFeedbackCard] = useState(false);
    const [receiver, setReceiver] = useState({
      first_name: "",
      last_name: "",
      email: "",
    });
    const handleClickOpenFeedbackCard = (firstName, lastName, email) => {
      setReceiver({
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
      setOpenFeedbackCard(true);
    };

    const handleCloseFeedbackCard = () => {
      setReceiver({
        first_name: "",
        last_name: "",
        email: "",
      });
      setOpenFeedbackCard(false);
    };
    const FeedbackCard = ({ open, onClose }) => {
      const SubmitFeedback = () => {
        console.log("jhggjhgj");
        fetch("http://localhost:8008/Tourism/SubmitFeedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
            t_email: receiver.email,
            desc: feedbackDescription,
            rate: rating,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              window.alert("Feedback Submitted!");
              handleCloseFeedbackCard();
            } else {
              console.log("Feedback not Submitted!", data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      const [feedbackDescription, setFeedbackDescription] = useState("");
      const [rating, setRating] = useState(0);

      const handleStarClick = (value) => {
        setRating(value);
      };

      const handleStarHover = (value) => {
        highlightStars(value);
      };

      const handleStarMouseOut = () => {
        highlightStars(rating);
      };

      const highlightStars = (value) => {
        const stars = document.querySelectorAll(".star-RD");
        stars.forEach((star) => {
          const starValue = parseFloat(star.dataset.value);
          if (starValue <= value) {
            star.classList.add("selected");
          } else {
            star.classList.remove("selected");
          }
        });
      };

      const stars = [];
      for (let i = 0; i <= 5; i += 0.5) {
        stars.push(
          <span
            key={i}
            className="star-RD"
            data-value={i}
            onClick={() => handleStarClick(i)}
            onMouseOver={() => handleStarHover(i)}
            onMouseOut={() => handleStarMouseOut()}
          >
            <StarIcon sx={{ fontSize: "2.2rem !important" }} />
          </span>
        );
      }

      return (
        <Dialog open={open} onClose={onClose} className="feedback-dialog-RD">
          <div className="dialog-content-RD">
            <h1 className="heading-GD">
              <strong>Feedback</strong>
            </h1>
            <div className="rating-RD">
              <div className="star-container-RD">
                {stars}
                <p>Rating: {rating}</p>
              </div>
            </div>
            <TextField
              label="Receiver Name"
              value={receiver.first_name + " " + receiver.last_name}
              disabled
              className="dialog-field-RD disabled-field-RD"
            />

            <TextField
              label="Sender Email"
              value={localStorage.getItem("email")}
              disabled
              className="dialog-field-RD disabled-field-RD"
            />

            <div className="feedback-input-container-RD">
              <TextField
                type="text"
                label="Feedback Description"
                inputProps={{ maxLength: 500, className: "expanding-input-RD" }}
                multiline
                required
                maxRows={4}
                onChange={(e) => setFeedbackDescription(e.target.value)}
                className="dialog-field-RD feedback-input-RD"
              />
              <p className="char-count-RD">{feedbackDescription.length}/500</p>
            </div>

            <Button className="submit-button-RD" onClick={SubmitFeedback}>
              Submit
            </Button>
          </div>
        </Dialog>
      );
    };
    const [openSummary, setOpenSummary] = useState(null);
    const [openSummary2, setOpenSummary2] = useState(null);
    return (
      <div className="Tourist-content-TD">
        <h1 className="heading-room-HD">Your Packages</h1>
        {packageData && packageData.length > 0 ? (
          packageData.map((packageItem) => (
            <details
              className="feedback-details2-TD"
              key={packageItem.package_id}
              open={openSummary === packageItem.package_id}
            >
              <summary
                className="feedback-summary3-TD"
                onClick={() => {
                  setOpenSummary(packageItem.package_id);
                }}
              >
                {packageItem.departureCity},{packageItem.departureCountry}
                <FlightTakeoffIcon />
                {packageItem.arrivalCountry}
              </summary>
              <div className="feedback-content2-TD">
                <div
                  className="heading-TD"
                  style={{
                    textAlign: "left",
                    marginTop: "5vh",
                    width: "fit-content",
                  }}
                >
                  <strong>Package Information:</strong>
                </div>
                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    {" "}
                    Departure Country:{" "}
                    <span className="package-data-TD">
                      {packageItem.departureCity},{" "}
                      {packageItem.departureCountry}
                    </span>
                  </p>
                </div>
                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    {" "}
                    Package Country:{" "}
                    <span className="package-data-TD">
                      {packageItem.arrivalCountry}
                    </span>
                  </p>
                </div>
                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    {" "}
                    Cities Selected:{" "}
                    <span className="package-data-TD">
                      {Object.keys(packageItem.dataObject).length}
                    </span>
                  </p>
                </div>
                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    {" "}
                    Start Date:{" "}
                    <span className="package-data-TD">
                      {packageItem.start_date}
                    </span>
                  </p>
                </div>
                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    {" "}
                    End date:{" "}
                    <span className="package-data-TD">
                      {packageItem.end_date}
                    </span>
                  </p>
                </div>
                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    Tourist Quantity:{" "}
                    <span className="package-data-TD">
                      {packageItem.quantity}
                    </span>
                  </p>
                </div>

                <div
                  className="heading-TD"
                  style={{
                    textAlign: "left",
                    marginTop: "5vh",
                    width: "fit-content",
                  }}
                >
                  <strong>Flight Information:</strong>
                </div>
                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    Airline Name:{" "}
                    <span className="package-data-TD">
                      {packageItem.airline_first_name}{" "}
                      {packageItem.airline_last_name}
                    </span>
                  </p>
                  <button
                    className="add-flight-btn-TD"
                    onClick={() => {
                      handleOpenFlightDetails();
                      setLoadingState("loading");
                      getFlightDetails(packageItem.flightID);
                    }}
                  >
                    Flight Details
                  </button>
                </div>

                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    Price:{" "}
                    <span className="package-data-TD">
                      {packageItem.flight_price}$
                    </span>
                  </p>
                  <button
                    className="add-flight-btn-TD"
                    // disabled={packageItem.status.toLowerCase() !== "completed"}
                    onClick={() =>
                      handleClickOpenFeedbackCard(
                        packageItem.airline_first_name,
                        packageItem.airline_last_name,
                        packageItem.airline_email
                      )
                    }
                  >
                    Feedback
                  </button>
                </div>
                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    Return Flight Selected:{" "}
                    <span className="package-data-TD">
                      {packageItem.returnFlightID ? "Yes" : "No"}
                    </span>
                  </p>
                  <button
                    className="add-flight-btn-TD"
                    disabled={
                      packageItem.returnFlightID ||
                      (!packageItem.returnFlightID &&
                        packageItem.status.toLowerCase() === "completed")
                    }
                    onClick={() => {
                      handleOpenAddFlight(packageItem);
                    }}
                  >
                    Add Flight
                  </button>
                </div>
                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    Return Airline Name:{" "}
                    <span className="package-data-TD">
                      {packageItem.returnFlightID ? (
                        <>
                          {packageItem.return_airline_first_name}{" "}
                          {packageItem.return_airline_last_name}
                        </>
                      ) : (
                        <>N/A</>
                      )}
                    </span>
                  </p>
                  <button
                    className="add-flight-btn-TD"
                    onClick={() => {
                      handleOpenFlightDetails();
                      setLoadingState("loading");
                      getFlightDetails(packageItem.returnFlightID);
                    }}
                  >
                    Flight Details
                  </button>
                </div>
                <div className="return-flight-container-TD">
                  <p className="return-flight-TD">
                    Price:{" "}
                    <span className="package-data-TD">
                      {packageItem.return_flight_price}$
                    </span>
                  </p>
                  <button
                    className="add-flight-btn-TD"
                    // disabled={
                    //   packageItem.returnFlightID === null ||
                    //   packageItem.status.toLowerCase() !== "completed"
                    // }
                    onClick={() =>
                      handleClickOpenFeedbackCard(
                        packageItem.return_airline_first_name,
                        packageItem.return_airline_last_name,
                        packageItem.return_airline_email
                      )
                    }
                  >
                    Feedback
                  </button>
                </div>
                <div style={{ marginTop: "5vh" }}></div>
                {Object.keys(packageItem.dataObject).map((city) => (
                  <details
                    className="feedback-details2-TD"
                    key={city}
                    open={openSummary2 === city}
                  >
                    <summary
                      className="feedback-summary3-TD"
                      onClick={() => {
                        setOpenSummary2(city);
                      }}
                    >
                      {city}
                    </summary>
                    <div className="feedback-content2-TD">
                      <div className="return-flight-container-TD">
                        <p className="return-flight-TD">
                          City Name:{" "}
                          <span className="package-data-TD">{city}</span>
                        </p>
                      </div>

                      <div className="return-flight-container-TD">
                        <p className="return-flight-TD">
                          Days Stay:{" "}
                          <span className="package-data-TD">
                            {packageItem.dataObject[city].days}
                          </span>
                        </p>
                        <button
                          className="add-flight-btn-TD"
                          // disabled={
                          //   packageItem.status.toLowerCase() !== "completed"
                          // }
                          onClick={() =>
                            handleClickOpenFeedbackCard(
                              packageItem.dataObject[city].first_name,
                              packageItem.dataObject[city].last_name,
                              packageItem.dataObject[city].email
                            )
                          }
                        >
                          Feedback
                        </button>
                      </div>
                      <div
                        className="heading-TD"
                        style={{
                          textAlign: "left",
                          marginTop: "5vh",
                          width: "fit-content",
                        }}
                      >
                        <strong>Hotel Information:</strong>
                      </div>

                      <div>
                        <table className="Tourist-table-TD">
                          <thead className="table-head2-TD">
                            <tr>
                              <th className="table-header-TD">Hotel</th>
                              <th className="table-header-TD">Room Type</th>
                              <th className="table-header-TD">Room Price($)</th>
                            </tr>
                          </thead>
                          {Object.keys(
                            packageItem.dataObject[city].room_packages
                          ).map((room_id) => (
                            <tbody className="table-body-TD">
                              <tr className="table-row-TD" key={room_id}>
                                <td className="table-cell-TD table-cell4-TD">
                                  {packageItem.dataObject[city].first_name}{" "}
                                  {packageItem.dataObject[city].last_name}
                                </td>
                                <td className="table-cell-TD table-cell4-TD">
                                  {
                                    packageItem.dataObject[city].room_types[
                                      room_id
                                    ]
                                  }
                                </td>
                                <td className="table-cell-TD table-cell4-TD">
                                  {
                                    packageItem.dataObject[city].room_packages[
                                      room_id
                                    ]
                                  }
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </table>
                      </div>
                      <div
                        className="heading-TD"
                        style={{
                          textAlign: "left",
                          marginTop: "5vh",
                          width: "fit-content",
                        }}
                      >
                        <strong>Tour Guide Information:</strong>
                      </div>

                      <div className="return-flight-container-TD">
                        <p className="return-flight-TD">
                          Tour Guide Selected:{" "}
                          <span className="package-data-TD">
                            {packageItem.dataObject[city].guide_email
                              ? "Yes"
                              : "No"}
                          </span>
                        </p>
                        <button
                          className="add-flight-btn-TD"
                          disabled={
                            packageItem.dataObject[city].guide_email ||
                            (!packageItem.dataObject[city].guide_email &&
                              packageItem.status.toLowerCase() !== "pending")
                          }
                          onClick={() => {
                            handleOpenAddGuide(packageItem, city);
                          }}
                        >
                          Add Tour Guide
                        </button>
                      </div>
                      <div className="return-flight-container-TD">
                        <p className="return-flight-TD">
                          Name:{" "}
                          <span className="package-data-TD">
                            {packageItem.dataObject[city].guide_email ? (
                              <>
                                {packageItem.dataObject[city].guide_first_name}{" "}
                                {packageItem.dataObject[city].guide_last_name}
                              </>
                            ) : (
                              <>N/A</>
                            )}
                          </span>
                        </p>
                        <button
                          className="add-flight-btn-TD"
                          // disabled={
                          //   packageItem.dataObject[city].guide_email === null ||
                          //   packageItem.status.toLowerCase() !== "completed"
                          // }
                          onClick={() =>
                            handleClickOpenFeedbackCard(
                              packageItem.dataObject[city].guide_first_name,
                              packageItem.dataObject[city].guide_last_name,
                              packageItem.dataObject[city].guide_email
                            )
                          }
                        >
                          Feedback
                        </button>
                      </div>

                      <div
                        className="heading-TD"
                        style={{
                          textAlign: "left",
                          marginTop: "5vh",
                          width: "fit-content",
                        }}
                      >
                        <strong>Car Rental Information:</strong>
                      </div>

                      <div className="return-flight-container-TD">
                        <p className="return-flight-TD">
                          Car Rental Selected:{" "}
                          <span className="package-data-TD">
                            {packageItem.dataObject[city].rental_email
                              ? "Yes"
                              : "No"}
                          </span>
                        </p>
                        <button
                          className="add-flight-btn-TD"
                          disabled={
                            packageItem.dataObject[city].rental_email ||
                            (!packageItem.dataObject[city].rental_email &&
                              packageItem.status.toLowerCase() !== "pending")
                          }
                          onClick={() => {
                            handleOpenAddRental(packageItem, city);
                          }}
                        >
                          Add Car Rental
                        </button>
                      </div>
                      <div className="return-flight-container-TD">
                        <p className="return-flight-TD">
                          Name:{" "}
                          <span className="package-data-TD">
                            {packageItem.dataObject[city].rental_email ? (
                              <>
                                {packageItem.dataObject[city].rental_first_name}{" "}
                                {packageItem.dataObject[city].rental_last_name}
                              </>
                            ) : (
                              <>N/A</>
                            )}
                          </span>
                        </p>
                        <button
                          className="add-flight-btn-TD"
                          // disabled={
                          //   packageItem.dataObject[city].rental_email ===
                          //     null ||
                          //   packageItem.status.toLowerCase() !== "completed"
                          // }
                          onClick={() =>
                            handleClickOpenFeedbackCard(
                              packageItem.dataObject[city].rental_first_name,
                              packageItem.dataObject[city].rental_last_name,
                              packageItem.dataObject[city].rental_email
                            )
                          }
                        >
                          Feedback
                        </button>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </details>
          ))
        ) : (
          <>No Packages Found. Create a Package!</>
        )}

        {
          <FlightDetails
            open={flightDetailsDisplay}
            onClose={handleCloseFlightDetails}
          />
        }
        {<AddFlight open={addFlight} onClose={handleCloseAddFlight} />}
        {<AddGuide open={addGuide} onClose={handleCloseAddGuide} />}
        {<AddRental open={addRental} onClose={handleCloseAddRental} />}
        <FeedbackCard
          open={openFeedbackCard}
          onClose={handleCloseFeedbackCard}
        />
      </div>
    );
  };

  const [stepperDisplay, setStepperDisplay] = useState(false);

  const handleOpenPackageStepper = () => {
    setStepperDisplay(true);
  };

  const handleClosePackageStepper = () => {
    setStepperDisplay(false);
  };

  const TravelPackages = () => {
    return (
      <>
        <div className="Tourist-content-TD">
          <h1 className="heading-room-HD">Travel The World!</h1>
          <button
            onClick={handleOpenPackageStepper}
            className={"travel-btn travel-btn-animated"}
          >
            <span className="btn-content">
              Let's Travel
              <ChevronRight className="btn-icon" size={18} />
            </span>
          </button>
        </div>
        {
          <PackageStepper
            open={stepperDisplay}
            onClose={handleClosePackageStepper}
          />
        }
      </>
    );
  };
  const TouristButton = styled(Button)(({ theme }) => ({
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
      <div className="star-rating-TD">
        {[...Array(5)].map((_, index) => {
          const fullStars = Math.floor(rating);
          const hasHalfStar = rating % 1 >= 0.5;
          const starType =
            index < fullStars
              ? "full"
              : index === fullStars && hasHalfStar
              ? "half"
              : "empty";

          return (
            <span key={index} className={`star ${starType}`}>
              {starType === "full" ? (
                <StarIcon />
              ) : starType === "half" ? (
                <StarHalfIcon />
              ) : (
                <StarOutline />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  const FeedbackContent = () => {
    return (
      <div>
        <div className="Tourist-content-TD">
          <h1 className="heading-room-HD">Feedback</h1>
          {displayFeedbackData.length > 0 ? (
            <>
              <h3 className="heading-room-rating-HD">
                Average Rating: {displayFeedbackData[0].avg_rating} <StarIcon />
              </h3>
              {displayFeedbackData.map((reserv) => (
                <details
                  className="feedback-details-AD"
                  key={reserv.feedback_id}
                >
                  <summary className="feedback-summary-AD">
                    {reserv.first_name} {reserv.last_name} ({reserv.rating}{" "}
                    <StarIcon sx={{ color: "#ffc107", margin: "0px" }} />)
                  </summary>
                  <div className="feedback-content-TD">
                    <div className="feedback-rating-TD">
                      Rating: <StarRating rating={reserv.rating} />
                    </div>

                    <p className="feedback-text-TD">
                      Description:&nbsp;
                      {reserv.description}
                    </p>
                  </div>
                </details>
              ))}
            </>
          ) : (
            <p className="no-data-message-TD">No feedback available.</p>
          )}
        </div>
      </div>
    );
  };
  const getAccountStatus = () => {
    fetch("http://localhost:8008/Tourism/AccountStatusRetreival", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: localStorage.getItem("email") }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          if (data.data[0].status === 0) {
            setAccountStatus(false);
          }
        } else {
          console.log("Status not retreived!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [accountStatus, setAccountStatus] = useState(true);

  const SettingContent = () => {
    const [error, setError] = useState("");
    const [updatedData, setUpdatedData] = useState({
      first_name: "",
      last_name: "",
      age: "",
      phone: "",
      address: "",
      password: "",
    });

    const updateData = () => {
      console.log("Hello", updatedData);
      fetch("http://localhost:8008/Tourism/updateUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedData,
          email: localStorage.getItem("email"),
          country: selectedCountryName,
          city: selectedCity,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log("Airline Data updated!");
          } else {
            console.log("Airline Data not updated!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCountryName, setSelectedCountryName] = useState("");
    const [editData, setEditData] = useState(false);

    const saveChanges = (e) => {
      e.preventDefault();

      if (updatedData.first_name === "") {
        setError("Enter a valid first name!");
        return;
      }
      if (updatedData.last_name === "") {
        setError("Enter a valid last name!");
        return;
      }
      if (updatedData.age < 18 || updatedData.age > 150) {
        setError("Enter a valid age!");
        return;
      }
      if (updatedData.phone === "") {
        setError("Enter a valid phone number!");
        return;
      }
      if (selectedCountryName === "") {
        setError("Select a valid country!");
        return;
      }
      if (selectedCity === "") {
        setError("Select a valid city!");
        return;
      }
      if (updatedData.address === "") {
        setError("Enter a valid address!");
        return;
      }
      if (updatedData.password === "") {
        setError("Enter a valid password!");
        return;
      }
      if (updatedData.password !== confPassword) {
        setError("Passwords do not match!");
        return;
      }

      setError("");
      console.log("Updated-Data", updatedData);
      updateData();
      window.location.reload();
    };
    const [confPassword, setConfPassword] = useState("");
    const editDataButton = () => {
      console.log("Hello");
      if (!editData) {
        setUpdatedData({
          first_name: AccountData.first_name,
          last_name: AccountData.last_name,
          age: AccountData.age,
          address: AccountData.address,
          password: AccountData.password,
          phone: AccountData.phone,
        });
        setConfPassword(AccountData.password);
      }
      setEditData(!editData);
    };

    const lockAccount = () => {
      //lock Account
      const confirmation = window.confirm("Select 'OK' to confirm");
      if (confirmation) {
        fetch("http://localhost:8008/Tourism/UpdateAccountStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: localStorage.getItem("email") }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              setAccountStatus(!accountStatus);
            } else {
              console.log("Status not updated!", data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    const [error2, setError2] = useState(null);
    const deleteAccountAPI = () => {
      fetch("http://localhost:8008/Tourism/DeleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: localStorage.getItem("email") }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            setError2("Account Deleted!");
            setTimeout(logOut(), 3000);
          } else {
            console.log("API failed!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const deleteAccount = () => {
      //delete Account
      //check if there are reservations,if not,delete account
      const confirmation = window.confirm(
        "Delete Account(This action can NOT be reversed)? Select 'OK' to confirm"
      );
      if (confirmation) {
        fetch("http://localhost:8008/Tourism/CheckPackageCount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: localStorage.getItem("email") }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              console.log("data:", data.data);
              if (data.data[0].package_count > 0) {
                window.alert(
                  "Account cannot be deleted if an ongoing or pending package exists"
                );
              } else {
                deleteAccountAPI();
                setTimeout(logOut(), 3000);
              }
            } else {
              console.log("API failed!", data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const handleCountryChange = (event) => {
      event.preventDefault();
      if (event.target.value === "") {
        return;
      }
      const countryIsoCode = event.target.value;
      setSelectedCountry(countryIsoCode);
      setSelectedCountryName(Country.getCountryByCode(countryIsoCode).name);
      setSelectedCity(""); // Reset city when the country changes

      // Fetch cities for the selected country
      if (countryIsoCode) {
        const countryCities = City.getCitiesOfCountry(countryIsoCode);
        setCities(countryCities);
      } else {
        setCities([]); // Reset cities if no country is selected
      }
    };
    // Handle city selection
    const handleCityChange = (event) => {
      event.preventDefault();
      if (event.target.value === "") {
        return;
      }
      setSelectedCity(event.target.value);
    };
    const handleUpdatedDataInputChange = (event, field) => {
      setUpdatedData((prevData) => ({
        ...prevData,
        [field]: event.target.value,
      }));
    };

    return (
      <div>
        <h2 className="heading-TD">Settings</h2>
        {editData === true ? (
          <div className="setting-content-div-HD">
            <TextField
              type="text"
              className="seats-input2-TD"
              label="First Name"
              value={updatedData.first_name}
              style={{ width: "35%" }}
              onChange={(e) => handleUpdatedDataInputChange(e, "first_name")}
              required
            >
              First Name
            </TextField>
            <TextField
              type="text"
              className="seats-input2-TD"
              label="Last Name"
              style={{ width: "35%" }}
              value={updatedData.last_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "last_name")}
              required
            >
              Last Name
            </TextField>
            <p className="data-AD">
              <strong>Email:</strong> {AccountData.email}
            </p>

            <TextField
              type="number"
              className="seats-input2-TD"
              style={{ width: "35%" }}
              label="Age(18-150)"
              value={updatedData.age}
              onChange={(e) => handleUpdatedDataInputChange(e, "age")}
              required
            >
              Age
            </TextField>
            <TextField
              type="tel"
              className="seats-input2-TD"
              label="Phone"
              style={{ width: "35%" }}
              value={updatedData.phone}
              onChange={(e) => handleUpdatedDataInputChange(e, "phone")}
              required
            >
              Phone
            </TextField>
            <InputLabel id="country-label">Select Country</InputLabel>
            <Select
              required
              labelId="country-label"
              id="country"
              size="small"
              className="seats-input2-TD"
              value={selectedCountry}
              label="Select Country"
              sx={{
                marginBottom: "2.5vh",
                paddingTop: "4vh !important",
                paddingBottom: "4vh !important",
                height: " 3vh !important",
                width: "35% !important",
              }}
              fullWidth
              onChange={handleCountryChange}
            >
              <MenuItem value="">Select Country</MenuItem>
              {Country.getAllCountries().map((country) => (
                <MenuItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>

            <InputLabel id="city-label">Select City</InputLabel>

            <Select
              required
              labelId="city-label"
              id="city"
              className="seats-input2-TD"
              disabled={!selectedCountry}
              fullWidth
              value={selectedCity}
              label="Select City"
              size="small"
              sx={{
                marginBottom: "2.5vh",
                paddingTop: "4vh !important",
                paddingBottom: "4vh !important",
                height: " 3vh !important",
                width: "35% !important",
              }}
              onChange={handleCityChange}
            >
              <MenuItem value="">Select City</MenuItem>
              {cities.map((city) => (
                <MenuItem key={city.name} value={city.name}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
            <TextField
              type="text"
              className="seats-input2-TD"
              label="Complete Address"
              style={{ width: "35%" }}
              value={updatedData.address}
              onChange={(e) => handleUpdatedDataInputChange(e, "address")}
              required
            >
              Address
            </TextField>
            <TextField
              type="password"
              className="seats-input2-TD"
              label="Enter Password"
              style={{ width: "35%" }}
              value={updatedData.password}
              onChange={(e) => handleUpdatedDataInputChange(e, "password")}
              required
            >
              Password
            </TextField>
            <TextField
              type="password"
              className="seats-input2-TD"
              label="Confirm Password"
              style={{ width: "35%" }}
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
            >
              Confirm Password
            </TextField>

            {error && <p className="error-message-TD">{error}</p>}
          </div>
        ) : (
          <div className="setting-content-div-HD">
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
              <strong>
                Password: {"*".repeat(AccountData.password.length)}
              </strong>
            </p>
          </div>
        )}
        <div className="setting-container-AD">
          {editData && (
            <button className="room-option-HD" onClick={saveChanges}>
              <SaveIcon />
              Save
            </button>
          )}
          <button className="room-option-HD" onClick={editDataButton}>
            <EditIcon />
            {editData ? "Cancel Edit" : "Edit Info"}
          </button>
        </div>

        <div className="setting-container-AD">
          <button onClick={lockAccount} className="room-option-HD">
            {accountStatus ? (
              <>
                <LockIcon /> Lock Account
              </>
            ) : (
              <>
                <LockOpenIcon /> Unlock Account
              </>
            )}
          </button>
          <button className="room-option-HD" onClick={deleteAccount}>
            <DeleteIcon />
            Delete Account
          </button>
        </div>
        <div className="setting-container-TD">
          {error2 && <p className="error-message2-TD">{error2}</p>}
        </div>

        {accountStatus ? (
          <p className="locking-account-message-TD">
            <LockIcon />
            Locking Account will NOT show your Profile to the Tourists for
            reservations
          </p>
        ) : (
          <p className="locking-account-message-TD">
            <LockOpenIcon />
            Unlocking Account will show your Profile to the Tourists for
            reservations
          </p>
        )}
      </div>
    );
  };

  const cardComponents = {
    Home: HomeContent,
    Packages: Packages,
    TravelPackages: TravelPackages,
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
  function toggleMenu() {
    const menu = document.querySelector(".menu-TD");
    const hamburgerIcon = document.querySelector(".hamburger-icon-TD");
    menu.classList.toggle("open-TD");
    hamburgerIcon.classList.toggle("open-TD");
    setIsOpen(!isOpen);
  }
  return (
    <div>
      <div className="background-TD"></div>
      <div className="main-container-TD">
        <div className="hamburger-menu-TD">
          <button
            className={`hamburger-icon-TD ${isOpen ? "open-TD" : ""}`}
            onClick={toggleMenu}
          >
            <span
              className={`line-TD line-top-TD ${isOpen ? "open-TD" : ""}`}
            ></span>
            <span
              className={`line-TD line-middle-TD ${isOpen ? "open-TD" : ""}`}
            ></span>
            <span
              className={`line-TD line-bottom-TD ${isOpen ? "open-TD" : ""}`}
            ></span>
          </button>

          <nav className={`menu-TD `}>
            <ul>
              <li>
                <button
                  className="button-TD"
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
                  className="button-TD"
                  onClick={() => {
                    setActiveCard("Packages");
                    localStorage.setItem("activeCard", "Packages");
                  }}
                >
                  <HistoryIcon />
                  Packages
                </button>
              </li>
              <li>
                <button
                  className="button-TD"
                  onClick={() => {
                    setActiveCard("TravelPackages");
                    localStorage.setItem("activeCard", "TravelPackages");
                  }}
                >
                  <PublicIcon />
                  Travel the World
                </button>
              </li>
              <li>
                <button
                  className="button-TD"
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
                  className="button-TD"
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
                <button className="button-TD" onClick={logOut}>
                  <LogoutIcon />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content-TD">
          <div className="details-TD">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default TouristDashboard;
