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
  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passRef = useRef(null);
  const confPassRef = useRef(null);

  const [touristData, setTouristData] = useState({});

  const handleTouristDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const data = {
      name: nameRef.current.value,
      address: addressRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
    };
    setTouristData(data);

    setActiveCard("passcard");
  };

  const handleTouristPassSubmit = (e) => {
    e.preventDefault();
    const { name, address, email, phone } = touristData;
    if (passRef.current.value !== confPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    alert(
      `Passwords match! Submitted Data:\nName: ${name}\nAddress: ${address}\nEmail: ${email}\nPhone: ${phone}`
    );
  };

  const Card1 = () => (
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
          />
          <input
            type="text"
            placeholder="Address"
            ref={addressRef}
            className="form-input"
          />
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
          />
          <input
            type="tel"
            placeholder="Phone"
            ref={phoneRef}
            className="form-input"
          />
          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );

  const Passcard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Tourist Sign Up</div>
        <form onSubmit={handleTouristPassSubmit}>
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
      case "card1":
        return <Card1 />;
      case "card2":
        return <Card2 />;
      case "card3":
        return <Card3 />;
      case "card4":
        return <Card4 />;
      case "passcard":
        return <Passcard />;
      default:
        return null;
    }
  };

  return (
    <div className="back">
      <Card className="card">
        <div className="heading">Sign Up</div>
        <div className="button-container">
          <Button className="button" onClick={() => setActiveCard("card1")}>
            Tourist
          </Button>
          <Button className="button" onClick={() => setActiveCard("card2")}>
            Hotel Management
          </Button>
          <Button className="button" onClick={() => setActiveCard("card3")}>
            Airline Company
          </Button>
          <Button className="button" onClick={() => setActiveCard("card4")}>
            Tour Guide
          </Button>
        </div>
      </Card>
      <div className="card-content">{renderCardContent()}</div>
    </div>
  );
}

export default SignUp;
