import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./home.css";

function Home() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [activeCard, setActiveCard] = useState(false);
  const [roleID, setRoleID] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Check and set loggedIn status from localStorage
    const status = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(status);
    if (status) {
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
            setRoleID(data.data[0].role_ID);
          } else {
            console.log("Data not retreived!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const toggleCard = () => {
    setActiveCard(!activeCard);
  };

  const closeCard = () => {
    setActiveCard(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const logOut = () => {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("first_name");
    window.location.reload(); // Refresh the page
  };

  const Dashboard = () => {
    if (roleID === 1) {
      navigate("/TouristDashboard");
    }
    if (roleID === 2) {
      navigate("/HotelDashboard");
    }
    if (roleID === 3) {
      navigate("/AirlineDashboard");
    }
    if (roleID === 4) {
      navigate("/GuideDashboard");
    }
    if (roleID === 5) {
      navigate("/AdminDashboard");
    }
    if (roleID === 6) {
      navigate("/RentalDashboard");
    }
  };
  const handleBrowseHotel = () => {
    if (loggedIn) {
      if (roleID === 1) {
        localStorage.setItem("activeCard", "TravelPackages");
        navigate("/TouristDashboard");
      } else if (roleID === 2) {
        navigate("/HotelDashboard");
      }
    } else {
      navigate("/signin");
    }
  };
  const handleFindFlight = () => {
    if (loggedIn) {
      if (roleID === 1) {
        localStorage.setItem("activeCard", "TravelPackages");
        navigate("/TouristDashboard");
      } else if (roleID === 3) {
        navigate("/AirlineDashboard");
      }
    } else {
      navigate("/signin");
    }
  };
  const handleMeetGuides = () => {
    if (loggedIn) {
      if (roleID === 1) {
        localStorage.setItem("activeCard", "TravelPackages");
        navigate("/TouristDashboard");
      } else if (roleID === 4) {
        navigate("/GuideDashboard");
      }
    } else {
      navigate("/signin");
    }
  };
  const HandleRentCar = () => {
    if (loggedIn) {
      if (roleID === 1) {
        localStorage.setItem("activeCard", "TravelPackages");
        navigate("/TouristDashboard");
      } else if (roleID === 6) {
        navigate("/RentalDashboard");
      }
    } else {
      navigate("/signin");
    }
  };
  return (
    <div className="app-container-H">
      {/* Header section */}
      <header className="header-H">
        <div className="logo-container-H">
          <h1 className="logo-H">TourEase</h1>
          <p className="logo-tagline-H">Your journey, our expertise</p>
        </div>

        <div className="navbar-H">
          <nav className="desktop-nav-H">
            <ul className="nav-links-H">
              <li>
                <a href="#services" className="nav-link-H">
                  Services
                </a>
              </li>

              <li>
                <a href="#about" className="nav-link-H">
                  About Us
                </a>
              </li>
            </ul>
          </nav>

          <div className="auth-buttons-H">
            {loggedIn ? (
              <div className="user-menu-container-H">
                <button onClick={toggleCard} className="user-button-H">
                  <span className="user-icon-H">👤</span>
                  <span className="user-name-H">{firstName}</span>
                </button>
                {activeCard && (
                  <div className="dropdown-card-H">
                    <button onClick={closeCard} className="close-card-H">
                      &times;
                    </button>
                    <button onClick={Dashboard} className="dashboard-button-H">
                      Dashboard
                    </button>
                    <button onClick={logOut} className="logout-button-H">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-container-H">
                <button onClick={handleSignIn} className="signin-button-H">
                  Sign In
                </button>
                <button onClick={handleSignUp} className="signup-button-H">
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu-button-H" onClick={toggleMobileMenu}>
            <div className={`hamburger-H ${showMobileMenu ? "active-H" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`mobile-menu-H ${
            showMobileMenu ? "show-mobile-menu-H" : ""
          }`}
        >
          <ul className="mobile-nav-links-H">
            <li>
              <a href="#services" onClick={() => setShowMobileMenu(false)}>
                Services
              </a>
            </li>

            <li>
              <a href="#about" onClick={() => setShowMobileMenu(false)}>
                About Us
              </a>
            </li>
            {!loggedIn && (
              <>
                <li>
                  <button onClick={handleSignIn} className="mobile-signin-H">
                    Sign In
                  </button>
                </li>
                <li>
                  <button onClick={handleSignUp} className="mobile-signup-H">
                    Sign Up
                  </button>
                </li>
              </>
            )}
            {loggedIn && (
              <>
                <li>
                  <button onClick={Dashboard} className="mobile-dashboard-H">
                    Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={logOut} className="mobile-logout-H">
                    Log Out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>

      {/* Hero section */}
      <section className="hero-section-H">
        <div className="hero-content-H">
          <h1 className="hero-title-H">Explore the World with TourEase</h1>
          <p className="hero-subtitle-H">
            Your all-in-one travel companion for seamless adventures
          </p>
          <div className="hero-buttons-H">
            <button
              className="primary-button-H"
              onClick={() => {
                if (!loggedIn) {
                  navigate("/signin");
                } else {
                  Dashboard();
                }
              }}
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section id="services" className="services-section-H">
        <div className="section-header-H">
          <h2 className="section-title-H">Our Services</h2>
          <p className="section-subtitle-H">
            Everything you need for an unforgettable journey
          </p>
        </div>

        <div className="services-grid-H">
          <div className="service-card-H">
            <div className="service-icon-H hotel-icon-H">🏨</div>
            <h3 className="service-title-H">Hotels & Accommodations</h3>
            <p className="service-description-H">
              Find the perfect stay from luxury hotels to cozy homestays, all
              vetted for quality and comfort.
            </p>
            <button
              className="service-button-H"
              onClick={() => {
                handleBrowseHotel();
              }}
            >
              Browse Hotels
            </button>
          </div>

          <div className="service-card-H">
            <div className="service-icon-H flight-icon-H">✈️</div>
            <h3 className="service-title-H">Flight Bookings</h3>
            <p className="service-description-H">
              Compare and book flights from top airlines worldwide at the best
              prices available.
            </p>
            <button
              className="service-button-H"
              onClick={() => {
                handleFindFlight();
              }}
            >
              Find Flights
            </button>
          </div>

          <div className="service-card-H">
            <div className="service-icon-H car-icon-H">🚗</div>
            <h3 className="service-title-H">Car Rentals</h3>
            <p className="service-description-H">
              Choose from a wide range of vehicles for convenient travel at your
              destination.
            </p>
            <button
              className="service-button-H"
              onClick={() => {
                HandleRentCar();
              }}
            >
              Rent a Car
            </button>
          </div>

          <div className="service-card-H">
            <div className="service-icon-H guide-icon-H">🧭</div>
            <h3 className="service-title-H">Tour Guides</h3>
            <p className="service-description-H">
              Connect with experienced local guides for authentic and enriching
              travel experiences.
            </p>
            <button
              className="service-button-H"
              onClick={() => {
                handleMeetGuides();
              }}
            >
              Meet Guides
            </button>
          </div>
        </div>
      </section>

      <section id="about" className="about-section-H">
        <div className="about-content-H">
          <div className="about-text-H">
            <h2 className="about-title-H">About TourEase</h2>
            <p className="about-description-H">
              TourEase is your comprehensive travel companion, bringing together
              hotels, airlines, car rentals, and local guides in one seamless
              platform. Our mission is to make travel planning effortless so you
              can focus on creating memories.
            </p>
            <p className="about-description-H">
              With thousands of trusted partners worldwide, we ensure quality
              experiences at competitive prices, while our dedicated customer
              support team is available 24/7 to assist with any travel needs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
