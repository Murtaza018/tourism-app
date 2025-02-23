import { useNavigate } from "react-router-dom";
import "./TouristDashboard.css";
import { useState, useEffect, Suspense } from "react";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Aurora from "../../components/Aurora";
import Stepper, { Step } from "../../components/Stepper";
import { Country, City } from "country-state-city";
import PublicIcon from "@mui/icons-material/Public";
import HistoryIcon from "@mui/icons-material/History";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import {
  ChevronRight,
  ChevronLeft,
  LockIcon,
  LockOpenIcon,
  Box,
  Plane,
} from "lucide-react";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { StarOutline } from "@mui/icons-material";
import { useTheme } from "@emotion/react";

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
    const mainContainer = document.querySelector(".main-container-TD");
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
      <div className="details-container-TD">
        <h2 className="heading-TD">
          <strong>Details</strong>
        </h2>
        <p className="data-TD">
          <strong>First Name: {AccountData.first_name}</strong>
        </p>
        <p className="data-TD">
          <strong>Last Name: {AccountData.last_name}</strong>
        </p>
        <p className="data-TD">
          <strong>Email: {AccountData.email}</strong>
        </p>
        <p className="data-TD">
          <strong>Age: {AccountData.age}</strong>
        </p>
        <p className="data-TD">
          <strong>Phone: {AccountData.phone}</strong>
        </p>
        <p className="data-TD">
          <strong>Country: {AccountData.country}</strong>
        </p>
        <p className="data-TD">
          <strong>City: {AccountData.city}</strong>
        </p>
        <p className="data-TD">
          <strong>Address: {AccountData.address}</strong>
        </p>
        <p className="data-TD">
          <strong>Password: {"*".repeat(AccountData.password.length)}</strong>
        </p>
      </div>
    );
  };
  const Packages = () => {
    return (
      <div className="Tourist-content-TD">
        <h2 className="heading-TD">
          <strong>Your Packages</strong>
        </h2>
      </div>
    );
  };

  const [stepperDisplay, setStepperDisplay] = useState(false);
  // const PackageStepper = () => {
  //   const [name, setName] = useState("");
  //   return (
  //     <div className="stepper-div-TD">
  //       <Stepper
  //         sx={{ width: "100%" }}
  //         initialStep={1}
  //         onStepChange={(step) => {
  //           console.log(step);
  //         }}
  //         onFinalStepCompleted={() => console.log("All steps completed!")}
  //         backButtonText={<ChevronLeft />}
  //         nextButtonText={<ChevronRight />}
  //       >
  //         <Step>
  //           <h2>Welcome to the React Bits stepper!</h2>
  //           <p>Check out the next step!</p>
  //         </Step>
  //         <Step>
  //           <h2>Step 2</h2>

  //           <p>Custom step content!</p>
  //         </Step>
  //         <Step>
  //           <h2>How about an input?</h2>
  //           <input
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             placeholder="Your name?"
  //             required
  //           />
  //         </Step>
  //         <Step>
  //           <h2>Final Step 4</h2>
  //           <p>You made it!</p>
  //         </Step>
  //         <Step>
  //           <h2>Final Step 5 {name}</h2>
  //           <p>You made it!</p>
  //         </Step>
  //         <Step>
  //           <h2>Final Step</h2>
  //           <p>You made it!</p>
  //         </Step>
  //       </Stepper>
  //     </div>
  //   );
  // };
  const StyledDialog = ({ open, onClose, children }) => {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        className="dialog-container-TD"
        PaperProps={{
          className: "dialog-paper-TD",
        }}
      >
        {children}
        <DialogActions className="dialog-actions-TD">
          <Button onClick={onClose} className="close-button-TD">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  const handleOpenPackageStepper = () => {
    setStepperDisplay(true);
  };

  const handleClosePackageStepper = () => {
    setStepperDisplay(false);
  };

  const PackageStepper = ({ open, onClose }) => {
    const [name, setName] = useState("");
    const [selectedPackageCity, setSelectedPackageCity] = useState([]);
    const [selectedPackageCountry, setSelectedPackageCountry] = useState("");
    const [selectedPackageCountryName, setSelectedPackageCountryName] =
      useState("");
    const [Packagecities, setPackageCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleCountryChange = (event) => {
      event.preventDefault();
      if (event.target.value === "") {
        return;
      }
      const countryIsoCode = event.target.value;
      setSelectedPackageCountry(countryIsoCode);
      setSelectedPackageCountryName(
        Country.getCountryByCode(countryIsoCode).name
      );
      setSelectedPackageCity(""); // Reset city when the country changes

      // Fetch cities for the selected country
      if (countryIsoCode) {
        const countryCitiesObject = City.getCitiesOfCountry(countryIsoCode);
        const cityNamesArray = Object.values(countryCitiesObject);
        setPackageCities(cityNamesArray); // Set the city *data*
        setSelectedPackageCity([]); // Reset selection when country changes
        setLoading(false); // Set loading to false *after* data is fetched
      } else {
        setPackageCities([]);
        setSelectedPackageCity([]);
        setLoading(false); // Also set loading to false if no country is chosen
      }

      console.log(selectedPackageCity);
    };

    // Handle city selection
    const handleCityChange = (event) => {
      event.preventDefault();
      setSelectedPackageCity(event.target.value || []); // Correctly handle multiple selections
    };
    return (
      <div>
        <Dialog open={open} onClose={onClose} className="dialog-container-TD">
          <DialogContent className="dialog-content-TD">
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
                  if (selectedPackageCountryName === "") {
                    return "Enter Country!";
                  }
                  if (selectedPackageCity.length <= 0) {
                    return "Select at least 1 City!";
                  }
                }
                return true;
              }}
            >
              <Step>
                <h2 className="step-heading-TD">
                  Select Country to visit <Plane />
                </h2>
                <div className="step1-div-TD">
                  <FormControl>
                    <InputLabel id="country-label" sx={{ color: "white" }}>
                      Select Country
                    </InputLabel>
                    <Select
                      required
                      labelId="country-label"
                      id="country"
                      size="small"
                      className="seats-input3-TD"
                      value={selectedPackageCountry}
                      label="Select Country"
                      fullWidth
                      onChange={handleCountryChange}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 4.5 + 8,
                          },
                        },
                      }}
                    >
                      {Country.getAllCountries().map((country) => (
                        <MenuItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {loading ? ( // Conditionally render the Select
                    <></>
                  ) : (
                    <FormControl>
                      <InputLabel id="city-label" sx={{ color: "white" }}>
                        Select City
                      </InputLabel>

                      <Select
                        required
                        labelId="city-label"
                        id="city"
                        multiple
                        className="seats-input3-TD"
                        disabled={!selectedPackageCountry}
                        fullWidth
                        value={selectedPackageCity}
                        label="Select City"
                        size="small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 48 * 4.5 + 8,
                              width: 250,
                            },
                          },
                        }}
                        onChange={handleCityChange}
                      >
                        {Packagecities.map((city) => (
                          <MenuItem key={city.name} value={city.name}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </div>
              </Step>
              <Step>
                <h2>Step 2</h2>
                <p>{selectedPackageCountryName}</p>
                {selectedPackageCity && selectedPackageCity.length > 0 ? (
                  selectedPackageCity.map((city) => <p key={city}>{city}</p>)
                ) : (
                  <p>No cities selected.</p>
                )}
              </Step>
              <Step>
                <h2>How about an input?</h2>
                <input
                  value={name}
                  id="name-input"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name?"
                  required
                />
              </Step>
              <Step>
                <h2>Final Step 4</h2>
                <p>You made it!</p>
              </Step>
              <Step>
                <h2>Final Step 5 {name}</h2>
                <p>You made it!</p>
              </Step>
              <Step>
                <h2>Final Step</h2>
                <p>You made it!</p>
              </Step>
            </Stepper>
          </DialogContent>
        </Dialog>
      </div>
    );
  };
  const TravelPackages = () => {
    return (
      <>
        <div className="Tourist-content-TD">
          <h2 className="heading-TD">
            <strong>Travel The World!</strong>
          </h2>
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
          <h2 className="heading-TD">
            <strong>Feedback</strong>
          </h2>
          {displayFeedbackData.length > 0 ? (
            <>
              {displayFeedbackData.map((reserv) => (
                <details
                  className="feedback-details-TD"
                  key={reserv.feedback_id}
                >
                  <summary className="feedback-summary-TD">
                    {reserv.first_name} {reserv.last_name}({reserv.sender_email}
                    )
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
        //check if there is an existing package going on
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
        <div className="details-container-TD">
          <h2 className="heading-TD">Settings</h2>
        </div>
        {editData === true ? (
          <div className="edit-input-container-TD">
            <TextField
              type="text"
              className="seats-input2-TD"
              label="First Name"
              value={updatedData.first_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "first_name")}
              required
            >
              First Name
            </TextField>
            <TextField
              type="text"
              className="seats-input2-TD"
              label="Last Name"
              value={updatedData.last_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "last_name")}
              required
            >
              Last Name
            </TextField>
            <p className="data-TD">
              <strong>Email:</strong> {AccountData.email}
            </p>

            <TextField
              type="number"
              className="seats-input2-TD"
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
              className="seats-input2-TD"
              label="Complete Address"
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
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
            >
              Confirm Password
            </TextField>

            {error && <p className="error-message-TD">{error}</p>}
          </div>
        ) : (
          <div className="details-container-TD">
            <p className="data-TD">
              <strong>First Name: {AccountData.first_name}</strong>
            </p>
            <p className="data-TD">
              <strong>Last Name: {AccountData.last_name}</strong>
            </p>
            <p className="data-TD">
              <strong>Email: {AccountData.email}</strong>
            </p>
            <p className="data-TD">
              <strong>Age: {AccountData.age}</strong>
            </p>
            <p className="data-TD">
              <strong>Phone: {AccountData.phone}</strong>
            </p>
            <p className="data-TD">
              <strong>Country: {AccountData.country}</strong>
            </p>
            <p className="data-TD">
              <strong>City: {AccountData.city}</strong>
            </p>
            <p className="data-TD">
              <strong>Address: {AccountData.address}</strong>
            </p>
            <p className="data-TD">
              <strong>
                Password: {"*".repeat(AccountData.password.length)}
              </strong>
            </p>
          </div>
        )}
        <div className="setting-container-TD">
          {editData && (
            <button className="save-button-TD" onClick={saveChanges}>
              Save
            </button>
          )}
          <button className="edit-button-TD" onClick={editDataButton}>
            {editData ? "Cancel Edit" : "Edit Info"}
          </button>
        </div>

        <div className="setting-container-TD">
          <TouristButton
            onClick={lockAccount}
            sx={{
              gap: "0.7vw",
            }}
          >
            {accountStatus ? (
              <>
                <LockIcon /> Lock Account
              </>
            ) : (
              <>
                <LockOpenIcon /> Unlock Account
              </>
            )}
          </TouristButton>
          <TouristButton
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
          </TouristButton>
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
  return (
    <div>
      <div className="background-TD">
        <Aurora
          colorStops={["#2196F3", "#3498DB", "#FFFFFF", "#87CEEB", "#2196F3"]}
          speed={1.2}
        />
      </div>
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

          <nav className={`menu-TD ${isOpen ? "open-TD" : ""}`}>
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
