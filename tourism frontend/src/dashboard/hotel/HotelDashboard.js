import { useState, useEffect, useRef } from "react";
import "./HotelDashboard.css";
import { useNavigate } from "react-router-dom";
import { Country, City } from "country-state-city";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import HomeIcon from "@mui/icons-material/Home";
import BedIcon from "@mui/icons-material/Bed";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { HourglassFull, StarOutline, Sync } from "@mui/icons-material";

import SaveIcon from "@mui/icons-material/Save";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { Button, Dialog, TextField } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function HotelDashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [displayRoomData, setDisplayRoomData] = useState([]);
  const [displayReservationData, setDisplayReservationData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [editData, setEditData] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [cities, setCities] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [editboxes, setEditboxes] = useState(false);
  const [reservEditboxes, setReserveEditboxes] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedReservs, setSelectedReservs] = useState([]);
  const [addRoomCard, setAddRoomCard] = useState(false);
  const [pendingButton, setPendingButton] = useState(false);
  const [ongoingButton, setOngoingButton] = useState(false);
  const [completedButton, setCompletedButton] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [reservEditId, setReservEditId] = useState(null);
  const [editedReservData, setEditedReservData] = useState({});
  const [reservDeleteboxes, setReservDeleteboxes] = useState(false);
  const [activeCard, setActiveCard] = useState(() => {
    const storedCard = localStorage.getItem("activeCard");
    if (storedCard && storedCard !== "Home") {
      return storedCard;
    }
    return "Home";
  });
  const [editingRoomId, setEditingRoomId] = useState(null); // Track which room is being edited
  const [editedRoomData, setEditedRoomData] = useState({}); // Store edited data
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const ageRef = useRef("");
  const addressRef = useRef("");
  const phoneRef = useRef("");
  const passRef = useRef("");
  const confPassRef = useRef("");
  useEffect(() => {
    localStorage.setItem("activeCard", activeCard);
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
          setFirstName(data.data[0].first_name || "");
          setLastName(data.data[0].last_name || "");
          setEmail(data.data[0].email || "");
          setAge(data.data[0].age || "");
          setPhone(data.data[0].phone || "");
          setCountry(data.data[0].country || "");
          setCity(data.data[0].city || "");
          setAddress(data.data[0].address || "");
          setPassword(data.data[0].password || "");
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
    localStorage.removeItem("user_data");
    localStorage.removeItem("email");
    navigate("/signin");
  };

  const [isOpen, setIsOpen] = useState(false);

  const OpenAddRoomCard = () => {
    setAddRoomCard(true);
  };

  const CloseAddRoomCard = () => {
    setAddRoomCard(false);
  };
  const quantityRef = useRef("");
  const priceRef = useRef("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const roomData = useRef({
    type: "",
    quantity: "",
    price: "",
    status: "",
    email: "",
  });
  const StatusChange = (event) => {
    setStatus(event.target.value);
  };
  const statusType = [
    { value: "", label: "Select Availability Status" },
    { value: "Available", label: "Available" },
    { value: "Booked", label: "Booked" },
  ];
  const TypeChange = (event) => {
    setType(event.target.value);
  };

  const roomType = [
    { value: "", label: "Select Room Type" },
    { value: "Standard Room", label: "Standard Room" },
    { value: "Deluxe Room", label: "Deluxe Room" },
    { value: "Junior Suite", label: "Junior Suite" },
    { value: "Mini Suite", label: "Mini Suite" },
    { value: "Master Suite", label: "Master Suite" },
    { value: "Executive Suite", label: "Executive Suite" },
    { value: "Presidential Suite", label: "Presidential Suite" },
    { value: "Penthouse Suite", label: "Penthouse Suite" },
    { value: "Villa Suite", label: "Villa Suite" },
    { value: "Executive Room", label: "Executive Room" },
  ];
  const insertRoom = async () => {
    console.log(roomData);
    fetch("http://localhost:8008/Tourism/insertRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("Room Added");
        } else {
          console.log("Room not added!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getRoomData = async () => {
    fetch("http://localhost:8008/Tourism/getRoomData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: localStorage.getItem("email") }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setDisplayRoomData(data.data);
        } else {
          console.log("Error to fetch data!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addRoomData = (e) => {
    e.preventDefault();

    roomData.current = {
      type: type,
      status: status,
      price: priceRef.current.value,
      quantity: quantityRef.current.value,
      email: email,
    };

    if (priceRef.current.value <= 0) {
      setError("Price can not be less than 0!");
      return;
    }
    if (quantityRef.current.value <= 0) {
      setError("Number of person can not be less than 0!");
      return;
    }
    if (type === "") {
      setError("Please select a type!");
      return;
    }
    if (status === "") {
      setError("Please select an availablity status!");
      return;
    }
    setError("");
    insertRoom();
    setAddRoomCard(false);
    window.location.reload();
  };
  const AddRoomCard = ({ onClose }) => {
    return (
      <div className="add-room-card-HD">
        <button className="close-icon-HD" onClick={CloseAddRoomCard}>
          ✕
        </button>
        <h2 className="heading-HD">Add New Room</h2>
        <div className="setting-content-div-HD">
          <select className="input-menu2-HD" value={type} onChange={TypeChange}>
            {roomType.map((option) => (
              <option
                className="select-menu-option-HD"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
          <select
            className="input-menu2-HD"
            value={status}
            onChange={StatusChange}
          >
            {statusType.map((option) => (
              <option
                className="select-menu-option-HD"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Price per night ($)"
            ref={priceRef}
            className="form-input2-HD"
            defaultValue={roomData.current.price}
            required
          />
          <input
            type="number"
            placeholder="Number of persons"
            ref={quantityRef}
            className="form-input2-HD"
            defaultValue={roomData.current.quantity}
            required
          />
        </div>
        {error && <p className="error-message-HD">{error}</p>}

        <button type="submit" className="form-button-HD" onClick={addRoomData}>
          Add Room
        </button>
      </div>
    );
  };
  const HomeContent = () => {
    return (
      <>
        <div className="details-container-GD">
          <h2 className="heading-HD">Details</h2>

          <div className="home-content-div-HD">
            <p className="data-HD">
              <strong>First Name: {firstName}</strong>
            </p>
            <p className="data-HD">
              <strong>Last Name: {lastName}</strong>
            </p>
            <p className="data-HD">
              <strong>Email: {email}</strong>
            </p>
            <p className="data-HD">
              <strong>Age: {age}</strong>
            </p>
            <p className="data-HD">
              <strong>Phone: {phone}</strong>
            </p>
            <p className="data-HD">
              <strong>Country: {country}</strong>
            </p>
            <p className="data-HD">
              <strong>City: {city}</strong>
            </p>
            <p className="data-HD">
              <strong>Address: {address}</strong>
            </p>
            <p className="data-HD">
              <strong>Password: {"*".repeat(password.length)}</strong>
            </p>
          </div>
        </div>
      </>
    );
  };

  const DeleteRooms = async (SR) => {
    console.log(SR);
    fetch("http://localhost:8008/Tourism/DeleteRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(SR),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("Room Deleted");
          window.location.reload();
        } else {
          console.log("Room not deleted!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleToggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
    setSelectedRooms([]);
    if (editboxes) {
      setEditboxes(false);
    }
  };
  const toggleEditButton = () => {
    setEditboxes(!editboxes);
    if (editingRoomId) {
      setEditingRoomId(null);
    }
    if (showCheckboxes) {
      setShowCheckboxes(false);
    }
  };

  const handleCheckboxChange = (roomId) => {
    setSelectedRooms((prevSelectedRooms) => {
      if (prevSelectedRooms.includes(roomId)) {
        return prevSelectedRooms.filter((id) => id !== roomId);
      } else {
        return [...prevSelectedRooms, roomId];
      }
    });
  };

  const handleDeleteSelectedRooms = () => {
    if (selectedRooms.length === 0) {
      alert("Please select rooms to delete.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected rooms?"
    );
    if (confirmDelete) {
      DeleteRooms(selectedRooms); // Call the onDeleteRooms function passed as a prop
      setShowCheckboxes(false); // Hide checkboxes after deletion
      setSelectedRooms([]); // Clear selected rooms
    }
  };
  const updateRoom = () => {
    console.log(editedRoomData);
    fetch("http://localhost:8008/Tourism/updateRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedRoomData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("Room Edited");
        } else {
          console.log("Room not edited!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleEditClick = (room) => {
    setEditingRoomId(room.room_id);
    setEditedRoomData({ ...room }); // Initialize edited data with current room data
  };

  const handleSaveClick = () => {
    if (editedRoomData.type === "") {
      setError("Please select a type!");
      return;
    }
    if (editedRoomData.price <= 0) {
      setError("Price can not be less than 0!");
      return;
    }
    if (editedRoomData.quantity <= 0) {
      setError("Number of person can not be less than 0!");
      return;
    }
    if (editedRoomData.status === "") {
      setError("Please select an availablity status!");
      return;
    }
    setError("");
    updateRoom(editedRoomData); // Call the update function
    setEditingRoomId(null); // Exit edit mode
    window.location.reload();
  };

  const handleCancelClick = () => {
    setEditingRoomId(null); // Exit edit mode without saving changes
  };

  const handleInputChange = (event, field) => {
    setEditedRoomData((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }));
  };
  const RoomContent = () => {
    return (
      <div>
        <div className="room-content-HD">
          <div
            className={`room-content-inner-HD ${
              addRoomCard ? "overlay-active-HD" : ""
            }`}
          >
            <h1 className="heading-room-HD">Rooms</h1>
            <div className="room-options-container-HD">
              <button className="room-option-HD" onClick={OpenAddRoomCard}>
                <AddIcon /> Add Room
              </button>
              <button
                className="room-option-HD"
                onClick={handleToggleCheckboxes}
              >
                <DeleteIcon />
                {showCheckboxes ? "Cancel Delete" : "Delete Room"}
              </button>
              <button className="room-option-HD" onClick={toggleEditButton}>
                <EditIcon /> {editboxes ? "Cancel Edit" : "Edit Room"}
              </button>
            </div>
            <div className="table-container-HD">
              {displayRoomData.length > 0 ? (
                <div>
                  <table className="room-table-HD">
                    <thead className="table-head-HD">
                      <tr>
                        {showCheckboxes && (
                          <th className="table-header-HD">Select</th>
                        )}
                        <th className="table-header-HD">Room Type</th>
                        <th className="table-header-HD">Price Per Night</th>
                        <th className="table-header-HD">Person Quantity</th>
                        <th className="table-header-HD">Room Status</th>
                        {editboxes && <th className="table-header-HD">Edit</th>}
                      </tr>
                    </thead>
                    <tbody className="table-body-HD">
                      {displayRoomData.map((room) => (
                        <tr key={room.room_id} className="table-row-HD">
                          {showCheckboxes && (
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedRooms.includes(room.room_id)}
                                onChange={() =>
                                  handleCheckboxChange(room.room_id)
                                }
                              />
                            </td>
                          )}
                          {editingRoomId === room.room_id ? ( // Edit mode
                            <>
                              <td>
                                <select
                                  className="select-editroom-HD"
                                  value={editedRoomData.type}
                                  onChange={(e) => handleInputChange(e, "type")}
                                >
                                  {roomType.map((option) => (
                                    <option
                                      className="select-menu-option-HD"
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  className="input-editroom-HD"
                                  type="number"
                                  value={editedRoomData.price}
                                  onChange={(e) =>
                                    handleInputChange(e, "price")
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  className="input-editroom-HD"
                                  type="number"
                                  value={editedRoomData.quantity}
                                  onChange={(e) =>
                                    handleInputChange(e, "quantity")
                                  }
                                />
                              </td>
                              <td>
                                <select
                                  className="select-editroom-HD"
                                  value={editedRoomData.status}
                                  onChange={(e) =>
                                    handleInputChange(e, "status")
                                  }
                                >
                                  {statusType.map((option) => (
                                    <option
                                      className="select-menu-option-HD"
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <div className="button-group-HD">
                                  <button
                                    className="save-button-HD"
                                    onClick={() =>
                                      handleSaveClick(room.room_id)
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="cancel-button-HD"
                                    onClick={handleCancelClick}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="table-cell-HD">{room.type}</td>
                              <td className="table-cell-HD">{room.price}</td>
                              <td className="table-cell-HD">{room.quantity}</td>
                              <td className="table-cell-HD">{room.status}</td>
                              {editboxes && (
                                <td>
                                  <button
                                    className="edit-button-HD"
                                    onClick={() => handleEditClick(room)}
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
                      className="delete-selected-HD"
                      onClick={handleDeleteSelectedRooms}
                    >
                      Delete Selected Rooms
                    </button>
                  )}
                  {error && <p className="error-message-HD">{error}</p>}
                </div>
              ) : (
                <p className="no-data-message-HD">No data available.</p>
              )}
            </div>
          </div>
        </div>

        {addRoomCard && <AddRoomCard onClose={CloseAddRoomCard} />}
      </div>
    );
  };
  const getReservationData = async () => {
    fetch("http://localhost:8008/Tourism/getReservationData", {
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
          setDisplayReservationData(data.data);
        } else {
          console.log("Error to fetch data!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlePendingButton = () => {
    setPendingButton(!pendingButton);
    setOngoingButton(false);
    setCompletedButton(false);
    if (selectedFilter !== "pending") {
      setSelectedFilter("pending");
    } else {
      setSelectedFilter(null);
    }
  };
  const handleOngoingButton = () => {
    setPendingButton(false);
    setOngoingButton(!ongoingButton);
    setCompletedButton(false);
    if (selectedFilter !== "ongoing") {
      setSelectedFilter("ongoing");
    } else {
      setSelectedFilter(null);
    }
  };
  const handleCompletedButton = () => {
    setPendingButton(false);
    setOngoingButton(false);
    setCompletedButton(!completedButton);
    if (selectedFilter !== "completed") {
      setSelectedFilter("completed");
    } else {
      setSelectedFilter(null);
    }
  };
  useEffect(() => {
    if (activeCard === "RoomUpdates") {
      getRoomData();
    } else if (activeCard === "ReservationUpdates") {
      getReservationData();
    } else if (activeCard === "Feedback") {
      getFeedbackData();
    }
  }, [activeCard]);
  const filteredReservations = displayReservationData.filter((reserv) => {
    if (!selectedFilter) {
      return true; // Show all if no filter is selected
    }
    return reserv.status.toLowerCase() === selectedFilter;
  });
  const updateReserv = () => {
    console.log(editedRoomData);
    fetch("http://localhost:8008/Tourism/updateReservationData", {
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
    console.log(editedRoomData);
    fetch("http://localhost:8008/Tourism/deleteReservationData", {
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
    console.log(reserv);
    console.log(reserv.reservation_id);
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
  const reservStatusType = [
    { value: "", label: "Select Status" },
    { value: "pending", label: "Pending" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
  ];

  const toggleReservationDeleteButton = () => {
    setReservDeleteboxes(!reservDeleteboxes);
    setSelectedRooms([]);
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
              toast.success("Feedback Submitted!");
              handleCloseFeedbackCard();
            } else {
              toast.error("Feedback did not Submit!");
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
    const [feedbackButton, setFeedbackButton] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [openFeedbackCard, setOpenFeedbackCard] = useState(false);
    const [receiver, setReceiver] = useState([]);
    const handleClickOpenFeedbackCard = (feedbackData) => {
      setReceiver(feedbackData);
      setError("");
      setOpenFeedbackCard(true);
    };
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
    return (
      <div>
        <div className="room-content-HD">
          <h1 className="heading-room-HD">Reservations</h1>
          <div className="room-options-container-HD">
            <button className="res-option-HD" onClick={handlePendingButton}>
              <HourglassFull />
              {pendingButton ? "Cancel Pending" : "Pending"}
            </button>
            <button className="res-option-HD" onClick={handleOngoingButton}>
              <Sync />
              {ongoingButton ? "Cancel Ongoing" : "Ongoing"}
            </button>
            <button className="res-option-HD" onClick={handleCompletedButton}>
              <CheckCircleIcon />
              {completedButton ? "Cancel Completed" : "Completed"}
            </button>
            <button className="res-option-HD" onClick={handleFeedbackButton}>
              <FeedbackIcon />
              {feedbackButton ? "Cancel Feedback" : "Give Feedback"}
            </button>
            <button
              className="res-option-HD"
              onClick={toggleReservationEditButton}
            >
              <EditIcon />
              {reservEditboxes ? "Cancel Edit" : "Edit"}
            </button>
            <button
              className="res-option-HD"
              onClick={toggleReservationDeleteButton}
            >
              {" "}
              <DeleteIcon />
              {reservDeleteboxes ? "Cancel Delete" : "Delete"}
            </button>
          </div>
          <div className="table-container-HD">
            {displayReservationData.length > 0 ? (
              <div>
                <table className="room-table-HD">
                  <thead className="table-head-HD">
                    <tr>
                      {reservDeleteboxes && (
                        <th className="table-header-HD">Select</th>
                      )}
                      <th className="table-header-HD">Room Type</th>
                      <th className="table-header-HD">Guest Name</th>
                      <th className="table-header-HD">Guest Phone Number</th>
                      <th className="table-header-HD">
                        Start Date (YYYY-MM-DD)
                      </th>
                      <th className="table-header-HD">End Date (YYYY-MM-DD)</th>
                      <th className="table-header-HD">Reservation Status</th>
                      {reservEditboxes && (
                        <th className="table-header-HD">Edit</th>
                      )}
                      {feedbackButton && (
                        <th className="table-header-GD">Feedback</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="table-body-HD">
                    {filteredReservations.map((reserv) => (
                      <tr key={reserv.reservation_id} className="table-row-HD">
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
                            <td className="table-cell-HD">{reserv.type}</td>
                            <td className="table-cell-HD">
                              {reserv.first_name}
                            </td>
                            <td className="table-cell-HD">{reserv.phone}</td>
                            <td className="table-cell-HD">
                              {reserv.start_date}
                            </td>
                            <td className="table-cell-HD">{reserv.end_date}</td>
                            <td>
                              <select
                                className="select-editroom-HD"
                                value={editedReservData.status}
                                onChange={(e) =>
                                  handleReservInputChange(e, "status")
                                }
                              >
                                {reservStatusType.map((option) => (
                                  <option
                                    className="select-menu-option-HD"
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <div className="button-group-HD">
                                <button
                                  className="save-button-HD"
                                  onClick={() =>
                                    handleSaveReservClick(reserv.reservation_id)
                                  }
                                >
                                  Save
                                </button>
                                <button
                                  className="cancel-button-HD"
                                  onClick={handleCancelReservClick}
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="table-cell-HD">{reserv.type}</td>
                            <td className="table-cell-HD">
                              {reserv.first_name}
                            </td>
                            <td className="table-cell-HD">{reserv.phone}</td>
                            <td className="table-cell-HD">
                              {reserv.start_date}
                            </td>
                            <td className="table-cell-HD">{reserv.end_date}</td>
                            <td className="table-cell-HD">{reserv.status}</td>
                            {reservEditboxes && (
                              <td>
                                <button
                                  className="edit-button-HD"
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
                    className="delete-selected-HD"
                    onClick={handleDeleteSelectedReserv}
                  >
                    Delete Selected Reservations
                  </button>
                )}
                {error && <p className="error-message-HD">{error}</p>}
              </div>
            ) : (
              <p className="no-data-message-HD">No data available.</p>
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
  const HotelData = useRef({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    password: "",
  });
  const updateHotelData = () => {
    console.log(HotelData);
    fetch("http://localhost:8008/Tourism/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(HotelData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("Hotel Data updated!");
        } else {
          console.log("Hotel Data not updated!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const saveChanges = (e) => {
    console.log(selectedCountryName);
    console.log(selectedCity);
    e.preventDefault();
    HotelData.current = {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      age: ageRef.current.value,
      country: selectedCountryName,
      city: selectedCity,
      address: addressRef.current.value,
      email: email,
      phone: phoneRef.current.value,
      password: passRef.current.value,
    };
    if (passRef.current.value !== confPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }
    if (ageRef.current.value < 18 || ageRef.current.value > 150) {
      setError("Select a valid age!");
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

    setError("");
    console.log(HotelData);
    updateHotelData();
    window.location.reload();
  };
  const HotelCountryChange = (event) => {
    event.preventDefault();
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
  const HotelCityChange = (event) => {
    event.preventDefault();
    setSelectedCity(event.target.value);
  };
  const editDataButton = () => {
    if (!editData) {
      setError("");
      HotelData.current = {
        first_name: firstName,
        last_name: lastName,
        age: age,
        country: country,
        city: city,
        address: address,
        email: email,
        phone: phone,
        password: password,
      };
    }
    setEditData(!editData);
  };
  const [accountStatus, setAccountStatus] = useState(true);
  useEffect(() => {
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
  }, []);
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
      fetch("http://localhost:8008/Tourism/CheckReservationCount", {
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
                "Deleting Account not possible when there are pending or ongoing reservations!"
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
      <div className="star-rating-AD">
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
        <div className="flight-content-AD">
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
                  <div className="feedback-content-AD">
                    <div className="feedback-rating-AD">
                      Rating: <StarRating rating={reserv.rating} />
                    </div>

                    <p className="feedback-text-AD">
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
        <h2 className="heading-HD">Settings</h2>
        {editData === true ? (
          <div className="setting-content-div-HD">
            <input
              type="text"
              placeholder="First Name"
              ref={firstNameRef}
              className="form-input-HD"
              defaultValue={HotelData.current.first_name}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              ref={lastNameRef}
              className="form-input-HD"
              defaultValue={HotelData.current.last_name}
              required
            />
            <p className="data-HD">
              <strong>Email:</strong> {email}
            </p>

            <input
              type="number"
              placeholder="Age(18-150)"
              ref={ageRef}
              className="form-input-HD"
              defaultValue={HotelData.current.age}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              ref={phoneRef}
              className="form-input-HD"
              defaultValue={HotelData.current.phone}
              required
            />
            <select
              className="input-menu-HD"
              id="country"
              value={selectedCountry}
              onChange={HotelCountryChange}
            >
              <option className="select-menu-option-HD" value="">
                Select Country
              </option>
              {Country.getAllCountries().map((country) => (
                <option
                  className="select-menu-option-HD"
                  key={country.isoCode}
                  value={country.isoCode}
                >
                  {country.name}
                </option>
              ))}
            </select>

            <select
              className="input-menu-HD"
              id="city"
              value={selectedCity}
              onChange={HotelCityChange}
              disabled={!selectedCountry}
            >
              <option className="select-menu-option-HD" value="">
                Select City
              </option>
              {cities.map((city) => (
                <option
                  className="select-menu-option-HD"
                  key={city.name}
                  value={city.name}
                >
                  {city.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Complete Address"
              ref={addressRef}
              className="form-input-HD"
              defaultValue={HotelData.current.address}
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              ref={passRef}
              defaultValue={HotelData.current.password}
              className="form-input-HD"
            />
            <input
              type="password"
              placeholder="Confirm password"
              ref={confPassRef}
              defaultValue={HotelData.current.password}
              className="form-input-HD"
              required
            />

            {error && <p className="error-message">{error}</p>}
          </div>
        ) : (
          <div className="setting-content-div-HD">
            <p className="data-HD">
              <strong>First Name: {firstName} </strong>
            </p>
            <p className="data-HD">
              <strong>Last Name: {lastName}</strong>
            </p>
            <p className="data-HD">
              <strong>Email: {email}</strong>
            </p>
            <p className="data-HD">
              <strong>Age: {age}</strong>
            </p>
            <p className="data-HD">
              <strong>Phone: {phone}</strong>
            </p>
            <p className="data-HD">
              <strong>Country: {country}</strong>
            </p>
            <p className="data-HD">
              <strong>City: {city}</strong>
            </p>
            <p className="data-HD">
              <strong>Address: {address}</strong>
            </p>
            <p className="data-HD">
              <strong>Password: {password}</strong>
            </p>
          </div>
        )}
        <div className="setting-container-HD">
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

        <div className="setting-container-HD">
          <button className="room-option-HD" onClick={lockAccount}>
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
        <div className="setting-container-HD">
          {error2 && <p className="error-message">{error2}</p>}
        </div>

        {accountStatus ? (
          <p className="locking-account-message-HD">
            <LockIcon />
            Locking Account will NOT show your Hotel to the Tourists for
            reservations
          </p>
        ) : (
          <p className="locking-account-message-HD">
            <LockOpenIcon />
            Unlocking Account will show your Hotel to the Tourists for
            reservations
          </p>
        )}
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
      case "Feedback":
        return <FeedbackContent />;
      case "SettingUpdates":
        return <SettingContent />;
      default:
        return null;
    }
  };
  function toggleMenu() {
    const menu = document.querySelector(".menu-HD");
    const hamburgerIcon = document.querySelector(".hamburger-icon-HD");
    menu.classList.toggle("open-HD");
    hamburgerIcon.classList.toggle("open-HD");
    setIsOpen(!isOpen);
  }
  return (
    <div>
      <Toaster />
      <div className="background-HD"></div>
      <div className="main-container-HD">
        <div className="hamburger-menu-HD">
          <button
            className={`hamburger-icon-HD ${isOpen ? "open-HD" : ""}`}
            onClick={toggleMenu}
          >
            <span
              className={`line-HD line-top-HD ${isOpen ? "open-HD" : ""}`}
            ></span>
            <span
              className={`line-HD line-middle-HD ${isOpen ? "open-HD" : ""}`}
            ></span>
            <span
              className={`line-HD line-bottom-HD ${isOpen ? "open-HD" : ""}`}
            ></span>
          </button>

          <nav className={`menu-HD ${isOpen ? "open-HD" : ""}`}>
            <ul>
              <li>
                <button
                  className="button-HD"
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
                  className="button-HD"
                  onClick={() => {
                    setActiveCard("RoomUpdates");
                    localStorage.setItem("activeCard", "RoomUpdates");
                  }}
                >
                  <BedIcon />
                  Rooms
                </button>
              </li>
              <li>
                <button
                  className="button-HD"
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
                  className="button-HD"
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
                  className="button-HD"
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
                <button className="button-HD" onClick={logOut}>
                  <LogoutIcon />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content-HD">
          <div className="details-HD">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default HotelDashboard;
