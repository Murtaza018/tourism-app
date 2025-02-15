import { useNavigate } from "react-router-dom";
import "./RentalDashboard.css";
import { useState, useEffect, Suspense } from "react";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Aurora from "../../components/Aurora";
import { Country, City } from "country-state-city";
import {
  Button,
  Card,
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

function RentalDashboard() {
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
  const [CarData, setCarData] = useState({
    capacity: "",
    plate: "",
    desc: "",
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
    fetch("http://localhost:8008/Tourism/getCar", {
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
          setCarData(() => ({
            capacity: data.data[0].capacity,
            plate: data.data[0].plate,
            desc: data.data[0].description,
          }));
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
    const mainContainer = document.querySelector(".main-container-RD");
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
      <div className="details-container-RD">
        <h2 className="heading-RD">
          <strong>Details</strong>
        </h2>
        <h3 className="heading-RD">
          <strong>Car Info</strong>
        </h3>
        <p className="data-RD">
          <strong>First Name: {AccountData.first_name}</strong>
        </p>
        <p className="data-RD">
          <strong>Last Name: {AccountData.last_name}</strong>
        </p>
        <p className="data-RD">
          <strong>Email: {AccountData.email}</strong>
        </p>
        <p className="data-RD">
          <strong>Age: {AccountData.age}</strong>
        </p>
        <p className="data-RD">
          <strong>Price Per Day: {price}$</strong>
        </p>
        <p className="data-RD">
          <strong>Phone: {AccountData.phone}</strong>
        </p>
        <p className="data-RD">
          <strong>Country: {AccountData.country}</strong>
        </p>
        <p className="data-RD">
          <strong>City: {AccountData.city}</strong>
        </p>
        <p className="data-RD">
          <strong>Address: {AccountData.address}</strong>
        </p>
        <p className="data-RD">
          <strong>Password: {"*".repeat(AccountData.password.length)}</strong>
        </p>
        <h3 className="heading-RD">
          <strong>Driver Info</strong>
        </h3>
        <p className="data-RD">
          <strong>Plate Number: {CarData.plate}</strong>
        </p>
        <p className="data-RD">
          <strong>Description: {CarData.desc}</strong>
        </p>
        <p className="data-RD">
          <strong>Capacity: {CarData.capacity}</strong>
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
  const RentalStatus = [
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
  const RentalButton = styled(Button)(({ theme }) => ({
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
          <h1 className="heading-RD">
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
            value={receiver.first_name}
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
  const ReservationContent = () => {
    return (
      <div>
        <div className="Rental-content-RD">
          <h1 className="heading-RD">
            <strong>Reservations</strong>
          </h1>
          <div className="Rental-options-container-RD">
            <RentalButton
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
            </RentalButton>
            <RentalButton
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
            </RentalButton>
            <RentalButton
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
            </RentalButton>
          </div>
          <div className="table-container-RD">
            {displayReservationData.length > 0 ? (
              <div>
                <table className="Rental-table-RD">
                  <thead className="table-head-RD">
                    <tr>
                      {reservDeleteboxes && (
                        <th className="table-header-RD">Select</th>
                      )}
                      <th className="table-header-RD">Start Date</th>
                      <th className="table-header-RD">End Date</th>
                      <th className="table-header-RD">Status</th>
                      <th className="table-header-RD">Tourist Name</th>
                      <th className="table-header-RD">Tourist Phone</th>
                      {reservEditboxes && (
                        <th className="table-header-RD">Edit</th>
                      )}
                      {feedbackButton && (
                        <th className="table-header-RD">Feedback</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="table-body-RD">
                    {filteredReservations.map((reserv) => (
                      <tr key={reserv.reservation_id} className="table-row-RD">
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
                            <td className="table-cell-RD">
                              {reserv.start_date}
                            </td>
                            <td className="table-cell-RD">{reserv.end_date}</td>

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
                                {RentalStatus.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </td>
                            <td className="table-cell-RD">
                              {reserv.first_name}
                            </td>
                            <td className="table-cell-RD">{reserv.phone}</td>

                            <td>
                              <div className="button-group-RD">
                                <button
                                  className="save-button-RD"
                                  onClick={() =>
                                    handleSaveReservClick(reserv.reservation_id)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  className="cancel-button-RD"
                                  onClick={handleCancelReservClick}
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="table-cell-RD">
                              {reserv.start_date}
                            </td>
                            <td className="table-cell-RD">{reserv.end_date}</td>
                            <td className="table-cell-RD">{reserv.status}</td>
                            <td className="table-cell-RD">
                              {reserv.first_name}
                            </td>
                            <td className="table-cell-RD">{reserv.phone}</td>

                            {reservEditboxes && (
                              <td>
                                <button
                                  className="edit-button-RD"
                                  onClick={() => handleReservEditClick(reserv)}
                                >
                                  Edit
                                </button>
                              </td>
                            )}
                            {feedbackButton && (
                              <td>
                                <button
                                  className="feedback-button-RD"
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
                    className="delete-selected-RD"
                    onClick={handleDeleteSelectedReserv}
                  >
                    Delete Selected Reservations
                  </button>
                )}
                {error && <p className="error-message2-RD">{error}</p>}
              </div>
            ) : (
              <p className="no-data-message-RD">No data available.</p>
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
      <div className="star-rating-RD">
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
        <div className="Rental-content-RD">
          <h2 className="heading-RD">
            <strong>Feedback</strong>
          </h2>
          {displayFeedbackData.length > 0 ? (
            <>
              {displayFeedbackData.map((reserv) => (
                <details
                  className="feedback-details-RD"
                  key={reserv.feedback_id}
                >
                  <summary className="feedback-summary-RD">
                    {reserv.first_name} {reserv.last_name}({reserv.sender_email}
                    )
                  </summary>
                  <div className="feedback-content-RD">
                    <div className="feedback-rating-RD">
                      Rating: <StarRating rating={reserv.rating} />
                    </div>

                    <p className="feedback-text-RD">
                      Description:&nbsp;
                      {reserv.description}
                    </p>
                  </div>
                </details>
              ))}
            </>
          ) : (
            <p className="no-data-message-RD">No feedback available.</p>
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
    const [updatePrice, setUpdatePrice] = useState(null);
    const [updatedData, setUpdatedData] = useState({
      first_name: "",
      last_name: "",
      age: "",
      phone: "",
      address: "",
      password: "",
    });
    const [updatedCar, setUpdatedCar] = useState({
      capacity: "",
      plate: "",
      desc: "",
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
    const updateCarAPI = () => {
      fetch("http://localhost:8008/Tourism/updateCar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updatedCar,
          email: localStorage.getItem("email"),
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
      if (updatedCar.capacity < 1) {
        setError("Enter a valid capacity!");
        return;
      }
      if (updatedCar.plate === "") {
        setError("Enter a valid plate!");
        return;
      }
      if (updatedCar.desc === "") {
        setError("Enter a valid description!");
        return;
      }

      setError("");
      console.log("Updated-Data", updatedData);
      updateData();
      updatePriceAPI();
      updateCarAPI();
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
        setUpdatePrice(price);
        setUpdatedCar({
          capacity: CarData.capacity,
          desc: CarData.desc,
          plate: CarData.plate,
        });
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
    const handleUpdatedCarInputChange = (event, field) => {
      setUpdatedCar((prevData) => ({
        ...prevData,
        [field]: event.target.value,
      }));
    };
    return (
      <div>
        <div className="details-container-RD">
          <h2 className="heading-RD">Settings</h2>
        </div>
        <div className="details-container-RD">
          <h2 className="heading-RD">Driver Info</h2>
        </div>
        {editData === true ? (
          <div className="edit-input-container-RD">
            <TextField
              type="text"
              className="seats-input2-RD"
              label="First Name"
              value={updatedData.first_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "first_name")}
              required
            >
              First Name
            </TextField>
            <TextField
              type="text"
              className="seats-input2-RD"
              label="Last Name"
              value={updatedData.last_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "last_name")}
              required
            >
              Last Name
            </TextField>
            <p className="data-RD">
              <strong>Email:</strong> {AccountData.email}
            </p>

            <TextField
              type="number"
              className="seats-input2-RD"
              label="Age(18-150)"
              value={updatedData.age}
              onChange={(e) => handleUpdatedDataInputChange(e, "age")}
              required
            >
              Age
            </TextField>
            <TextField
              type="number"
              className="seats-input2-RD"
              label="Price Per Day($)"
              value={updatePrice}
              onChange={(e) => setUpdatePrice(e.target.value)}
              required
            >
              Price Per Day($)
            </TextField>
            <TextField
              type="tel"
              className="seats-input2-RD"
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
              className="seats-input2-RD"
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
              className="seats-input2-RD"
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
              className="seats-input2-RD"
              label="Complete Address"
              value={updatedData.address}
              onChange={(e) => handleUpdatedDataInputChange(e, "address")}
              required
            >
              Address
            </TextField>
            <TextField
              type="password"
              className="seats-input2-RD"
              label="Enter Password"
              value={updatedData.password}
              onChange={(e) => handleUpdatedDataInputChange(e, "password")}
              required
            >
              Password
            </TextField>
            <TextField
              type="password"
              className="seats-input2-RD"
              label="Confirm Password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
            >
              Confirm Password
            </TextField>

            <div className="details-container-RD">
              <h2 className="heading-RD">Car Info</h2>
            </div>

            <TextField
              type="text"
              className="seats-input2-RD"
              label="Plate Number"
              value={updatedCar.plate}
              onChange={(e) => handleUpdatedCarInputChange(e, "plate")}
              required
            >
              Plate Number
            </TextField>
            <TextField
              type="text"
              className="seats-input2-RD"
              label="Description"
              value={updatedCar.desc}
              onChange={(e) => handleUpdatedCarInputChange(e, "desc")}
              required
            >
              Description
            </TextField>
            <TextField
              type="number"
              className="seats-input2-RD"
              label="Capacity"
              value={updatedCar.capacity}
              onChange={(e) => handleUpdatedCarInputChange(e, "capacity")}
              required
            >
              Capacity
            </TextField>
            {error && <p className="error-message-RD">{error}</p>}
          </div>
        ) : (
          <div className="details-container-RD">
            <p className="data-RD">
              <strong>First Name: {AccountData.first_name}</strong>
            </p>
            <p className="data-RD">
              <strong>Last Name: {AccountData.last_name}</strong>
            </p>
            <p className="data-RD">
              <strong>Email: {AccountData.email}</strong>
            </p>
            <p className="data-RD">
              <strong>Age: {AccountData.age}</strong>
            </p>
            <p className="data-RD">
              <strong>Price Per Day($): {price}</strong>
            </p>
            <p className="data-RD">
              <strong>Phone: {AccountData.phone}</strong>
            </p>
            <p className="data-RD">
              <strong>Country: {AccountData.country}</strong>
            </p>
            <p className="data-RD">
              <strong>City: {AccountData.city}</strong>
            </p>
            <p className="data-RD">
              <strong>Address: {AccountData.address}</strong>
            </p>
            <p className="data-RD">
              <strong>
                Password: {"*".repeat(AccountData.password.length)}
              </strong>
            </p>
            <h2 className="heading-RD">Car Info</h2>

            <p className="data-RD">
              <strong>Plate: {CarData.plate}</strong>
            </p>
            <p className="data-RD">
              <strong>Description: {CarData.desc}</strong>
            </p>
            <p className="data-RD">
              <strong>Capacity: {CarData.capacity}</strong>
            </p>
          </div>
        )}
        <div className="setting-container-RD">
          {editData && (
            <button className="save-button-RD" onClick={saveChanges}>
              Save
            </button>
          )}
          <button className="edit-button-RD" onClick={editDataButton}>
            {editData ? "Cancel Edit" : "Edit Info"}
          </button>
        </div>

        <div className="setting-container-RD">
          <RentalButton
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
          </RentalButton>
          <RentalButton
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
          </RentalButton>
        </div>
        <div className="setting-container-RD">
          {error2 && <p className="error-message2-RD">{error2}</p>}
        </div>

        {accountStatus ? (
          <p className="locking-account-message-RD">
            <LockIcon />
            Locking Account will NOT show your Profile to the Tourists for
            reservations
          </p>
        ) : (
          <p className="locking-account-message-RD">
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
      <div className="background-RD">
        <Aurora
          colorStops={["#FFB74D", "#E67E22", "#FFF5EE", "#FFB74D"]}
          speed={0.9}
        />
      </div>
      <div className="main-container-RD">
        <div className="hamburger-menu-RD">
          <button
            className={`hamburger-icon-RD ${isOpen ? "open-RD" : ""}`}
            onClick={toggleMenu}
          >
            <span
              className={`line-RD line-top-RD ${isOpen ? "open-RD" : ""}`}
            ></span>
            <span
              className={`line-RD line-middle-RD ${isOpen ? "open-RD" : ""}`}
            ></span>
            <span
              className={`line-RD line-bottom-RD ${isOpen ? "open-RD" : ""}`}
            ></span>
          </button>

          <nav className={`menu-RD ${isOpen ? "open-RD" : ""}`}>
            <ul>
              <li>
                <button
                  className="button-RD"
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
                  className="button-RD"
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
                  className="button-RD"
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
                  className="button-RD"
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
                <button className="button-RD" onClick={logOut}>
                  <LogoutIcon />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content-RD">
          <div className="details-RD">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default RentalDashboard;
