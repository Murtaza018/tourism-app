import { useNavigate } from "react-router-dom";
import "./GuideDashboard.css";
import { useState, useEffect, Suspense } from "react";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Aurora from "./Aurora";
import { Country, City } from "country-state-city";
import {
  Button,
  Dialog,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { LockIcon, LockOpenIcon, StarHalfIcon } from "lucide-react";
import { StarOutline } from "@mui/icons-material";

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
  const [price, setPrice] = useState(null);
  useEffect(() => {
    setError("");
    if (activeCard === "ReservationUpdates") {
      getReservationData();
    } else if (activeCard === "Feedback") {
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
    fetch("http://localhost:8008/Tourism/getPrice", {
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
          setPrice(data.data[0].price_per_day);
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
          <strong>Price Per Day: {price}$</strong>
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

  const [selectedReservs, setSelectedReservs] = useState([]);
  const [reservEditId, setReservEditId] = useState(null);
  const [editedReservData, setEditedReservData] = useState({});
  const [reservDeleteboxes, setReservDeleteboxes] = useState(false);
  const [displayReservationData, setDisplayReservationData] = useState([]);
  const [reservEditboxes, setReserveEditboxes] = useState(false);
  const guideStatus = [
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
  ];
  const getReservationData = async () => {
    fetch("http://localhost:8008/Tourism/getGuideReservationData", {
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
    fetch("http://localhost:8008/Tourism/updateGuideReservationData", {
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
    fetch("http://localhost:8008/Tourism/deleteGuideReservationData", {
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
    if (feedbackButton) {
      setFeedbackButton(false);
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
  const GuideButton = styled(Button)(({ theme }) => ({
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
  const [feedbackButton, setFeedbackButton] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const handleFeedbackButton = () => {
    setFeedbackButton(!feedbackButton);
    if (selectedFilter !== "completed") {
      setSelectedFilter("completed");
    } else {
      setSelectedFilter(null);
    }
    if (reservEditboxes) {
      setReserveEditboxes(false);
    }
    if (reservEditId) {
      setReservEditId(null);
    }
  };
  const filteredReservations = displayReservationData.filter((reserv) => {
    if (!selectedFilter) {
      return true; // Show all if no filter is selected
    }
    return reserv.status.toLowerCase() === selectedFilter;
  });
  const [openFeedbackCard, setOpenFeedbackCard] = useState(false);
  const [receiver, setReceiver] = useState([]);
  const handleClickOpenFeedbackCard = (feedbackData) => {
    setReceiver(feedbackData);
    setError("");
    setOpenFeedbackCard(true);
  };

  const handleCloseFeedbackCard = () => {
    setError("");
    setReceiver("");
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
          t_email: receiver.tourist_email,
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
      const stars = document.querySelectorAll(".star-GD");
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
          className="star-GD"
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
      <Dialog open={open} onClose={onClose} className="feedback-dialog-GD">
        <div className="dialog-content-GD">
          <h1 className="heading-GD">
            <strong>Feedback</strong>
          </h1>
          <div className="rating-GD">
            <div className="star-container-GD">
              {stars}
              <p>Rating: {rating}</p>
            </div>
          </div>
          <TextField
            label="Receiver Name"
            value={receiver.first_name}
            disabled
            className="dialog-field-GD disabled-field-GD"
          />

          <TextField
            label="Sender Email"
            value={localStorage.getItem("email")}
            disabled
            className="dialog-field-GD disabled-field-GD"
          />

          <div className="feedback-input-container-GD">
            <TextField
              type="text"
              label="Feedback Description"
              inputProps={{ maxLength: 500, className: "expanding-input-GD" }}
              multiline
              required
              maxRows={4}
              onChange={(e) => setFeedbackDescription(e.target.value)}
              className="dialog-field-GD feedback-input-GD"
            />
            <p className="char-count-GD">{feedbackDescription.length}/500</p>
          </div>

          <Button className="submit-button-GD" onClick={SubmitFeedback}>
            Submit
          </Button>
        </div>
      </Dialog>
    );
  };
  const ReservationContent = () => {
    return (
      <div>
        <div className="guide-content-GD">
          <h1 className="heading-GD">
            <strong>Reservations</strong>
          </h1>
          <div className="guide-options-container-GD">
            <GuideButton
              variant="outlined"
              sx={{
                "&:hover": {
                  color: "blue !important",
                  borderColor: "blue !important",
                },
              }}
              startIcon={<EditIcon />}
              onClick={toggleReservationEditButton}
            >
              {reservEditboxes ? "Cancel Edit" : "Edit Booking"}
            </GuideButton>
            <GuideButton
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
            </GuideButton>
            <GuideButton
              variant="outlined"
              sx={{
                "&:hover": {
                  color: "yellow !important",
                  borderColor: "yellow !important",
                },
              }}
              startIcon={<FeedbackIcon />}
              onClick={handleFeedbackButton}
            >
              {feedbackButton ? "Cancel Feedback" : "Give Feedback"}
            </GuideButton>
          </div>
          <div className="table-container-GD">
            {displayReservationData.length > 0 ? (
              <div>
                <table className="guide-table-GD">
                  <thead className="table-head-GD">
                    <tr>
                      {reservDeleteboxes && (
                        <th className="table-header-GD">Select</th>
                      )}
                      <th className="table-header-GD">Start Date</th>
                      <th className="table-header-GD">End Date</th>
                      <th className="table-header-GD">Status</th>
                      <th className="table-header-GD">Tourist Name</th>
                      <th className="table-header-GD">Tourist Phone</th>
                      {reservEditboxes && (
                        <th className="table-header-GD">Edit</th>
                      )}
                      {feedbackButton && (
                        <th className="table-header-GD">Feedback</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="table-body-GD">
                    {filteredReservations.map((reserv) => (
                      <tr key={reserv.reservation_id} className="table-row-GD">
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
                            <td className="table-cell-GD">
                              {reserv.start_date}
                            </td>
                            <td className="table-cell-GD">{reserv.end_date}</td>

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
                                {guideStatus.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>
                            <td className="table-cell-GD">
                              {reserv.first_name}
                            </td>
                            <td className="table-cell-GD">{reserv.phone}</td>

                            <td>
                              <div className="button-group-GD">
                                <button
                                  className="save-button-GD"
                                  onClick={() =>
                                    handleSaveReservClick(reserv.reservation_id)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  className="cancel-button-GD"
                                  onClick={handleCancelReservClick}
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="table-cell-GD">
                              {reserv.start_date}
                            </td>
                            <td className="table-cell-GD">{reserv.end_date}</td>
                            <td className="table-cell-GD">{reserv.status}</td>
                            <td className="table-cell-GD">
                              {reserv.first_name}
                            </td>
                            <td className="table-cell-GD">{reserv.phone}</td>

                            {reservEditboxes && (
                              <td>
                                <button
                                  className="edit-button-GD"
                                  onClick={() => handleReservEditClick(reserv)}
                                >
                                  Edit
                                </button>
                              </td>
                            )}
                            {feedbackButton && (
                              <td>
                                <button
                                  className="feedback-button-GD"
                                  onClick={() =>
                                    handleClickOpenFeedbackCard(reserv)
                                  }
                                >
                                  Feedback
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
                    className="delete-selected-GD"
                    onClick={handleDeleteSelectedReserv}
                  >
                    Delete Selected Reservations
                  </button>
                )}
                {error && <p className="error-message2-GD">{error}</p>}
              </div>
            ) : (
              <p className="no-data-message-GD">No data available.</p>
            )}
          </div>
        </div>
        <FeedbackCard
          open={openFeedbackCard}
          onClose={handleCloseFeedbackCard}
        />
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
      <div className="star-rating-GD">
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
        <div className="guide-content-GD">
          <h2 className="heading-GD">
            <strong>Feedback</strong>
          </h2>
          {displayFeedbackData.length > 0 ? (
            <>
              {displayFeedbackData.map((reserv) => (
                <details
                  className="feedback-details-GD"
                  key={reserv.feedback_id}
                >
                  <summary className="feedback-summary-GD">
                    {reserv.first_name} {reserv.last_name}({reserv.sender_email}
                    )
                  </summary>
                  <div className="feedback-content-GD">
                    <div className="feedback-rating-GD">
                      Rating: <StarRating rating={reserv.rating} />
                    </div>

                    <p className="feedback-text-GD">
                      Description:&nbsp;
                      {reserv.description}
                    </p>
                  </div>
                </details>
              ))}
            </>
          ) : (
            <p className="no-data-message-GD">No feedback available.</p>
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
    const [updatePrice, setUpdatePrice] = useState(null);
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
    const updatePriceAPI = () => {
      fetch("http://localhost:8008/Tourism/updatePrice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("email"),
          price: updatePrice,
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
      console.log(selectedCity);
      console.log(selectedCountryName);

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
      if (updatePrice <= 0) {
        setError("Enter a valid price!");
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
      updatePriceAPI();
      window.location.reload();
    };
    const [confPassword, setConfPassword] = useState("");
    const editDataButton = () => {
      if (!editData) {
        setError("");
        setUpdatedData({
          first_name: AccountData.first_name,
          last_name: AccountData.last_name,
          age: AccountData.age,
          address: AccountData.address,
          password: AccountData.password,
          phone: AccountData.phone,
        });
        setConfPassword(AccountData.password);
        setUpdatePrice(price);
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
        <div className="details-container-GD">
          <h2 className="heading-GD">Settings</h2>
        </div>
        {editData === true ? (
          <div className="edit-input-container-GD">
            <TextField
              type="text"
              className="seats-input2-GD"
              label="First Name"
              value={updatedData.first_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "first_name")}
              required
            >
              First Name
            </TextField>
            <TextField
              type="text"
              className="seats-input2-GD"
              label="Last Name"
              value={updatedData.last_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "last_name")}
              required
            >
              Last Name
            </TextField>
            <p className="data-GD">
              <strong>Email:</strong> {AccountData.email}
            </p>

            <TextField
              type="number"
              className="seats-input2-GD"
              label="Age(18-150)"
              value={updatedData.age}
              onChange={(e) => handleUpdatedDataInputChange(e, "age")}
              required
            >
              Age
            </TextField>
            <TextField
              type="number"
              className="seats-input2-GD"
              label="Price Per Day($)"
              value={updatePrice}
              onChange={(e) => setUpdatePrice(e.target.value)}
              required
            >
              Price Per Day($)
            </TextField>
            <TextField
              type="tel"
              className="seats-input2-GD"
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
              className="seats-input2-GD"
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
              className="seats-input2-GD"
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
              className="seats-input2-GD"
              label="Complete Address"
              value={updatedData.address}
              onChange={(e) => handleUpdatedDataInputChange(e, "address")}
              required
            >
              Address
            </TextField>
            <TextField
              type="password"
              className="seats-input2-GD"
              label="Enter Password"
              value={updatedData.password}
              onChange={(e) => handleUpdatedDataInputChange(e, "password")}
              required
            >
              Password
            </TextField>
            <TextField
              type="password"
              className="seats-input2-GD"
              label="Confirm Password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
            >
              Confirm Password
            </TextField>

            {error && <p className="error-message-GD">{error}</p>}
          </div>
        ) : (
          <div className="details-container-GD">
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
              <strong>Price Per Day($): {price}</strong>
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
              <strong>
                Password: {"*".repeat(AccountData.password.length)}
              </strong>
            </p>
          </div>
        )}
        <div className="setting-container-GD">
          {editData && (
            <button className="save-button-GD" onClick={saveChanges}>
              Save
            </button>
          )}
          <button className="edit-button-GD" onClick={editDataButton}>
            {editData ? "Cancel Edit" : "Edit Info"}
          </button>
        </div>

        <div className="setting-container-GD">
          <GuideButton
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
          </GuideButton>
          <GuideButton
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
          </GuideButton>
        </div>
        <div className="setting-container-GD">
          {error2 && <p className="error-message2-GD">{error2}</p>}
        </div>

        {accountStatus ? (
          <p className="locking-account-message-GD">
            <LockIcon />
            Locking Account will NOT show your Profile to the Tourists for
            reservations
          </p>
        ) : (
          <p className="locking-account-message-GD">
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
      <div className="background-GD">
        <Aurora colorStops={["#00D8FF", "#7cff67", "#00D8FF"]} speed={0.9} />
      </div>
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
