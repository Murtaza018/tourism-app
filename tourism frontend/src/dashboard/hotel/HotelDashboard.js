import { useState, useEffect, useRef } from "react";
import "./HotelDashboard.css";
import { useNavigate } from "react-router-dom";

function HotelDashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [displayRoomData, setDisplayRoomData] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storedDataString = localStorage.getItem("user_data");
    if (storedDataString) {
      try {
        const storedData = JSON.parse(storedDataString);
        if (storedData) {
          setFirstName(storedData.first_name || "");
          setLastName(storedData.last_name || "");
          setEmail(storedData.email || "");
          setAge(storedData.age || "");
          setPhone(storedData.phone || "");
          setCountry(storedData.country || "");
          setCity(storedData.city || "");
          setAddress(storedData.address || "");
          setPassword(storedData.password || "");
        }
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  const logOut = () => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("user_data");
    localStorage.removeItem("email");
    navigate("/signin");
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const mainContainer = document.querySelector(".main-container-HD");
    if (mainContainer) {
      mainContainer.classList.toggle("menu-open", isOpen);
    }
  }, [isOpen]);
  const [activeCard, setActiveCard] = useState("Home");
  const [addRoomCard, setAddRoomCard] = useState(false);

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
    const storedDataString = localStorage.getItem("user_data");
    const storedData = JSON.parse(storedDataString);

    fetch("http://localhost:8008/Tourism/getRoomData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: storedData.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          setDisplayRoomData(data.data);
          console.log(displayRoomData);
        } else {
          console.log("Error to fetch data!", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getRoomData();
  }, []);
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
  };
  const AddRoomCard = ({ onClose }) => {
    return (
      <div className="add-room-card-HD">
        <button className="close-icon-HD" onClick={CloseAddRoomCard}>
          ✕
        </button>
        <h2 className="heading-HD">Add New Room</h2>
        <select className="input-menu-HD" value={type} onChange={TypeChange}>
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
          className="input-menu-HD"
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
          className="form-input-HD"
          defaultValue={roomData.current.price}
          required
        />
        <input
          type="number"
          placeholder="Number of persons"
          ref={quantityRef}
          className="form-input-HD"
          defaultValue={roomData.current.quantity}
          required
        />
        {error && <p className="error-message-HD">{error}</p>}

        <button type="submit" className="form-button-HD" onClick={addRoomData}>
          Add Room
        </button>
      </div>
    );
  };
  const HomeContent = () => {
    return (
      <div>
        <h2 className="heading-HD">Details</h2>
        <p className="data-HD">
          <strong>First Name:</strong> {firstName}
        </p>
        <p className="data-HD">
          <strong>Last Name:</strong> {lastName}
        </p>
        <p className="data-HD">
          <strong>Email:</strong> {email}
        </p>
        <p className="data-HD">
          <strong>Age:</strong> {age}
        </p>
        <p className="data-HD">
          <strong>Phone:</strong> {phone}
        </p>
        <p className="data-HD">
          <strong>Country:</strong> {country}
        </p>
        <p className="data-HD">
          <strong>City:</strong> {city}
        </p>
        <p className="data-HD">
          <strong>Address:</strong> {address}
        </p>
        <p className="data-HD">
          <strong>Password:</strong> {password}
        </p>
      </div>
    );
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
                Add Room
              </button>
              <button className="room-option-HD">Delete Room</button>
            </div>
            <div>
              {displayRoomData.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Column 1</th>
                      <th>Column 2</th>
                      <th>Column 3</th>
                      <th>Column 4</th>
                      <th>Column 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayRoomData.map((tuple) => (
                      <tr key={tuple[0] || Math.random()}>
                        <td>{tuple[0]}</td>
                        <td>{tuple[1]}</td>
                        <td>{tuple[2]}</td>
                        <td>{tuple[3]}</td>
                        <td>{tuple[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No data available.</p>
              )}
            </div>
          </div>
        </div>

        {addRoomCard && <AddRoomCard onClose={CloseAddRoomCard} />}
      </div>
    );
  };
  const ReservationContent = () => {
    return (
      <div>
        <p>Hello Hotel {firstName} Reservation Content</p>
      </div>
    );
  };
  const SettingContent = () => {
    return (
      <div>
        <p>Hello Hotel {firstName} Setting Content</p>
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
      case "SettingUpdates":
        return <SettingContent />;
      default:
        return null;
    }
  };
  return (
    <div>
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
                  onClick={() => setActiveCard("Home")}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  className="button-HD"
                  onClick={() => setActiveCard("RoomUpdates")}
                >
                  Rooms
                </button>
              </li>
              <li>
                <button
                  className="button-HD"
                  onClick={() => setActiveCard("ReservationUpdates")}
                >
                  Reservations
                </button>
              </li>
              <li>
                <button
                  className="button-HD"
                  onClick={() => setActiveCard("SettingUpdates")}
                >
                  Settings
                </button>
              </li>
              <li>
                <button className="button-HD" onClick={logOut}>
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
