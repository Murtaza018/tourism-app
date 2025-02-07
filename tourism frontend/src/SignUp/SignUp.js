import { Card, Button } from "@mui/material";
import { useState, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Country, City } from "country-state-city";

import "./SignUp.css";

// Sign up page
function SignUp() {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(false);
  const TouristCard = () => {
    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      age: "",
      phone: "",
      country: "",
      city: "",
      address: "",
      password: "",
      role_ID: 1,
    });
    const [selectedCountry, setSelectedCountry] = useState("");
    const [cities, setCities] = useState([]);
    const [error, setError] = useState("");
    const passRef = useRef();
    const confPassRef = useRef();

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };

    const TouristCountryChange = (event) => {
      const countryIsoCode = event.target.value;
      setSelectedCountry(countryIsoCode);

      // Fetch cities for the selected country
      if (countryIsoCode) {
        const countryCities = City.getCitiesOfCountry(countryIsoCode);
        setCities(countryCities);
      } else {
        setCities([]); // Reset cities if no country is selected
      }
      setFormData({
        ...formData,
        country: Country.getCountryByCode(countryIsoCode)?.name || "",
        city: "",
      });
    };

    const TouristCityChange = (event) => {
      const selectedCityName = event.target.value;
      setFormData({ ...formData, city: selectedCityName });
    };

    const handleTouristDataSubmit = (e) => {
      e.preventDefault();

      if (passRef.current.value !== confPassRef.current.value) {
        setError("Passwords do not match!");
        return;
      }
      if (formData.age < 18 || formData.age > 150) {
        setError("Invalid age!");
        return;
      }
      if (formData.country === "") {
        setError("Select a valid country!");
        return;
      }
      if (formData.city === "") {
        setError("Select a valid city!");
        return;
      }
      setError("");

      formData.password = passRef.current.value;
      console.log(formData);
      insertTourist(formData);
      localStorage.setItem("loggedIn", true);
      localStorage.setItem("email", formData.email);
      navigate("/TouristDashboard");
    };

    const insertTourist = async (data) => {
      fetch("http://localhost:8008/Tourism/insertUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

    return (
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
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Age(18-150)"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <select
              className="input-menu"
              id="country"
              value={selectedCountry}
              onChange={TouristCountryChange}
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
              name="city"
              value={formData.city}
              onChange={TouristCityChange}
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
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              ref={passRef}
              className="form-input"
              required
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
  };
  const HotelCard = () => {
    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      age: "",
      phone: "",
      country: "",
      city: "",
      address: "",
      password: "",
      role_ID: 2,
    });
    const [selectedCountry, setSelectedCountry] = useState("");
    const [cities, setCities] = useState([]);
    const [error, setError] = useState("");
    const passRef = useRef();
    const confPassRef = useRef();

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };

    const HotelCountryChange = (event) => {
      const countryIsoCode = event.target.value;
      setSelectedCountry(countryIsoCode);

      // Fetch cities for the selected country
      if (countryIsoCode) {
        const countryCities = City.getCitiesOfCountry(countryIsoCode);
        setCities(countryCities);
      } else {
        setCities([]); // Reset cities if no country is selected
      }
      setFormData({
        ...formData,
        country: Country.getCountryByCode(countryIsoCode)?.name || "",
        city: "",
      });
    };

    const HotelCityChange = (event) => {
      const selectedCityName = event.target.value;
      setFormData({ ...formData, city: selectedCityName });
    };

    const handleHotelDataSubmit = (e) => {
      e.preventDefault();

      if (passRef.current.value !== confPassRef.current.value) {
        setError("Passwords do not match!");
        return;
      }
      if (formData.age < 18 || formData.age > 150) {
        setError("Invalid age!");
        return;
      }
      if (formData.country === "") {
        setError("Select a valid country!");
        return;
      }
      if (formData.city === "") {
        setError("Select a valid city!");
        return;
      }
      setError("");

      formData.password = passRef.current.value;
      console.log(formData);
      insertHotel(formData);
      localStorage.setItem("loggedIn", true);
      localStorage.setItem("email", formData.email);
      navigate("/HotelDashboard");
    };

    const insertHotel = async (data) => {
      fetch("http://localhost:8008/Tourism/insertUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

    return (
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
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Age(18-150)"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="form-input"
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
              name="city"
              value={formData.city}
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
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              ref={passRef}
              className="form-input"
              required
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
  };
  const AirlineCard = () => {
    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      age: "",
      phone: "",
      country: "",
      city: "",
      address: "",
      password: "",
      role_ID: 3,
    });
    const [selectedCountry, setSelectedCountry] = useState("");
    const [cities, setCities] = useState([]);
    const [error, setError] = useState("");
    const passRef = useRef();
    const confPassRef = useRef();

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };

    const AirlineCountryChange = (event) => {
      const countryIsoCode = event.target.value;
      setSelectedCountry(countryIsoCode);

      // Fetch cities for the selected country
      if (countryIsoCode) {
        const countryCities = City.getCitiesOfCountry(countryIsoCode);
        setCities(countryCities);
      } else {
        setCities([]); // Reset cities if no country is selected
      }
      setFormData({
        ...formData,
        country: Country.getCountryByCode(countryIsoCode)?.name || "",
        city: "",
      });
    };

    const AirlineCityChange = (event) => {
      const selectedCityName = event.target.value;
      setFormData({ ...formData, city: selectedCityName });
    };

    const handleAirlineDataSubmit = (e) => {
      e.preventDefault();

      if (passRef.current.value !== confPassRef.current.value) {
        setError("Passwords do not match!");
        return;
      }
      if (formData.age < 18 || formData.age > 150) {
        setError("Invalid age!");
        return;
      }
      if (formData.country === "") {
        setError("Select a valid country!");
        return;
      }
      if (formData.city === "") {
        setError("Select a valid city!");
        return;
      }
      setError("");

      formData.password = passRef.current.value;
      console.log(formData);
      insertAirline(formData);
      localStorage.setItem("loggedIn", true);
      localStorage.setItem("email", formData.email);
      navigate("/AirlineDashboard");
    };

    const insertAirline = async (data) => {
      fetch("http://localhost:8008/Tourism/insertUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

    return (
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
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Age(18-150)"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="form-input"
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
              name="city"
              value={formData.city}
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
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              ref={passRef}
              className="form-input"
              required
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
  };
  const GuideCard = () => {
    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      age: "",
      phone: "",
      country: "",
      city: "",
      address: "",
      password: "",
      role_ID: 4,
    });
    const [selectedCountry, setSelectedCountry] = useState("");
    const [cities, setCities] = useState([]);
    const [error, setError] = useState("");
    const passRef = useRef();
    const confPassRef = useRef();

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };

    const GuideCountryChange = (event) => {
      const countryIsoCode = event.target.value;
      setSelectedCountry(countryIsoCode);

      // Fetch cities for the selected country
      if (countryIsoCode) {
        const countryCities = City.getCitiesOfCountry(countryIsoCode);
        setCities(countryCities);
      } else {
        setCities([]); // Reset cities if no country is selected
      }
      setFormData({
        ...formData,
        country: Country.getCountryByCode(countryIsoCode)?.name || "",
        city: "",
      });
    };

    const GuideCityChange = (event) => {
      const selectedCityName = event.target.value;
      setFormData({ ...formData, city: selectedCityName });
    };

    const handleGuideDataSubmit = (e) => {
      e.preventDefault();

      if (passRef.current.value !== confPassRef.current.value) {
        setError("Passwords do not match!");
        return;
      }
      if (formData.age < 18 || formData.age > 150) {
        setError("Invalid age!");
        return;
      }
      if (formData.country === "") {
        setError("Select a valid country!");
        return;
      }
      if (formData.city === "") {
        setError("Select a valid city!");
        return;
      }
      setError("");

      formData.password = passRef.current.value;
      console.log(formData);
      insertGuide(formData);
      localStorage.setItem("loggedIn", true);
      localStorage.setItem("email", formData.email);
      navigate("/GuideDashboard");
    };

    const insertGuide = async (data) => {
      fetch("http://localhost:8008/Tourism/insertUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

    return (
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
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="number"
              placeholder="Age(18-150)"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="form-input"
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
              name="city"
              value={formData.city}
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
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              ref={passRef}
              className="form-input"
              required
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
  };
  const cardComponents = {
    TouristCard: TouristCard,
    HotelCard: HotelCard,
    AirlineCard: AirlineCard,
    GuideCard: GuideCard,
  };

  const renderCardContent = () => {
    const CardComponent = cardComponents[activeCard];
    return CardComponent ? (
      <Suspense fallback={<div>Loading...</div>}>
        <CardComponent />
      </Suspense>
    ) : null;
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
