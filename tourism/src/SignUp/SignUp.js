import { Card, Button } from "@mui/material";
import { useState, useRef } from "react";
import "./SignUp.css";

// Sign up page
function SignUp() {
  // to select sign up card
  const [activeCard, setActiveCard] = useState(null);

  // check password and confirm password are same
  const [error, setError] = useState("");

  // refs for data
  const nameRef = useRef("");
  const addressRef = useRef("");
  const emailRef = useRef("");
  const phoneRef = useRef("");
  const passRef = useRef("");
  const confPassRef = useRef("");

  // tourist data object
  const touristData = useRef({
    name: "",
    address: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleTouristDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    touristData.current = {
      name: nameRef.current.value,
      address: addressRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: touristData.current.password, // Store existing password
    };

    if (passRef.current.value !== confPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }
    setError("");

    // Store password in touristData
    touristData.current.password = passRef.current.value;

    alert(
      `Passwords match! Submitted Data:\nName: ${touristData.current.name}\nAddress: ${touristData.current.address}
      \nEmail: ${touristData.current.email}\nPhone: ${touristData.current.phone}\nPassword: ${touristData.current.password}`
    );
  };

  const TouristCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Tourist Sign Up</div>
        <form onSubmit={handleTouristDataSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            ref={nameRef}
            className="form-input"
            defaultValue={touristData.current.name}
          />
          <input
            type="text"
            placeholder="Address"
            ref={addressRef}
            className="form-input"
            defaultValue={touristData.current.address}
          />
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={touristData.current.email}
          />
          <input
            type="tel"
            placeholder="Phone"
            ref={phoneRef}
            className="form-input"
            defaultValue={touristData.current.phone}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Confirm password"
            ref={confPassRef}
            className="form-input"
          />
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const HotelData = useRef({
    name: "",
    address: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleHotelDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    HotelData.current = {
      name: nameRef.current.value,
      address: addressRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: HotelData.current.password, // Store existing password
    };

    if (passRef.current.value !== confPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }
    setError("");

    // Store password in HotelData
    HotelData.current.password = passRef.current.value;

    alert(
      `Passwords match! Submitted Data:\nName: ${HotelData.current.name}\nAddress: ${HotelData.current.address}
      \nEmail: ${HotelData.current.email}\nPhone: ${HotelData.current.phone}\nPassword: ${HotelData.current.password}`
    );
  };

  const HotelCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Hotel Management Sign Up</div>
        <form onSubmit={handleHotelDataSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            ref={nameRef}
            className="form-input"
            defaultValue={HotelData.current.name}
          />
          <input
            type="text"
            placeholder="Address"
            ref={addressRef}
            className="form-input"
            defaultValue={HotelData.current.address}
          />
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={HotelData.current.email}
          />
          <input
            type="tel"
            placeholder="Phone"
            ref={phoneRef}
            className="form-input"
            defaultValue={HotelData.current.phone}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Confirm password"
            ref={confPassRef}
            className="form-input"
          />
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const AirlineData = useRef({
    name: "",
    address: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleAirlineDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    AirlineData.current = {
      name: nameRef.current.value,
      address: addressRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: AirlineData.current.password, // Store existing password
    };

    if (passRef.current.value !== confPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }
    setError("");

    // Store password in AirlineData
    AirlineData.current.password = passRef.current.value;

    alert(
      `Passwords match! Submitted Data:\nName: ${AirlineData.current.name}\nAddress: ${AirlineData.current.address}
      \nEmail: ${AirlineData.current.email}\nPhone: ${AirlineData.current.phone}\nPassword: ${AirlineData.current.password}`
    );
  };

  const AirlineCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Airline Company Sign Up</div>
        <form onSubmit={handleAirlineDataSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            ref={nameRef}
            className="form-input"
            defaultValue={AirlineData.current.name}
          />
          <input
            type="text"
            placeholder="Address"
            ref={addressRef}
            className="form-input"
            defaultValue={AirlineData.current.address}
          />
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={AirlineData.current.email}
          />
          <input
            type="tel"
            placeholder="Phone"
            ref={phoneRef}
            className="form-input"
            defaultValue={AirlineData.current.phone}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Confirm password"
            ref={confPassRef}
            className="form-input"
          />
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const GuideData = useRef({
    name: "",
    address: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleGuideDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    GuideData.current = {
      name: nameRef.current.value,
      address: addressRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: GuideData.current.password, // Store existing password
    };

    if (passRef.current.value !== confPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }
    setError("");

    // Store password in GuideData
    GuideData.current.password = passRef.current.value;

    alert(
      `Passwords match! Submitted Data:\nName: ${GuideData.current.name}\nAddress: ${GuideData.current.address}
      \nEmail: ${GuideData.current.email}\nPhone: ${GuideData.current.phone}\nPassword: ${GuideData.current.password}`
    );
  };

  const GuideCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Tour Guide Sign Up</div>
        <form onSubmit={handleGuideDataSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            ref={nameRef}
            className="form-input"
            defaultValue={GuideData.current.name}
          />
          <input
            type="text"
            placeholder="Address"
            ref={addressRef}
            className="form-input"
            defaultValue={GuideData.current.address}
          />
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={GuideData.current.email}
          />
          <input
            type="tel"
            placeholder="Phone"
            ref={phoneRef}
            className="form-input"
            defaultValue={GuideData.current.phone}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Confirm password"
            ref={confPassRef}
            className="form-input"
          />
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );

  const renderCardContent = () => {
    switch (activeCard) {
      case "TouristCard":
        return <TouristCard />;
      case "HotelCard":
        return <HotelCard />;
      case "AirlineCard":
        return <AirlineCard />;
      case "GuideCard":
        return <GuideCard />;
      default:
        return null;
    }
  };

  return (
    <div className="back">
      <Card className="card">
        <div className="heading">Sign Up</div>
        <div className="button-container">
          <Button
            className="button"
            onClick={() => setActiveCard("TouristCard")}
          >
            Tourist
          </Button>
          <Button className="button" onClick={() => setActiveCard("HotelCard")}>
            Hotel Management
          </Button>
          <Button
            className="button"
            onClick={() => setActiveCard("AirlineCard")}
          >
            Airline Company
          </Button>
          <Button className="button" onClick={() => setActiveCard("GuideCard")}>
            Tour Guide
          </Button>
        </div>
      </Card>
      <div className="card-content">{renderCardContent()}</div>
    </div>
  );
}

export default SignUp;
