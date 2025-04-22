import { Card, Button } from "@mui/material";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";
import toast, { Toaster } from "react-hot-toast";

// Sign in page
function SignIn() {
  const navigate = useNavigate();
  // to select sign in card
  const [activeCard, setActiveCard] = useState(null);
  //display email or password error
  const [error, setError] = useState("");
  // refs for data
  const emailRef = useRef("");
  const passRef = useRef("");
  // tourist data object
  const touristData = useRef({
    email: "",
    password: "",
  });
  const signInTourist = async () => {
    console.log(touristData);
    fetch("http://localhost:8008/Tourism/signInUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(touristData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data.data);
          if (data.data[0].status && data.data[0].status === 2) {
            toast.error("Account locked by Admin!");
          } else if (
            data.data[0].password &&
            data.data[0].password === touristData.current.password
          ) {
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("user_data", JSON.stringify(data.data[0]));
            localStorage.setItem("activeCard", "Home");
            localStorage.setItem("email", data.data[0].email);
            navigate("/TouristDashboard");
          } else {
            toast.error("Incorrect Password!");
          }
        } else {
          toast.error("Email does not exist!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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

    signInTourist();
  };

  const TouristCard = () => (
    <div className="card2-signin">
      <button className="close-icon-signin" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container-signin">
        <div className="heading-signin">Tourist Sign In</div>
        <form onSubmit={handleTouristDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input-signin"
            defaultValue={touristData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input-signin"
            defaultValue={touristData.current.password}
          />
          {error && <p className="error-message-signin">{error}</p>}
          <button type="submit" className="form-button-signin">
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
  const signInHotel = async () => {
    console.log(HotelData);
    fetch("http://localhost:8008/Tourism/signInUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(HotelData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data.data);
          if (data.data[0].status && data.data[0].status === 2) {
            toast.error("Account locked by Admin!");
          } else if (
            data.data[0].password &&
            data.data[0].password === HotelData.current.password
          ) {
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("user_data", JSON.stringify(data.data[0]));
            localStorage.setItem("activeCard", "Home");
            localStorage.setItem("email", data.data[0].email);
            navigate("/HotelDashboard");
          } else {
            toast.error("Incorrect Password!");
          }
        } else {
          toast.error("Email does not exist!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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

    signInHotel();
  };

  const HotelCard = () => (
    <div className="card2-signin">
      <button className="close-icon-signin" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container-signin">
        <div className="heading-signin">Hotel Sign In</div>
        <form onSubmit={handleHotelDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input-signin"
            defaultValue={HotelData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input-signin"
            defaultValue={HotelData.current.password}
          />
          {error && <p className="error-message-signin">{error}</p>}
          <button type="submit" className="form-button-signin">
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
  const signInGuide = async () => {
    console.log(GuideData);
    fetch("http://localhost:8008/Tourism/signInUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(GuideData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data.data);
          if (data.data[0].status && data.data[0].status === 2) {
            toast.error("Account locked by Admin!");
          } else if (
            data.data[0].password &&
            data.data[0].password === GuideData.current.password
          ) {
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("user_data", JSON.stringify(data.data[0]));
            localStorage.setItem("activeCard", "Home");
            localStorage.setItem("email", data.data[0].email);
            navigate("/GuideDashboard");
          } else {
            toast.error("Incorrect Password!");
          }
        } else {
          toast.error("Email does not exist!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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

    signInGuide();
  };

  const GuideCard = () => (
    <div className="card2-signin">
      <button className="close-icon-signin" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container-signin">
        <div className="heading-signin">Guide Sign In</div>
        <form onSubmit={handleGuideDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input-signin"
            defaultValue={GuideData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input-signin"
            defaultValue={GuideData.current.password}
          />
          {error && <p className="error-message-signin">{error}</p>}
          <button type="submit" className="form-button-signin">
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
  const signInAirline = async () => {
    console.log(AirlineData);
    fetch("http://localhost:8008/Tourism/signInUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(AirlineData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data.data);
          if (data.data[0].status && data.data[0].status === 2) {
            toast.error("Account locked by Admin!");
          } else if (
            data.data[0].password &&
            data.data[0].password === AirlineData.current.password
          ) {
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("user_data", JSON.stringify(data.data[0]));
            localStorage.setItem("activeCard", "Home");
            localStorage.setItem("email", data.data[0].email);
            navigate("/AirlineDashboard");
          } else {
            toast.error("Incorrect Password!");
          }
        } else {
          toast.error("Email does not exist!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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

    signInAirline();
  };

  const AirlineCard = () => (
    <div className="card2-signin">
      <button className="close-icon-signin" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container-signin">
        <div className="heading-signin">Airline Sign In</div>
        <form onSubmit={handleAirlineDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input-signin"
            defaultValue={AirlineData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input-signin"
            defaultValue={AirlineData.current.password}
          />
          {error && <p className="error-message-signin">{error}</p>}
          <button type="submit" className="form-button-signin">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const RentalData = useRef({
    email: "",
    password: "",
  });
  const signInRental = async () => {
    console.log(RentalData);
    fetch("http://localhost:8008/Tourism/signInUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(RentalData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data.data);
          if (data.data[0].status && data.data[0].status === 2) {
            toast.error("Account locked by Admin!");
          } else if (
            data.data[0].password &&
            data.data[0].password === RentalData.current.password
          ) {
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("user_data", JSON.stringify(data.data[0]));
            localStorage.setItem("activeCard", "Home");
            localStorage.setItem("email", data.data[0].email);
            navigate("/RentalDashboard");
          } else {
            toast.error("Incorrect Password!");
          }
        } else {
          toast.error("Email does not exist!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleRentalDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    RentalData.current = {
      email: emailRef.current.value,
      password: RentalData.current.password, // Store existing password
    };

    // Store password in RentalData
    RentalData.current.password = passRef.current.value;

    signInRental();
  };

  const RentalCard = () => (
    <div className="card2-signin">
      <button className="close-icon-signin" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container-signin">
        <div className="heading-signin">Rental Sign In</div>
        <form onSubmit={handleRentalDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input-signin"
            defaultValue={RentalData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input-signin"
            defaultValue={RentalData.current.password}
          />
          {error && <p className="error-message-signin">{error}</p>}
          <button type="submit" className="form-button-signin">
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
  const signInAdmin = async () => {
    console.log(AdminData);
    fetch("http://localhost:8008/Tourism/signInUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(AdminData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data.data);
          if (
            data.data[0].password &&
            data.data[0].password === AdminData.current.password
          ) {
            localStorage.setItem("loggedIn", true);
            localStorage.setItem("user_data", JSON.stringify(data.data[0]));
            localStorage.setItem("activeCard", "Home");
            localStorage.setItem("email", data.data[0].email);

            navigate("/AdminDashboard");
          } else {
            setError("Incorrect Password!");
          }
        } else {
          setError("Email does not exist!");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleAdminDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    AdminData.current = {
      email: emailRef.current.value,
      password: AdminData.current.password, // Store existing password
    };

    // Store password in AdminData
    AdminData.current.password = passRef.current.value;

    signInAdmin();
  };

  const AdminCard = () => (
    <div className="card2-signin">
      <button className="close-icon-signin" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container-signin">
        <div className="heading-signin">Admin Sign In</div>
        <form onSubmit={handleAdminDataSubmit}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input-signin"
            defaultValue={AdminData.current.email}
          />
          <input
            type="password"
            placeholder="Enter password"
            ref={passRef}
            className="form-input-signin"
            defaultValue={AdminData.current.password}
          />
          {error && <p className="error-message-signin">{error}</p>}
          <button type="submit" className="form-button-signin">
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
      case "RentalCard":
        return <RentalCard />;
      case "AdminCard":
        return <AdminCard />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Toaster />
      <div className="back2-signin">
        <Card className="card-signin">
          <div className="heading-signin">Sign In</div>
          <div className="button-container-signin">
            <Button
              className="button-signin"
              onClick={() => setActiveCard("TouristCard")}
            >
              Tourist
            </Button>
            <Button
              className="button-signin"
              onClick={() => setActiveCard("HotelCard")}
            >
              Hotel Management
            </Button>
            <Button
              className="button-signin"
              onClick={() => setActiveCard("AirlineCard")}
            >
              Airline Company
            </Button>
            <Button
              className="button-signin"
              onClick={() => setActiveCard("GuideCard")}
            >
              Tour Guide
            </Button>
            <Button
              className="button-signin"
              onClick={() => setActiveCard("RentalCard")}
            >
              Car Rental
            </Button>
            <Button
              className="button-signin"
              onClick={() => setActiveCard("AdminCard")}
            >
              Admin
            </Button>
            <Button
              className="button-signin"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </Card>
        <div>{renderCardContent()}</div>
      </div>
    </div>
  );
}

export default SignIn;
