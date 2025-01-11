import { Card, Button } from "@mui/material";
import { useState, useRef } from "react";
import "./SignIn.css";

// Sign in page
function SignIn() {
  // to select sign in card
  const [activeCard, setActiveCard] = useState(null);

  // refs for data
  const emailRef = useRef("");
  const passRef = useRef("");
  // tourist data object
  const touristData = useRef({
    email: "",
    password: "",
  });

  const handleTouristDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    touristData.current = {
      email: emailRef.current.value,
      password: touristData.current.password, // Store existing password
    };

    // Store password in touristData
    touristData.current.password = passRef.current.value;

    alert(
      `Passwords match! Submitted Data:\nEmail: ${touristData.current.email}\nPassword: ${touristData.current.password}`
    );
  };

  const TouristCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Tourist Sign In</div>
        <form onSubmit={handleTouristDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={touristData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input"
          />
          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const HotelData = useRef({
    email: "",
    password: "",
  });

  const handleHotelDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    HotelData.current = {
      email: emailRef.current.value,
      password: HotelData.current.password, // Store existing password
    };

    // Store password in HotelData
    HotelData.current.password = passRef.current.value;

    alert(
      `Passwords match! Submitted Data:\nEmail: ${HotelData.current.email}\nPassword: ${HotelData.current.password}`
    );
  };

  const HotelCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Hotel Management Sign In</div>
        <form onSubmit={handleHotelDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={HotelData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input"
          />
          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const AirlineData = useRef({
    email: "",
    password: "",
  });

  const handleAirlineDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    AirlineData.current = {
      email: emailRef.current.value,
      password: AirlineData.current.password, // Store existing password
    };

    // Store password in AirlineData
    AirlineData.current.password = passRef.current.value;

    alert(
      `Passwords match! Submitted Data:\nEmail: ${AirlineData.current.email}\nPassword: ${AirlineData.current.password}`
    );
  };

  const AirlineCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Airline Company Sign In</div>
        <form onSubmit={handleAirlineDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={AirlineData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input"
          />
          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const GuideData = useRef({
    email: "",
    password: "",
  });

  const handleGuideDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    GuideData.current = {
      email: emailRef.current.value,
      password: GuideData.current.password, // Store existing password
    };

    // Store password in GuideData
    GuideData.current.password = passRef.current.value;

    alert(
      `Passwords match! Submitted Data:\nEmail: ${GuideData.current.email}\nPassword: ${GuideData.current.password}`
    );
  };

  const GuideCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Tour Guide Sign In</div>
        <form onSubmit={handleGuideDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={GuideData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input"
          />
          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const AdminData = useRef({
    email: "",
    password: "",
  });

  const handleAdminDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    AdminData.current = {
      email: emailRef.current.value,
      password: AdminData.current.password, // Store existing password
    };

    // Store password in GuideData
    AdminData.current.password = passRef.current.value;

    alert(
      `Passwords match! Submitted Data:\nEmail: ${AdminData.current.email}\nPassword: ${AdminData.current.password}`
    );
  };

  const AdminCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Admin Sign In</div>
        <form onSubmit={handleAdminDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={AdminData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input"
          />
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
      case "AdminCard":
        return <AdminCard />;
      default:
        return null;
    }
  };

  return (
    <div className="back2">
      <Card className="card">
        <div className="heading">Sign In</div>
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
          <Button className="button" onClick={() => setActiveCard("AdminCard")}>
            Admin
          </Button>
        </div>
      </Card>
      <div className="card-content">{renderCardContent()}</div>
    </div>
  );
}

export default SignIn;
