import { Card, Button } from "@mui/material";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Country, City } from "country-state-city";

import "./SignUp.css";

// Sign up page
function SignUp() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cities, setCities] = useState([]);

  const insertTourist = async () => {
    console.log(touristData);
    fetch("http://localhost:8008/Tourism/insertUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(touristData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("User created");
        } else {
          console.log("User not created!P", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // to select sign up card
  const [activeCard, setActiveCard] = useState(null);

  // check password and confirm password are same
  const [error, setError] = useState("");

  // refs for data
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const ageRef = useRef("");
  const addressRef = useRef("");
  const emailRef = useRef("");
  const phoneRef = useRef("");
  const passRef = useRef("");
  const confPassRef = useRef("");

  // tourist data object
  const touristData = useRef({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    password: "",
    role_ID: "",
  });

  const handleTouristDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    touristData.current = {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      age: ageRef.current.value,
      country: selectedCountryName,
      city: selectedCity,
      address: addressRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: touristData.current.password,
      role_ID: 1,
    };

    if (passRef.current.value !== confPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }
    if (ageRef.current.value < 18 || ageRef.current.value > 150) {
      setError("Invalid age!");
      return;
    }
    setError("");

    // Store password in touristData
    touristData.current.password = passRef.current.value;
    insertTourist();
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("user_data", JSON.stringify(touristData.current));
    navigate("/TouristDashboard");
  };
  // Handle country selection
  const touristCountryChange = (event) => {
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
  const touristCityChange = (event) => {
    event.preventDefault();
    setSelectedCity(event.target.value);
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
            placeholder="First Name"
            ref={firstNameRef}
            className="form-input"
            defaultValue={touristData.current.first_name}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            ref={lastNameRef}
            className="form-input"
            defaultValue={touristData.current.last_name}
            required
          />
          <input
            type="number"
            placeholder="Age(18-150)"
            ref={ageRef}
            className="form-input"
            defaultValue={touristData.current.age}
            required
          />
          <select
            className="input-menu"
            id="country"
            value={selectedCountry}
            onChange={touristCountryChange}
          >
            <option className="select-menu-option" value="">
              Select Country
            </option>
            {Country.getAllCountries().map((country) => (
              <option
                className="select-menu-option"
                key={country.isoCode}
                value={country.isoCode}
              >
                {country.name}
              </option>
            ))}
          </select>

          <select
            className="input-menu"
            id="city"
            value={selectedCity}
            onChange={touristCityChange}
            disabled={!selectedCountry}
          >
            <option className="select-menu-option" value="">
              Select City
            </option>
            {cities.map((city) => (
              <option
                className="select-menu-option"
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
            className="form-input"
            defaultValue={touristData.current.address}
            required
          />
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={touristData.current.email}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            ref={phoneRef}
            className="form-input"
            defaultValue={touristData.current.phone}
            required
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
            required
          />
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const insertHotel = async () => {
    console.log(HotelData);
    fetch("http://localhost:8008/Tourism/insertUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(HotelData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("User created");
        } else {
          console.log("User not created!P", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Hotel data object
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
    role_ID: "",
  });

  const handleHotelDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    HotelData.current = {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      age: ageRef.current.value,
      country: selectedCountryName,
      city: selectedCity,
      address: addressRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: HotelData.current.password,
      role_ID: 2,
    };

    if (passRef.current.value !== confPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }
    if (ageRef.current.value < 18 || ageRef.current.value > 150) {
      setError("Invalid age!");
      return;
    }
    setError("");

    // Store password in HotelData
    HotelData.current.password = passRef.current.value;
    insertHotel();
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("user_data", JSON.stringify(HotelData.current));
    navigate("/HotelDashboard");
  };
  // Handle country selection
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
  const HotelCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Hotel Sign Up</div>
        <form onSubmit={handleHotelDataSubmit}>
          <input
            type="text"
            placeholder="First Name"
            ref={firstNameRef}
            className="form-input"
            defaultValue={HotelData.current.first_name}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            ref={lastNameRef}
            className="form-input"
            defaultValue={HotelData.current.last_name}
            required
          />
          <input
            type="number"
            placeholder="Age(18-150)"
            ref={ageRef}
            className="form-input"
            defaultValue={HotelData.current.age}
            required
          />
          <select
            className="input-menu"
            id="country"
            value={selectedCountry}
            onChange={HotelCountryChange}
          >
            <option className="select-menu-option" value="">
              Select Country
            </option>
            {Country.getAllCountries().map((country) => (
              <option
                className="select-menu-option"
                key={country.isoCode}
                value={country.isoCode}
              >
                {country.name}
              </option>
            ))}
          </select>

          <select
            className="input-menu"
            id="city"
            value={selectedCity}
            onChange={HotelCityChange}
            disabled={!selectedCountry}
          >
            <option className="select-menu-option" value="">
              Select City
            </option>
            {cities.map((city) => (
              <option
                className="select-menu-option"
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
            className="form-input"
            defaultValue={HotelData.current.address}
            required
          />
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={HotelData.current.email}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            ref={phoneRef}
            className="form-input"
            defaultValue={HotelData.current.phone}
            required
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
            required
          />
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const insertAirline = async () => {
    console.log(AirlineData);
    fetch("http://localhost:8008/Tourism/insertUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(AirlineData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("User created");
        } else {
          console.log("User not created!P", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Airline data object
  const AirlineData = useRef({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    password: "",
    role_ID: "",
  });

  const handleAirlineDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    AirlineData.current = {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      age: ageRef.current.value,
      country: selectedCountryName,
      city: selectedCity,
      address: addressRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: AirlineData.current.password,
      role_ID: 3,
    };

    if (passRef.current.value !== confPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }
    if (ageRef.current.value < 18 || ageRef.current.value > 150) {
      setError("Invalid age!");
      return;
    }
    setError("");

    // Store password in AirlineData
    AirlineData.current.password = passRef.current.value;
    insertAirline();
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("user_data", JSON.stringify(AirlineData.current));
    navigate("/AirlineDashboard");
  };
  // Handle country selection
  const AirlineCountryChange = (event) => {
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
  const AirlineCityChange = (event) => {
    event.preventDefault();
    setSelectedCity(event.target.value);
  };
  const AirlineCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Airline Sign Up</div>
        <form onSubmit={handleAirlineDataSubmit}>
          <input
            type="text"
            placeholder="First Name"
            ref={firstNameRef}
            className="form-input"
            defaultValue={AirlineData.current.first_name}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            ref={lastNameRef}
            className="form-input"
            defaultValue={AirlineData.current.last_name}
            required
          />
          <input
            type="number"
            placeholder="Age(18-150)"
            ref={ageRef}
            className="form-input"
            defaultValue={AirlineData.current.age}
            required
          />
          <select
            className="input-menu"
            id="country"
            value={selectedCountry}
            onChange={AirlineCountryChange}
          >
            <option className="select-menu-option" value="">
              Select Country
            </option>
            {Country.getAllCountries().map((country) => (
              <option
                className="select-menu-option"
                key={country.isoCode}
                value={country.isoCode}
              >
                {country.name}
              </option>
            ))}
          </select>

          <select
            className="input-menu"
            id="city"
            value={selectedCity}
            onChange={AirlineCityChange}
            disabled={!selectedCountry}
          >
            <option className="select-menu-option" value="">
              Select City
            </option>
            {cities.map((city) => (
              <option
                className="select-menu-option"
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
            className="form-input"
            defaultValue={AirlineData.current.address}
            required
          />
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={AirlineData.current.email}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            ref={phoneRef}
            className="form-input"
            defaultValue={AirlineData.current.phone}
            required
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
            required
          />
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
  const insertGuide = async () => {
    console.log(GuideData);
    fetch("http://localhost:8008/Tourism/insertUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(GuideData.current),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log("User created");
        } else {
          console.log("User not created!P", data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Guide data object
  const GuideData = useRef({
    first_name: "",
    last_name: "",
    email: "",
    age: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    password: "",
    role_ID: "",
  });

  const handleGuideDataSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // Store data in ref instead of state
    GuideData.current = {
      first_name: firstNameRef.current.value,
      last_name: lastNameRef.current.value,
      age: ageRef.current.value,
      country: selectedCountryName,
      city: selectedCity,
      address: addressRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: GuideData.current.password,
      role_ID: 4,
    };

    if (passRef.current.value !== confPassRef.current.value) {
      setError("Passwords do not match!");
      return;
    }
    if (ageRef.current.value < 18 || ageRef.current.value > 150) {
      setError("Invalid age!");
      return;
    }
    setError("");

    // Store password in GuideData
    GuideData.current.password = passRef.current.value;
    insertGuide();
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("user_data", JSON.stringify(GuideData.current));
    navigate("/GuideDashboard");
  };
  // Handle country selection
  const GuideCountryChange = (event) => {
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
  const GuideCityChange = (event) => {
    event.preventDefault();
    setSelectedCity(event.target.value);
  };
  const GuideCard = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <div className="form-container">
        <div className="heading">Guide Sign Up</div>
        <form onSubmit={handleGuideDataSubmit}>
          <input
            type="text"
            placeholder="First Name"
            ref={firstNameRef}
            className="form-input"
            defaultValue={GuideData.current.first_name}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            ref={lastNameRef}
            className="form-input"
            defaultValue={GuideData.current.last_name}
            required
          />
          <input
            type="number"
            placeholder="Age(18-150)"
            ref={ageRef}
            className="form-input"
            defaultValue={GuideData.current.age}
            required
          />
          <select
            className="input-menu"
            id="country"
            value={selectedCountry}
            onChange={GuideCountryChange}
          >
            <option className="select-menu-option" value="">
              Select Country
            </option>
            {Country.getAllCountries().map((country) => (
              <option
                className="select-menu-option"
                key={country.isoCode}
                value={country.isoCode}
              >
                {country.name}
              </option>
            ))}
          </select>

          <select
            className="input-menu"
            id="city"
            value={selectedCity}
            onChange={GuideCityChange}
            disabled={!selectedCountry}
          >
            <option className="select-menu-option" value="">
              Select City
            </option>
            {cities.map((city) => (
              <option
                className="select-menu-option"
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
            className="form-input"
            defaultValue={GuideData.current.address}
            required
          />
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="form-input"
            defaultValue={GuideData.current.email}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            ref={phoneRef}
            className="form-input"
            defaultValue={GuideData.current.phone}
            required
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
            required
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
    <div>
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
            <Button
              className="button"
              onClick={() => setActiveCard("HotelCard")}
            >
              Hotel Management
            </Button>
            <Button
              className="button"
              onClick={() => setActiveCard("AirlineCard")}
            >
              Airline Company
            </Button>
            <Button
              className="button"
              onClick={() => setActiveCard("GuideCard")}
            >
              Tour Guide
            </Button>
          </div>
        </Card>
        <div>{renderCardContent()}</div>
      </div>
      <div className="back"></div>
    </div>
  );
}

export default SignUp;
