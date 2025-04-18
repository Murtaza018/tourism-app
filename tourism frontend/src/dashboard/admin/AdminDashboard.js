import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import { useState, useEffect, Suspense } from "react";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import Aurora from "../../components/Aurora";
import { Country, City } from "country-state-city";
import { Hotel, Plane, Car, UsersRound, MapPinned } from "lucide-react";

import StarIcon from "@mui/icons-material/Star";
import {
  Button,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { PersonAddAlt1Outlined } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";

function AdminDashboard() {
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
    const userDataRetreival = async () => {
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
    };
    userDataRetreival();
  }, []);
  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const mainContainer = document.querySelector(".main-container-DD");
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
      <div className="details-container-DD">
        <h2 className="heading-DD">
          <strong>Details</strong>
        </h2>
        <p className="data-DD">
          <strong>First Name: {AccountData.first_name}</strong>
        </p>
        <p className="data-DD">
          <strong>Last Name: {AccountData.last_name}</strong>
        </p>
        <p className="data-DD">
          <strong>Email: {AccountData.email}</strong>
        </p>
        <p className="data-DD">
          <strong>Age: {AccountData.age}</strong>
        </p>

        <p className="data-DD">
          <strong>Phone: {AccountData.phone}</strong>
        </p>
        <p className="data-DD">
          <strong>Country: {AccountData.country}</strong>
        </p>
        <p className="data-DD">
          <strong>City: {AccountData.city}</strong>
        </p>
        <p className="data-DD">
          <strong>Address: {AccountData.address}</strong>
        </p>
        <p className="data-DD">
          <strong>Password: {"*".repeat(AccountData.password.length)}</strong>
        </p>
      </div>
    );
  };

  const AdminButton = styled(Button)(({ theme }) => ({
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
        fetch("http://localhost:8008/Tourism/CheckFlightReservationCount", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: localStorage.getItem("email") }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              if (data.data[0].res_count > 0) {
                setError2(
                  "Deleting Account not possible when there are pending reservations!"
                );
              } else {
                //delete account logic
                deleteAccountAPI();
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
        <div className="details-container-DD">
          <h2 className="heading-DD">Settings</h2>
        </div>
        {editData === true ? (
          <div className="edit-input-container-DD">
            <TextField
              type="text"
              className="seats-input2-DD"
              label="First Name"
              value={updatedData.first_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "first_name")}
              required
            >
              First Name
            </TextField>
            <TextField
              type="text"
              className="seats-input2-DD"
              label="Last Name"
              value={updatedData.last_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "last_name")}
              required
            >
              Last Name
            </TextField>
            <p className="data-DD">
              <strong>Email:</strong> {AccountData.email}
            </p>

            <TextField
              type="number"
              className="seats-input2-DD"
              label="Age(18-150)"
              value={updatedData.age}
              onChange={(e) => handleUpdatedDataInputChange(e, "age")}
              required
            >
              Age
            </TextField>

            <TextField
              type="tel"
              className="seats-input2-DD"
              label="Phone"
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
              className="seats-input2-DD"
              value={selectedCountry}
              label="Select Country"
              sx={{
                marginBottom: "2.5vh",
                paddingTop: "4vh !important",
                paddingBottom: "4vh !important",
                height: " 3vh !important",
                width: "26% !important",
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
              className="seats-input2-DD"
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
                width: "26% !important",
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
              className="seats-input2-DD"
              label="Complete Address"
              value={updatedData.address}
              onChange={(e) => handleUpdatedDataInputChange(e, "address")}
              required
            >
              Address
            </TextField>
            <TextField
              type="password"
              className="seats-input2-DD"
              label="Enter Password"
              value={updatedData.password}
              onChange={(e) => handleUpdatedDataInputChange(e, "password")}
              required
            >
              Password
            </TextField>
            <TextField
              type="password"
              className="seats-input2-DD"
              label="Confirm Password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
            >
              Confirm Password
            </TextField>

            {error && <p className="error-message-DD">{error}</p>}
          </div>
        ) : (
          <div className="details-container-DD">
            <p className="data-DD">
              <strong>First Name: {AccountData.first_name}</strong>
            </p>
            <p className="data-DD">
              <strong>Last Name: {AccountData.last_name}</strong>
            </p>
            <p className="data-DD">
              <strong>Email: {AccountData.email}</strong>
            </p>
            <p className="data-DD">
              <strong>Age: {AccountData.age}</strong>
            </p>

            <p className="data-DD">
              <strong>Phone: {AccountData.phone}</strong>
            </p>
            <p className="data-DD">
              <strong>Country: {AccountData.country}</strong>
            </p>
            <p className="data-DD">
              <strong>City: {AccountData.city}</strong>
            </p>
            <p className="data-DD">
              <strong>Address: {AccountData.address}</strong>
            </p>
            <p className="data-DD">
              <strong>
                Password: {"*".repeat(AccountData.password.length)}
              </strong>
            </p>
          </div>
        )}
        <div className="setting-container-DD">
          {editData && (
            <button className="save-button-DD" onClick={saveChanges}>
              Save
            </button>
          )}
          <button className="edit-button-DD" onClick={editDataButton}>
            {editData ? "Cancel Edit" : "Edit Info"}
          </button>
        </div>
        <div className="setting-container-DD">
          <AdminButton
            sx={{
              "&:hover": {
                color: "red !important",
                borderColor: "red !important",
              },
              gap: "0.7vw",
            }}
            onClick={deleteAccount}
          >
            <DeleteIcon />
            Delete Account
          </AdminButton>
        </div>
        <div className="setting-container-DD">
          {error2 && <p className="error-message2-DD">{error2}</p>}
        </div>
      </div>
    );
  };
  const HotelContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hotelData, setHotelData] = useState(null);
    useEffect(() => {
      const hotelDataRetreival = async () => {
        setIsLoading(true);
        fetch("http://localhost:8008/Tourism/getAdminHotels", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              console.log("Hotel Data", data.data);
              setHotelData(data.data);
              setIsLoading(false);
            } else {
              console.log("Data not retreived!", data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      hotelDataRetreival();
    }, []);
    const [openSummary, setOpenSummary] = useState(null);
    const lockAccount = (email) => {
      console.log("email:", email);
      fetch("http://localhost:8008/Tourism/AdminUpdateAccountStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email: email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            toast.success("Status Updated");
          } else {
            toast.error("Status not updated!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return (
      <div className="Admin-content-DD">
        <h2 className="heading-DD">Hotels</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="feedback-content3-DD">
            {hotelData && hotelData.length > 0 ? (
              hotelData.map((hotel) => (
                <details
                  className="feedback-details2-DD"
                  key={hotel.email}
                  open={openSummary === hotel.email}
                >
                  <summary
                    className="feedback-summary2-DD"
                    onClick={() => {
                      setOpenSummary(hotel.email);
                    }}
                  >
                    {hotel.first_name} {hotel.last_name}
                    <p className="summary-rating-DD">
                      ({hotel.rating.toFixed(2)}
                      <StarIcon />)
                    </p>
                  </summary>
                  <div className="feedback-content2-DD">
                    <div className="hotel-details-DD">
                      <div className="details2-DD">
                        <h2 className="flight-details-heading-DD">
                          Personal Information:
                        </h2>
                        <p className="summary-rating2-DD">
                          First Name: {hotel.first_name}
                        </p>
                        <p className="summary-rating2-DD">
                          Last Name: {hotel.last_name}
                        </p>
                        <p className="summary-rating2-DD">
                          Email: {hotel.email}
                        </p>
                        <p className="summary-rating2-DD">
                          Password: {hotel.password}
                        </p>
                        <p className="summary-rating2-DD">
                          Phone: {hotel.phone}
                        </p>
                        <p className="summary-rating2-DD">City: {hotel.city}</p>
                        <p className="summary-rating2-DD">
                          Country: {hotel.country}
                        </p>

                        <p className="summary-rating2-DD">
                          Address: {hotel.address}
                        </p>
                        <p className="summary-rating2-DD">
                          Rating: ({hotel.rating.toFixed(2)}
                          <StarIcon />)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="button-div-DD">
                    <button
                      className="edit-button2-DD"
                      disabled={hotel.status === 0}
                      onClick={() => {
                        lockAccount(hotel.email);
                      }}
                    >
                      {hotel.status === 0 ? (
                        <>Account Locked</>
                      ) : hotel.status === 1 ? (
                        <>Lock Account</>
                      ) : hotel.status === 2 ? (
                        <>Unlock Account</>
                      ) : (
                        <></>
                      )}
                    </button>
                  </div>
                </details>
              ))
            ) : (
              <p>No Hotels Available.</p>
            )}
          </div>
        )}
      </div>
    );
  };
  const AirlineContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [AirlineData, setAirlineData] = useState(null);
    useEffect(() => {
      const AirlineDataRetreival = async () => {
        setIsLoading(true);
        fetch("http://localhost:8008/Tourism/getAdminAirlines", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              console.log("Airline Data", data.data);
              setAirlineData(data.data);
              setIsLoading(false);
            } else {
              console.log("Data not retreived!", data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      AirlineDataRetreival();
    }, []);
    const [openSummary, setOpenSummary] = useState(null);
    const lockAccount = (email) => {
      console.log("email:", email);
      fetch("http://localhost:8008/Tourism/AdminUpdateAccountStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email: email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            toast.success("Status Updated");
          } else {
            toast.error("Status not updated!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return (
      <div className="Admin-content-DD">
        <h2 className="heading-DD">Airlines</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="feedback-content3-DD">
            {AirlineData && AirlineData.length > 0 ? (
              AirlineData.map((Airline) => (
                <details
                  className="feedback-details2-DD"
                  key={Airline.email}
                  open={openSummary === Airline.email}
                >
                  <summary
                    className="feedback-summary2-DD"
                    onClick={() => {
                      setOpenSummary(Airline.email);
                    }}
                  >
                    {Airline.first_name} {Airline.last_name}
                    <p className="summary-rating-DD">
                      ({Airline.rating.toFixed(2)}
                      <StarIcon />)
                    </p>
                  </summary>
                  <div className="feedback-content2-DD">
                    <div className="hotel-details-DD">
                      <div className="details2-DD">
                        <h2 className="flight-details-heading-DD">
                          Personal Information:
                        </h2>
                        <p className="summary-rating2-DD">
                          First Name: {Airline.first_name}
                        </p>
                        <p className="summary-rating2-DD">
                          Last Name: {Airline.last_name}
                        </p>
                        <p className="summary-rating2-DD">
                          Email: {Airline.email}
                        </p>
                        <p className="summary-rating2-DD">
                          Password: {Airline.password}
                        </p>
                        <p className="summary-rating2-DD">
                          Phone: {Airline.phone}
                        </p>
                        <p className="summary-rating2-DD">
                          City: {Airline.city}
                        </p>
                        <p className="summary-rating2-DD">
                          Country: {Airline.country}
                        </p>

                        <p className="summary-rating2-DD">
                          Address: {Airline.address}
                        </p>
                        <p className="summary-rating2-DD">
                          Rating: ({Airline.rating.toFixed(2)}
                          <StarIcon />)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="button-div-DD">
                    <button
                      className="edit-button2-DD"
                      disabled={Airline.status === 0}
                      onClick={() => {
                        lockAccount(Airline.email);
                      }}
                    >
                      {Airline.status === 0 ? (
                        <>Account Locked</>
                      ) : Airline.status === 1 ? (
                        <>Lock Account</>
                      ) : Airline.status === 2 ? (
                        <>Unlock Account</>
                      ) : (
                        <></>
                      )}
                    </button>
                  </div>
                </details>
              ))
            ) : (
              <p>No Airlines Available.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const GuideContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [GuideData, setGuideData] = useState(null);
    useEffect(() => {
      const GuideDataRetreival = async () => {
        setIsLoading(true);
        fetch("http://localhost:8008/Tourism/getAdminGuides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              console.log("Guide Data", data.data);
              setGuideData(data.data);
              setIsLoading(false);
            } else {
              console.log("Data not retreived!", data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      GuideDataRetreival();
    }, []);
    const [openSummary, setOpenSummary] = useState(null);
    const lockAccount = (email) => {
      console.log("email:", email);
      fetch("http://localhost:8008/Tourism/AdminUpdateAccountStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email: email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            toast.success("Status Updated");
          } else {
            toast.error("Status not updated!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return (
      <div className="Admin-content-DD">
        <h2 className="heading-DD">Guides</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="feedback-content3-DD">
            {GuideData && GuideData.length > 0 ? (
              GuideData.map((Guide) => (
                <details
                  className="feedback-details2-DD"
                  key={Guide.email}
                  open={openSummary === Guide.email}
                >
                  <summary
                    className="feedback-summary2-DD"
                    onClick={() => {
                      setOpenSummary(Guide.email);
                    }}
                  >
                    {Guide.first_name} {Guide.last_name}
                    <p className="summary-rating-DD">
                      ({Guide.rating.toFixed(2)}
                      <StarIcon />)
                    </p>
                  </summary>
                  <div className="feedback-content2-DD">
                    <div className="hotel-details-DD">
                      <div className="details2-DD">
                        <h2 className="flight-details-heading-DD">
                          Personal Information:
                        </h2>
                        <p className="summary-rating2-DD">
                          First Name: {Guide.first_name}
                        </p>
                        <p className="summary-rating2-DD">
                          Last Name: {Guide.last_name}
                        </p>
                        <p className="summary-rating2-DD">
                          Email: {Guide.email}
                        </p>
                        <p className="summary-rating2-DD">
                          Password: {Guide.password}
                        </p>
                        <p className="summary-rating2-DD">
                          Phone: {Guide.phone}
                        </p>
                        <p className="summary-rating2-DD">City: {Guide.city}</p>
                        <p className="summary-rating2-DD">
                          Country: {Guide.country}
                        </p>

                        <p className="summary-rating2-DD">
                          Address: {Guide.address}
                        </p>
                        <p className="summary-rating2-DD">
                          Price Per Day($): {Guide.price}
                        </p>
                        <p className="summary-rating2-DD">
                          Rating: ({Guide.rating.toFixed(2)}
                          <StarIcon />)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="button-div-DD">
                    <button
                      className="edit-button2-DD"
                      disabled={Guide.status === 0}
                      onClick={() => {
                        lockAccount(Guide.email);
                      }}
                    >
                      {Guide.status === 0 ? (
                        <>Account Locked</>
                      ) : Guide.status === 1 ? (
                        <>Lock Account</>
                      ) : Guide.status === 2 ? (
                        <>Unlock Account</>
                      ) : (
                        <></>
                      )}
                    </button>
                  </div>
                </details>
              ))
            ) : (
              <p>No Guides Available.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const RentalContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [RentalData, setRentalData] = useState(null);
    useEffect(() => {
      const RentalDataRetreival = async () => {
        setIsLoading(true);
        fetch("http://localhost:8008/Tourism/getAdminRentals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              console.log("Rental Data", data.data);
              setRentalData(data.data);
              setIsLoading(false);
            } else {
              console.log("Data not retreived!", data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      RentalDataRetreival();
    }, []);
    const [openSummary, setOpenSummary] = useState(null);
    const lockAccount = (email) => {
      console.log("email:", email);
      fetch("http://localhost:8008/Tourism/AdminUpdateAccountStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email: email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            toast.success("Status Updated");
          } else {
            toast.error("Status not updated!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return (
      <div className="Admin-content-DD">
        <h2 className="heading-DD">Rentals</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="feedback-content3-DD">
            {RentalData && RentalData.length > 0 ? (
              RentalData.map((Rental) => (
                <details
                  className="feedback-details2-DD"
                  key={Rental.email}
                  open={openSummary === Rental.email}
                >
                  <summary
                    className="feedback-summary2-DD"
                    onClick={() => {
                      setOpenSummary(Rental.email);
                    }}
                  >
                    {Rental.first_name} {Rental.last_name}
                    <p className="summary-rating-DD">
                      ({Rental.rating.toFixed(2)}
                      <StarIcon />)
                    </p>
                  </summary>
                  <div className="feedback-content2-DD">
                    <div className="hotel-details-DD">
                      <div className="details2-DD">
                        <h2 className="flight-details-heading-DD">
                          Personal Information:
                        </h2>
                        <p className="summary-rating2-DD">
                          First Name: {Rental.first_name}
                        </p>
                        <p className="summary-rating2-DD">
                          Last Name: {Rental.last_name}
                        </p>
                        <p className="summary-rating2-DD">
                          Email: {Rental.email}
                        </p>
                        <p className="summary-rating2-DD">
                          Password: {Rental.password}
                        </p>
                        <p className="summary-rating2-DD">
                          Phone: {Rental.phone}
                        </p>
                        <p className="summary-rating2-DD">
                          City: {Rental.city}
                        </p>
                        <p className="summary-rating2-DD">
                          Country: {Rental.country}
                        </p>

                        <p className="summary-rating2-DD">
                          Address: {Rental.address}
                        </p>
                        <p className="summary-rating2-DD">
                          Price Per Day($): {Rental.price}
                        </p>
                        <p className="summary-rating2-DD">
                          Rating: ({Rental.rating.toFixed(2)}
                          <StarIcon />)
                        </p>
                        <h2 className="flight-details-heading-DD">
                          Car Information:
                        </h2>
                        <p className="summary-rating2-DD">
                          Description: {Rental.description}
                        </p>
                        <p className="summary-rating2-DD">
                          Capacity: {Rental.capacity}
                        </p>
                        <p className="summary-rating2-DD">
                          Plate: {Rental.plate}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="button-div-DD">
                    <button
                      className="edit-button2-DD"
                      disabled={Rental.status === 0}
                      onClick={() => {
                        lockAccount(Rental.email);
                      }}
                    >
                      {Rental.status === 0 ? (
                        <>Account Locked</>
                      ) : Rental.status === 1 ? (
                        <>Lock Account</>
                      ) : Rental.status === 2 ? (
                        <>Unlock Account</>
                      ) : (
                        <></>
                      )}
                    </button>
                  </div>
                </details>
              ))
            ) : (
              <p>No Rentals Available.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const TouristContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [TouristData, setTouristData] = useState(null);
    useEffect(() => {
      const TouristDataRetreival = async () => {
        setIsLoading(true);
        fetch("http://localhost:8008/Tourism/getAdminTourists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.code === 200) {
              console.log("Tourist Data", data.data);
              setTouristData(data.data);
              setIsLoading(false);
            } else {
              console.log("Data not retreived!", data.data);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      };
      TouristDataRetreival();
    }, []);
    const [openSummary, setOpenSummary] = useState(null);
    const lockAccount = (email) => {
      console.log("email:", email);
      fetch("http://localhost:8008/Tourism/AdminUpdateAccountStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email: email }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            toast.success("Status Updated");
          } else {
            toast.error("Status not updated!");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    return (
      <div className="Admin-content-DD">
        <h2 className="heading-DD">Tourists</h2>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="feedback-content3-DD">
            {TouristData && TouristData.length > 0 ? (
              TouristData.map((Tourist) => (
                <details
                  className="feedback-details2-DD"
                  key={Tourist.email}
                  open={openSummary === Tourist.email}
                >
                  <summary
                    className="feedback-summary2-DD"
                    onClick={() => {
                      setOpenSummary(Tourist.email);
                    }}
                  >
                    {Tourist.first_name} {Tourist.last_name}
                    <p className="summary-rating-DD">
                      ({Tourist.rating.toFixed(2)}
                      <StarIcon />)
                    </p>
                  </summary>
                  <div className="feedback-content2-DD">
                    <div className="hotel-details-DD">
                      <div className="details2-DD">
                        <h2 className="flight-details-heading-DD">
                          Personal Information:
                        </h2>
                        <p className="summary-rating2-DD">
                          First Name: {Tourist.first_name}
                        </p>
                        <p className="summary-rating2-DD">
                          Last Name: {Tourist.last_name}
                        </p>
                        <p className="summary-rating2-DD">
                          Email: {Tourist.email}
                        </p>

                        <p className="summary-rating2-DD">
                          Password: {Tourist.password}
                        </p>
                        <p className="summary-rating2-DD">
                          Phone: {Tourist.phone}
                        </p>
                        <p className="summary-rating2-DD">
                          City: {Tourist.city}
                        </p>
                        <p className="summary-rating2-DD">
                          Country: {Tourist.country}
                        </p>

                        <p className="summary-rating2-DD">
                          Address: {Tourist.address}
                        </p>
                        <p className="summary-rating2-DD">
                          Rating: ({Tourist.rating.toFixed(2)}
                          <StarIcon />)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="button-div-DD">
                    <button
                      className="edit-button2-DD"
                      disabled={Tourist.status === 0}
                      onClick={() => {
                        lockAccount(Tourist.email);
                      }}
                    >
                      {Tourist.status === 0 ? (
                        <>Account Locked</>
                      ) : Tourist.status === 1 ? (
                        <>Lock Account</>
                      ) : Tourist.status === 2 ? (
                        <>Unlock Account</>
                      ) : (
                        <></>
                      )}
                    </button>
                  </div>
                </details>
              ))
            ) : (
              <p>No Tourists Available.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const AdminSignUp = () => {
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      age: "",
      phone: "",
      email: "",
      address: "",
      password: "",
      role_ID: 5,
    });
    const signUpAdmin = () => {
      console.log("Hello", formData);
      fetch("http://localhost:8008/Tourism/insertUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          country: selectedCountryName,
          city: selectedCity,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            toast.success("Sign Up Complete!");
          } else {
            toast.error("Sign Up Failed!");
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

    const signUp = (e) => {
      e.preventDefault();

      if (formData.first_name === "") {
        setError("Enter a valid first name!");
        return;
      }
      if (formData.last_name === "") {
        setError("Enter a valid last name!");
        return;
      }
      if (formData.age < 18 || formData.age > 150) {
        setError("Enter a valid age!");
        return;
      }

      if (formData.phone === "") {
        setError("Enter a valid phone number!");
        return;
      }
      if (formData.email === "") {
        setError("Enter a valid Email!");
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
      if (formData.address === "") {
        setError("Enter a valid address!");
        return;
      }
      if (formData.password === "") {
        setError("Enter a valid password!");
        return;
      }
      if (formData.password !== confPassword) {
        setError("Passwords do not match!");
        return;
      }

      setError("");
      console.log("Form-Data", formData);
      signUpAdmin();
    };
    const [confPassword, setConfPassword] = useState("");
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
      setFormData((prevData) => ({
        ...prevData,
        [field]: event.target.value,
      }));
    };
    return (
      <div>
        <div className="Admin-content-DD">
          <h2 className="heading-DD">Admin Sign Up</h2>
        </div>
        <div className="edit-input-container-DD">
          <TextField
            type="text"
            className="seats-input2-DD"
            label="First Name"
            value={formData.first_name}
            onChange={(e) => handleUpdatedDataInputChange(e, "first_name")}
            required
          >
            First Name
          </TextField>
          <TextField
            type="text"
            className="seats-input2-DD"
            label="Last Name"
            value={formData.last_name}
            onChange={(e) => handleUpdatedDataInputChange(e, "last_name")}
            required
          >
            Last Name
          </TextField>

          <TextField
            type="text"
            className="seats-input2-DD"
            label="Email"
            value={formData.email}
            onChange={(e) => handleUpdatedDataInputChange(e, "email")}
            required
          >
            Email
          </TextField>

          <TextField
            type="number"
            className="seats-input2-DD"
            label="Age(18-150)"
            value={formData.age}
            onChange={(e) => handleUpdatedDataInputChange(e, "age")}
            required
          >
            Age
          </TextField>

          <TextField
            type="tel"
            className="seats-input2-DD"
            label="Phone"
            value={formData.phone}
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
            className="seats-input2-DD"
            value={selectedCountry}
            label="Select Country"
            sx={{
              marginBottom: "2.5vh",
              paddingTop: "4vh !important",
              paddingBottom: "4vh !important",
              height: " 3vh !important",
              width: "26% !important",
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
            className="seats-input2-DD"
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
              width: "26% !important",
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
            className="seats-input2-DD"
            label="Complete Address"
            value={formData.address}
            onChange={(e) => handleUpdatedDataInputChange(e, "address")}
            required
          >
            Address
          </TextField>
          <TextField
            type="password"
            className="seats-input2-DD"
            label="Enter Password"
            value={formData.password}
            onChange={(e) => handleUpdatedDataInputChange(e, "password")}
            required
          >
            Password
          </TextField>
          <TextField
            type="password"
            className="seats-input2-DD"
            label="Confirm Password"
            value={confPassword}
            onChange={(e) => setConfPassword(e.target.value)}
            required
          >
            Confirm Password
          </TextField>
          <button
            className="edit-button2-DD"
            onClick={(e) => {
              signUp(e);
            }}
          >
            Sign Up
          </button>
          {error && <p className="error-message-DD">{error}</p>}
        </div>
      </div>
    );
  };
  const cardComponents = {
    Home: HomeContent,
    Hotel: HotelContent,
    Airline: AirlineContent,
    Guide: GuideContent,
    Rental: RentalContent,
    Tourist: TouristContent,
    Signup: AdminSignUp,
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
      <div className="background-DD">
        <Aurora
          colorStops={["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"]}
          speed={0.9}
        />
      </div>
      <div>
        <Toaster />
      </div>
      <div className="main-container-DD">
        <div className="hamburger-menu-DD">
          <button
            className={`hamburger-icon-DD ${isOpen ? "open-DD" : ""}`}
            onClick={toggleMenu}
          >
            <span
              className={`line-DD line-top-DD ${isOpen ? "open-DD" : ""}`}
            ></span>
            <span
              className={`line-DD line-middle-DD ${isOpen ? "open-DD" : ""}`}
            ></span>
            <span
              className={`line-DD line-bottom-DD ${isOpen ? "open-DD" : ""}`}
            ></span>
          </button>

          <nav className={`menu-DD ${isOpen ? "open-DD" : ""}`}>
            <ul>
              <li>
                <button
                  className="button-DD"
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
                  className="button-DD"
                  onClick={() => {
                    setActiveCard("Hotel");
                    localStorage.setItem("activeCard", "Hotel");
                  }}
                >
                  <Hotel />
                  Hotels
                </button>
              </li>
              <li>
                <button
                  className="button-DD"
                  onClick={() => {
                    setActiveCard("Airline");
                    localStorage.setItem("activeCard", "Airline");
                  }}
                >
                  <Plane />
                  Airlines
                </button>
              </li>
              <li>
                <button
                  className="button-DD"
                  onClick={() => {
                    setActiveCard("Guide");
                    localStorage.setItem("activeCard", "Guide");
                  }}
                >
                  <MapPinned />
                  Tour Guides
                </button>
              </li>
              <li>
                <button
                  className="button-DD"
                  onClick={() => {
                    setActiveCard("Rental");
                    localStorage.setItem("activeCard", "Rental");
                  }}
                >
                  <Car />
                  Car Rentals
                </button>
              </li>
              <li>
                <button
                  className="button-DD"
                  onClick={() => {
                    setActiveCard("Tourist");
                    localStorage.setItem("activeCard", "Tourist");
                  }}
                >
                  <UsersRound />
                  Tourists
                </button>
              </li>
              <li>
                <button
                  className="button-DD"
                  onClick={() => {
                    setActiveCard("Signup");
                    localStorage.setItem("activeCard", "Signup");
                  }}
                >
                  <PersonAddAlt1Outlined />
                  Add an Admin
                </button>
              </li>
              <li>
                <button
                  className="button-DD"
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
                <button className="button-DD" onClick={logOut}>
                  <LogoutIcon />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content-DD">
          <div className="details-DD">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
