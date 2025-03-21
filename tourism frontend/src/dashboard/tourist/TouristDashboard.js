import { useNavigate } from "react-router-dom";
import "./TouristDashboard.css";
import { useState, useEffect, Suspense, useRef } from "react";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import FeedbackIcon from "@mui/icons-material/Feedback";
import Aurora from "../../components/Aurora";
import Stepper, { Step } from "../../components/Stepper";
import { Country, City } from "country-state-city";
import PublicIcon from "@mui/icons-material/Public";
import HistoryIcon from "@mui/icons-material/History";
import { DateTime } from "luxon";
import PaymentIcon from "@mui/icons-material/Payment";
import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import {
  ChevronRight,
  ChevronLeft,
  LockIcon,
  LockOpenIcon,
  Plane,
} from "lucide-react";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { StarOutline } from "@mui/icons-material";
import moment from "moment";

function TouristDashboard() {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(() => {
    const storedCard = localStorage.getItem("activeCard");
    if (storedCard && storedCard !== "Home") {
      return storedCard;
    }
    return "Home";
  });
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    if (activeCard === "Feedback") {
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
  }, []);
  useEffect(() => {
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const mainContainer = document.querySelector(".main-container-TD");
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
      <div className="details-container-TD">
        <h2 className="heading-TD">
          <strong>Details</strong>
        </h2>
        <p className="data-TD">
          <strong>First Name: {AccountData.first_name}</strong>
        </p>
        <p className="data-TD">
          <strong>Last Name: {AccountData.last_name}</strong>
        </p>
        <p className="data-TD">
          <strong>Email: {AccountData.email}</strong>
        </p>
        <p className="data-TD">
          <strong>Age: {AccountData.age}</strong>
        </p>
        <p className="data-TD">
          <strong>Phone: {AccountData.phone}</strong>
        </p>
        <p className="data-TD">
          <strong>Country: {AccountData.country}</strong>
        </p>
        <p className="data-TD">
          <strong>City: {AccountData.city}</strong>
        </p>
        <p className="data-TD">
          <strong>Address: {AccountData.address}</strong>
        </p>
        <p className="data-TD">
          <strong>Password: {"*".repeat(AccountData.password.length)}</strong>
        </p>
      </div>
    );
  };
  const Packages = () => {
    return (
      <div className="Tourist-content-TD">
        <h2 className="heading-TD">
          <strong>Your Packages</strong>
        </h2>
      </div>
    );
  };

  const [stepperDisplay, setStepperDisplay] = useState(false);
  // const PackageStepper = () => {
  //   const [name, setName] = useState("");
  //   return (
  //     <div className="stepper-div-TD">
  //       <Stepper
  //         sx={{ width: "100%" }}
  //         initialStep={1}
  //         onStepChange={(step) => {
  //           console.log(step);
  //         }}
  //         onFinalStepCompleted={() => console.log("All steps completed!")}
  //         backButtonText={<ChevronLeft />}
  //         nextButtonText={<ChevronRight />}
  //       >
  //         <Step>
  //           <h2>Welcome to the React Bits stepper!</h2>
  //           <p>Check out the next step!</p>
  //         </Step>
  //         <Step>
  //           <h2>Step 2</h2>

  //           <p>Custom step content!</p>
  //         </Step>
  //         <Step>
  //           <h2>How about an input?</h2>
  //           <input
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             placeholder="Your name?"
  //             required
  //           />
  //         </Step>
  //         <Step>
  //           <h2>Final Step 4</h2>
  //           <p>You made it!</p>
  //         </Step>
  //         <Step>
  //           <h2>Final Step 5 {name}</h2>
  //           <p>You made it!</p>
  //         </Step>
  //         <Step>
  //           <h2>Final Step</h2>
  //           <p>You made it!</p>
  //         </Step>
  //       </Stepper>
  //     </div>
  //   );
  // };
  const handleOpenPackageStepper = () => {
    setStepperDisplay(true);
  };

  const handleClosePackageStepper = () => {
    setStepperDisplay(false);
  };

  const PackageStepper = ({ open, onClose }) => {
    const [selectedPackageCity, setSelectedPackageCity] = useState([
      "Karachi",
      "Quetta",
    ]);
    // const [selectedPackageCity, setSelectedPackageCity] = useState([]);
    const [selectedPackageCountry, setSelectedPackageCountry] = useState("");
    // const [selectedPackageCountryName, setSelectedPackageCountryName] =
    //   useState("");
    const [selectedPackageCountryName, setSelectedPackageCountryName] =
      useState("Pakistan");
    const [Packagecities, setPackageCities] = useState([]);
    const [selectedCurrentCity, setSelectedCurrentCity] = useState("Lahore");
    // const [selectedCurrentCity, setSelectedCurrentCity] = useState("");
    const [selectedCurrentCountry, setSelectedCurrentCountry] =
      useState("Pakistan");
    // const [selectedCurrentCountry, setSelectedCurrentCountry] = useState("");
    const [selectedCurrentCountryName, setSelectedCurrentCountryName] =
      useState("Pakistan");
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [flightDate, setFlightDate] = useState(null);
    const [flightDate, setFlightDate] = useState("2025-07-07");
    // const [touristQuantity, setTouristQuantity] = useState(null);
    const [touristQuantity, setTouristQuantity] = useState(4);
    // const [selectedFlightID, setSelectedFlightID] = useState(null);
    const [selectedFlightID, setSelectedFlightID] = useState(1);
    // const [flightSelected, setFlightSelected] = useState(false);
    const [flightSelected, setFlightSelected] = useState(true);
    // const [selectedReturnFlightID, setSelectedReturnFlightID] = useState(null);
    // const [returnFlightSelected, setReturnFlightSelected] = useState(false);
    const [selectedReturnFlightID, setSelectedReturnFlightID] = useState(4);
    const [returnFlightSelected, setReturnFlightSelected] = useState(true);
    const [flightData, setFlightData] = useState({});
    const [returnFlightData, setReturnFlightData] = useState({});
    const [openSummary, setOpenSummary] = useState();
    const [openSummary2, setOpenSummary2] = useState();
    const [openSummary3, setOpenSummary3] = useState();
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const handleCountryChange = (event) => {
      event.preventDefault();
      if (event.target.value === "") {
        return;
      }
      const countryIsoCode = event.target.value;
      setSelectedPackageCountry(countryIsoCode);
      setSelectedPackageCountryName(
        Country.getCountryByCode(countryIsoCode).name
      );
      setSelectedPackageCity(""); // Reset city when the country changes

      // Fetch cities for the selected country
      if (countryIsoCode) {
        const countryCitiesObject = City.getCitiesOfCountry(countryIsoCode);
        const cityNamesArray = Object.values(countryCitiesObject);
        if (cityNamesArray.length === 0) {
          setNoPackageCity(true);
          setSelectedPackageCity(selectedPackageCountryName);
          console.log(selectedPackageCity);
        } else {
          setNoPackageCity(false);
          console.log("yes package cities");
        }
        setPackageCities(cityNamesArray); // Set the city *data*
        setSelectedPackageCity([]); // Reset selection when country changes
        setLoading(false); // Set loading to false *after* data is fetched
      } else {
        setPackageCities([]);
        setSelectedPackageCity([]);
        setLoading(false); // Also set loading to false if no country is chosen
      }

      console.log(selectedPackageCity);
    };

    // Handle city selection
    const handleCityChange = (event) => {
      event.preventDefault();
      setSelectedPackageCity(event.target.value || []); // Correctly handle multiple selections
    };
    const handleCurrentCountryChange = (event) => {
      event.preventDefault();
      if (event.target.value === "") {
        return;
      }
      const countryIsoCode = event.target.value;
      setSelectedCurrentCountry(countryIsoCode);
      setSelectedCurrentCountryName(
        Country.getCountryByCode(countryIsoCode).name
      );
      setSelectedCurrentCity(""); // Reset city when the country changes

      // Fetch cities for the selected country
      if (countryIsoCode) {
        const countryCities = City.getCitiesOfCountry(countryIsoCode);
        if (countryCities.length === 0) {
          setNoCurrentCity(true);
          setSelectedCurrentCity(selectedCurrentCountryName);
          console.log(selectedCurrentCity);
        } else {
          setNoCurrentCity(false);
          console.log("yes current cities");
        }
        setCities(countryCities);
      } else {
        setSelectedCurrentCity("");
      }

      console.log(selectedPackageCity);
    };

    // Handle city selection
    const handleCurrentCityChange = (event) => {
      event.preventDefault();
      setSelectedCurrentCity(event.target.value || []); // Correctly handle multiple selections
    };
    const [noPackageCity, setNoPackageCity] = useState(false);
    const [noCurrentCity, setNoCurrentCity] = useState(false);
    const [hotelData, setHotelData] = useState({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      rating: "",
      address: "",
      city: "",
    });
    const [guideData, setGuideData] = useState({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      rating: "",
      address: "",
      city: "",
      price_per_day: "",
    });
    const [rentalData, setRentalData] = useState({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      rating: "",
      address: "",
      city: "",
      capacity: "",
      description: "",
      plate: "",
      price_per_day: "",
    });

    const getHotels = (city_param) => {
      fetch("http://localhost:8008/Tourism/getHotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: city_param,
          country: selectedPackageCountryName,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.data);
            setHotelData(data.data);
          } else {
            console.log("Data not retreived!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getFlights = (date, quantity) => {
      console.log("date:", date);
      fetch("http://localhost:8008/Tourism/getFlights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date,
          departure_country: selectedCurrentCountryName,
          departure_city: selectedCurrentCity,
          arrival_country: selectedPackageCountryName,
          arrival_city: selectedPackageCity[0],
          quantity: quantity,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.data);
            setFlightData(data.data);
          } else {
            console.log("Data not retreived!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getReturnFlights = (date, quantity) => {
      console.log("date:", date);
      fetch("http://localhost:8008/Tourism/getFlights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: date,
          departure_country: selectedPackageCountryName,
          departure_city: selectedPackageCity[selectedPackageCity.length - 1],
          arrival_country: selectedCurrentCountryName,
          arrival_city: selectedCurrentCity,
          quantity: quantity,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.data);
            setReturnFlightData(data.data);
          } else {
            console.log("Data not retreived!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    function isDateBeforeOtherDate(date1, date2) {
      // Create Date objects for the given dates
      const givenDate1 = new Date(date1);
      const givenDate2 = new Date(date2);

      // Set the time components to 00:00:00 for accurate comparison
      givenDate1.setHours(0, 0, 0, 0);
      givenDate2.setHours(0, 0, 0, 0);

      // Compare the dates
      return givenDate1 < givenDate2;
    }
    function getDaysBetweenDates(date1, date2) {
      // Create Date objects from the input strings
      const d1 = new Date(date1);
      const d2 = new Date(date2);

      // Calculate the difference in milliseconds
      const diffInMs = Math.abs(d2 - d1);

      // Convert milliseconds to days
      const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

      return diffInDays;
    }
    // const [flightReturnDate, setFlightReturnDate] = useState(null);
    const [flightReturnDate, setFlightReturnDate] = useState("2025-07-10");
    const [daysStay, setDaysStay] = useState({});
    const [error3, setError3] = useState("");
    const addStayDays = (e, hotel) => {
      if (flightReturnDate && selectedReturnFlightID) {
        const startDate = new Date(flightDate);
        const endDate = new Date(flightReturnDate);

        const timeDifference = endDate.getTime() - startDate.getTime();
        const days = Math.round(timeDifference / (1000 * 60 * 60 * 24));

        let daysDone = 0;
        let citiesDone = 1;
        for (const city in daysStay) {
          // Ensure we're only processing the object's own properties
          const days = daysStay[city].days;

          // Check if days is a valid number before adding it
          if (!isNaN(Number(days)) && city !== hotel.city && days !== 0) {
            daysDone += Number(days);
            citiesDone += 1;
          }
        }

        if (
          e.target.value < 1 ||
          days - e.target.value - daysDone <
            selectedPackageCity.length - citiesDone
        ) {
          setError3("invalid number of days");
          return;
        }
      }
      setError3("");
      setDaysStay((prevState) => ({
        ...prevState,
        [hotel.city]: {
          ...prevState[hotel.city],
          email: hotel.email,
          days: e.target.value,
          room_packages: null,
        },
      }));
      let intervalDays = 0;
      for (const city in daysStay) {
        if (city === hotel.city) {
          break;
        }
        intervalDays += daysStay[city].days;
      }
      intervalDays = parseInt(intervalDays, 10);
      const date2 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const start_date = date2.format("YYYY-MM-DD");

      intervalDays += Number(e.target.value);
      const date3 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const end_date = date3.format("YYYY-MM-DD");

      getRoomData(daysStay[hotel.city].email, start_date, end_date);
    };
    const RoomDataAPICall = (hotel) => {
      let intervalDays = 0;
      for (const city in daysStay) {
        if (city === hotel.city) {
          break;
        }
        intervalDays += daysStay[city].days;
      }
      intervalDays = parseInt(intervalDays, 10);
      const date2 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const start_date = date2.format("YYYY-MM-DD");

      intervalDays += Number(daysStay[hotel.city].days);
      const date3 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const end_date = date3.format("YYYY-MM-DD");

      getRoomData(daysStay[hotel.city].email, start_date, end_date);
    };
    const GuideDataAPICall = (param_city) => {
      let intervalDays = 0;
      for (const city in daysStay) {
        if (city === param_city) {
          break;
        }
        intervalDays += daysStay[city].days;
      }
      intervalDays = parseInt(intervalDays, 10);
      const date2 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const start_date = date2.format("YYYY-MM-DD");

      intervalDays += Number(daysStay[param_city].days);
      const date3 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const end_date = date3.format("YYYY-MM-DD");

      getGuideData(param_city, start_date, end_date);
    };
    const [roomData, setRoomData] = useState(null);
    const getGuideData = (city, start_date, end_date) => {
      fetch("http://localhost:8008/Tourism/getGuides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: city,
          start_date: start_date,
          end_date: end_date,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.data);
            setGuideData(data.data);
          } else {
            console.log("Data not retreived!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getRentalData = (city, start_date, end_date) => {
      fetch("http://localhost:8008/Tourism/getRentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: city,
          start_date: start_date,
          end_date: end_date,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.data);
            setRentalData(data.data);
          } else {
            console.log("Data not retreived!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const RentalDataAPICall = (param_city) => {
      let intervalDays = 0;
      for (const city in daysStay) {
        if (city === param_city) {
          break;
        }
        intervalDays += daysStay[city].days;
      }
      intervalDays = parseInt(intervalDays, 10);
      const date2 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const start_date = date2.format("YYYY-MM-DD");

      intervalDays += Number(daysStay[param_city].days);
      const date3 = moment(flightDate, "YYYY-MM-DD").add(intervalDays, "days");
      const end_date = date3.format("YYYY-MM-DD");

      getRentalData(param_city, start_date, end_date);
    };
    const getRoomData = (email, start_date, end_date) => {
      fetch("http://localhost:8008/Tourism/getPackageRoomData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          start_date: start_date,
          end_date: end_date,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            console.log(data.data);
            setRoomData(data.data);
          } else {
            console.log("Data not retreived!", data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const handleAddRoomPackage = (room_id, price, city) => {
      setDaysStay((prevState) => {
        const cityData = prevState[city];
        if (!cityData) return prevState;

        const roomPrices = cityData.room_packages || {}; // Use room_prices

        if (roomPrices[room_id]) {
          // Remove room_id
          const newRoomPrices = { ...roomPrices };
          delete newRoomPrices[room_id];
          return {
            ...prevState,
            [city]: {
              ...cityData,
              room_packages: newRoomPrices,
            },
          };
        } else {
          // Add room_id and price
          return {
            ...prevState,
            [city]: {
              ...cityData,
              room_packages: { ...roomPrices, [room_id]: price },
            },
          };
        }
      });
    };
    const [hotelPrice, setHotelPrice] = useState(0);
    const [guidePrice, setGuidePrice] = useState(0);
    const [rentalPrice, setRentalPrice] = useState(0);
    const totalHotelPrice = Object.values(daysStay).reduce(
      (totalSum, cityData) => {
        if (cityData.room_packages && cityData.days) {
          const cityTotal = Object.values(cityData.room_packages).reduce(
            (roomSum, price) => roomSum + price,
            0
          );
          return totalSum + cityTotal * cityData.days;
        }
        return totalSum;
      },
      0
    );
    useEffect(() => {
      setHotelPrice(totalHotelPrice);
    }, [totalHotelPrice]);
    const totalGuidePrice = Object.values(daysStay).reduce(
      (totalSum, cityData) => {
        if (cityData.guide_price && cityData.days) {
          return totalSum + cityData.guide_price * cityData.days;
        }

        return totalSum;
      },
      0
    );
    useEffect(() => {
      setGuidePrice(totalGuidePrice);
    }, [totalGuidePrice]);
    const totalRentalPrice = Object.values(daysStay).reduce(
      (totalSum, cityData) => {
        if (cityData.rental_price && cityData.days) {
          return totalSum + cityData.rental_price * cityData.days;
        }

        return totalSum;
      },
      0
    );
    useEffect(() => {
      setRentalPrice(totalRentalPrice);
    }, [totalRentalPrice]);
    useEffect(() => {
      setFormData({
        amount: Math.floor((hotelPrice + guidePrice + rentalPrice) * 0.9),
      });
    }, [guidePrice, hotelPrice, rentalPrice]);
    const [formData, setFormData] = useState({
      card: "",
      expiry: "",
      cvv: "",
      amount: "",
    });

    // Error state
    const [errors, setErrors] = useState({});

    // Handle input changes
    // Handle input changes
    const handleChange = (e) => {
      const { id, value } = e.target;

      let formattedValue = value;

      // Format card number with spaces every 4 digits
      if (id === "card") {
        // First, filter out non-numeric characters from the input
        const numericValue = value.replace(/[^\d]/g, "");

        // Then format with spaces every 4 digits
        formattedValue = numericValue.replace(/(.{4})/g, "$1 ").trim();

        // Limit to 19 characters (16 digits + 3 spaces)
        formattedValue = formattedValue.substring(0, 19);
      }

      // Format expiry as MM/YY
      if (id === "expiry") {
        formattedValue = value.replace(/\D/g, "");
        if (formattedValue.length > 2) {
          formattedValue =
            formattedValue.substring(0, 2) +
            "/" +
            formattedValue.substring(2, 4);
        }
        // Limit to 5 characters (MM/YY)
        formattedValue = formattedValue.substring(0, 5);
      }

      // Format CVV as numbers only, max 3-4 digits
      if (id === "cvv") {
        formattedValue = value.replace(/\D/g, "").substring(0, 4);
      }

      // Format amount as currency
      if (id === "amount") {
        // Remove non-numeric characters except decimal point
        formattedValue = value.replace(/[^\d.]/g, "");

        // Ensure only one decimal point
        const parts = formattedValue.split(".");
        if (parts.length > 2) {
          formattedValue = parts[0] + "." + parts.slice(1).join("");
        }

        // Limit to two decimal places
        if (parts.length > 1) {
          formattedValue = parts[0] + "." + parts[1].substring(0, 2);
        }

        // Add dollar sign if there's a value
        if (formattedValue) {
          formattedValue = "$" + formattedValue.replace(/^\$/, "");
        }
      }

      setFormData({
        ...formData,
        [id]: formattedValue,
      });
    };
    // Validate form
    const validateForm = () => {
      const newErrors = {};

      // Validate card number (simple check for length)
      if (formData.card.replace(/\s/g, "").length !== 16) {
        newErrors.card = "Card number must be 16 digits";
      }

      // Validate expiry (check format and if not expired)
      if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        newErrors.expiry = "Expiry must be in MM/YY format";
      } else {
        const [month, year] = formData.expiry.split("/");
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        if (expiryDate < new Date()) {
          newErrors.expiry = "Card has expired";
        }
      }

      // Validate CVV (3-4 digits)
      if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "CVV must be 3-4 digits";
      }

      // Validate amount (must be a number greater than 0)

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const [formState, setFormState] = useState('visible');
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (validateForm()) {
        // Process payment here
        console.log('Processing payment:', formData);
        
        // Start the shrinking animation
        setFormState('shrinking');
        
        // After animation completes, fully hide the form
        setTimeout(() => {
          setFormState('hidden');
          // Show success message
          setShowSuccessMessage(true);
        }, 600); // Slightly longer than the animation duration
      }
    };
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    return (
      <div>
        <Dialog open={open} onClose={onClose} className="dialog-container-TD">
          <DialogContent className="dialog-content-TD">
            <Stepper
              initialStep={1}
              onStepChange={(step) => {
                console.log(step);
                
              }}
              onFinalStepCompleted={() => console.log("All steps completed!")}
              backButtonText={<ChevronLeft />}
              nextButtonText={<ChevronRight />}
              validateStep={async (step) => {
                // if (step === 1) {
                //   if (selectedCurrentCountryName === "") {
                //     return "Select Country!";
                //   }
                //   if (selectedCurrentCity.length <= 0 && !noCurrentCity) {
                //     return "Select City!";
                //   }
                // }
                // if (step === 2) {
                //   if (selectedPackageCountryName === "") {
                //     return "Enter Country!";
                //   }
                //   if (selectedPackageCity.length <= 0 && !noPackageCity) {
                //     return "Select at least 1 City!";
                //   }
                // }
                // if (step === 3) {
                // if(touristQuantity<=0){
                //   return "Quantity can not be less than 0";
                // }
                //   if (!flightDate) {
                //     return "Select a Date!";
                //   }
                //   if (!selectedFlightID) {
                //
                //     return "Select a flight!";
                //   }
                // }
                if (step === 4) {
                  const initialDaysStay = {};

                  selectedPackageCity.forEach((city) => {
                    initialDaysStay[city] = {
                      days: 0,
                      email: "",
                      first_name: "",
                      last_name: "",
                      room_packages: null,
                    };
                  });
                  setDaysStay(initialDaysStay);
                }
                //   if (touristQuantity <= 0) {
                //     return "Quantity can not be less than 0";
                //   }

                //   if (!selectedReturnFlightID) {
                //     if (
                //       window.confirm(
                //         "You have not selected a return flight,continue?"
                //       )
                //     ) {
                //       return true;
                //     }
                //     return "Select a flight!";
                //   }
                // }
                if (step === 5) {
                  setDaysStay((prevData) => {
                    const newData = {}; // Create a new object

                    for (const city in prevData) {
                      newData[city] = {
                        ...prevData[city], // Copy existing city data
                        guide_email: "", // Add guide_id to each city
                        guide_first_name: "",
                        guide_last_name: "",
                        guide_price: 0,
                      };
                    }

                    return newData;
                  });
                }
                //   if (flightReturnDate && selectedReturnFlightID) {
                //     const startDate = new Date(flightDate);
                //     const endDate = new Date(flightReturnDate);

                //     const timeDifference =
                //       endDate.getTime() - startDate.getTime();
                //     const days = Math.round(
                //       timeDifference / (1000 * 60 * 60 * 24)
                //     );

                //     let intervalDays = 0;
                //     for (const city in daysStay) {
                //       intervalDays += parseInt(daysStay[city].days, 10);
                //     }

                //     intervalDays = parseInt(intervalDays, 10);
                //     console.log("days:", days);
                //     console.log("interval days:", intervalDays);
                //     if (days !== intervalDays) {
                //       return "Invalid! Total Package Days do not match with total days selected at hotels";
                //     }
                //   }
                //   for (const city in daysStay) {
                //     if (daysStay[city].email === "") {
                //       return `Hotel not selected in city: ${city}`;
                //     }
                //   }
                //   for (const city in daysStay) {
                //     if (daysStay[city].days === 0) {
                //       return `Inavlid days(0) in city: ${city}`;
                //     }
                //   }
                //   for (const city in daysStay) {
                //     if (daysStay[city].room_id) {
                //       return `No Rooms selected in city: ${city}`;
                //     }
                //   }
                // }
                if (step === 6) {
                  setDaysStay((prevData) => {
                    const newData = {}; // Create a new object

                    for (const city in prevData) {
                      newData[city] = {
                        ...prevData[city], // Copy existing city data
                        rental_email: "", // Add guide_id to each city
                        rental_first_name: "", // Add guide_id to each city
                        rental_last_name: "", // Add guide_id to each city
                        rental_price: 0,
                      };
                    }

                    return newData;
                  });
                }
                //   let no_guide_cities = [];
                //   for (const city in daysStay) {
                //     if (daysStay[city].guide_email === "") {
                //       no_guide_cities.push(city);
                //     }
                //   }
                //   if (
                //     !window.confirm(
                //       `You have not selected tour guides in these cities:(${no_guide_cities}) Continue(OK)?`
                //     )
                //   ) {
                //     return "";
                //   }
                // }let no_guide_cities = [];
                //   for (const city in daysStay) {
                //     if (daysStay[city].guide_email === "") {
                //       no_guide_cities.push(city);
                //     }
                //   }
                //   if (
                //     !window.confirm(
                //       `You have not selected tour guides in these cities:(${no_guide_cities}) Continue(OK)?`
                //     )
                //   ) {
                //     return "";
                //   }
                if (step === 7) {
                  console.log("days Stay:", daysStay);
                  //   let no_rental_cities = [];
                  //   for (const city in daysStay) {
                  //     if (daysStay[city].rental_email === "") {
                  //       no_rental_cities.push(city);
                  //     }
                  //   }
                  //   if (
                  //     !window.confirm(
                  //       `You have not selected car rentals in these cities:(${no_rental_cities}) Continue(OK)?`
                  //     )
                  //   ) {
                  //     return "";
                }
                // }
                return true;
              }}
            >
              <Step>
                <h2 className="step-heading-TD">
                  Select Current Country
                  <PublicIcon />
                </h2>
                <div className="step1-div-TD">
                  <FormControl>
                    <InputLabel id="country-label" sx={{ color: "white" }}>
                      Select Country
                    </InputLabel>
                    <Select
                      required
                      labelId="country-label"
                      id="country"
                      size="small"
                      className="seats-input3-TD"
                      value={selectedCurrentCountry}
                      label="Select Country"
                      fullWidth
                      onChange={handleCurrentCountryChange}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 4.5 + 8,
                          },
                        },
                      }}
                    >
                      {Country.getAllCountries().map((country) => (
                        <MenuItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <InputLabel id="city-label" sx={{ color: "white" }}>
                      Select City
                    </InputLabel>

                    <Select
                      required
                      labelId="city-label"
                      id="city"
                      className="seats-input3-TD"
                      disabled={!selectedCurrentCountry}
                      fullWidth
                      value={selectedCurrentCity}
                      label="Select City"
                      size="small"
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 4.5 + 8,
                            width: 250,
                          },
                        },
                      }}
                      onChange={handleCurrentCityChange}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.name} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </Step>
              <Step>
                <h2 className="step-heading-TD">
                  Select Country to visit <Plane />
                  {selectedCurrentCountryName}
                  {selectedCurrentCity}
                </h2>
                <div className="step1-div-TD">
                  <FormControl>
                    <InputLabel id="country-label" sx={{ color: "white" }}>
                      Select Country
                    </InputLabel>
                    <Select
                      required
                      labelId="country-label"
                      id="country"
                      size="small"
                      className="seats-input3-TD"
                      value={selectedPackageCountry}
                      label="Select Country"
                      fullWidth
                      onChange={handleCountryChange}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 4.5 + 8,
                          },
                        },
                      }}
                    >
                      {Country.getAllCountries().map((country) => (
                        <MenuItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {loading ? ( // Conditionally render the Select
                    <></>
                  ) : (
                    <FormControl>
                      <InputLabel id="city-label" sx={{ color: "white" }}>
                        Select City
                      </InputLabel>

                      <Select
                        required
                        labelId="city-label"
                        id="city"
                        multiple
                        className="seats-input3-TD"
                        disabled={!selectedPackageCountry}
                        fullWidth
                        value={selectedPackageCity}
                        label="Select City"
                        size="small"
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 48 * 4.5 + 8,
                              width: 250,
                            },
                          },
                        }}
                        onChange={handleCityChange}
                      >
                        {Packagecities.map((city) => (
                          <MenuItem key={city.name} value={city.name}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <p className="stepper-end-message-TD">
                    Select in the order you want to visit
                  </p>
                </div>
              </Step>
              <Step>
                <h2 className="step-heading-TD">
                  Select Departure Flight to {selectedCurrentCountryName}
                </h2>
                <div className="flight-data-stepper-input-div-TD">
                  <TextField
                    type="date"
                    className="seats-input3-TD"
                    value={flightDate}
                    onChange={(e) => {
                      if (isDateBeforeOtherDate(e.target.value, new Date())) {
                        window.alert("Date can not be in the past!");
                        return;
                      }
                      setFlightDate(e.target.value);
                      getFlights(e.target.value, touristQuantity);
                    }}
                    sx={{
                      backgroundColor: "transparent !important",
                      color: "cyan !important",
                      "& .MuiInputBase-input": {
                        backgroundColor: "transparent !important",
                        color: "cyan !important",
                      },
                      "& .MuiInputBase-root": {
                        backgroundColor: "transparent !important",
                        color: "cyan !important",
                      },
                      '& input[type="date"]::-webkit-calendar-picker-indicator':
                        {
                          filter:
                            "invert(50%) sepia(100%) saturate(500%) hue-rotate(170deg)", // Cyan color
                        },
                    }}
                  ></TextField>
                  <TextField
                    type="number"
                    className="seats-input3-TD"
                    value={touristQuantity}
                    placeholder="Number of persons"
                    onChange={(e) => {
                      setTouristQuantity(e.target.value);
                      getFlights(flightDate, e.target.value);
                    }}
                    sx={{
                      backgroundColor: "transparent !important",
                      color: "cyan !important",
                      "& .MuiInputBase-input": {
                        backgroundColor: "transparent !important",
                        color: "cyan !important",
                      },
                      "& .MuiInputBase-root": {
                        backgroundColor: "transparent !important",
                        color: "cyan !important",
                      },
                      '& input[type="date"]::-webkit-calendar-picker-indicator':
                        {
                          filter:
                            "invert(50%) sepia(100%) saturate(500%) hue-rotate(170deg)", // Cyan color
                        },
                    }}
                  ></TextField>
                </div>
                <div className="table-container-TD">
                  {flightData && flightData.length > 0 ? (
                    <div>
                      <table className="Tourist-table-TD">
                        <thead className="table-head2-TD">
                          <tr>
                            <th className="table-header-TD">Flight Name</th>
                            <th className="table-header-TD">Departure</th>
                            <th className="table-header-TD">Departure Time</th>
                            <th className="table-header-TD">Arrival</th>
                            <th className="table-header-TD">Arrival Time</th>
                            <th className="table-header-TD">Available Seats</th>
                            <th className="table-header-TD">Seat Type</th>
                            <th className="table-header-TD">Price($)</th>
                            <th className="table-header-TD">Airline Rating</th>
                            <th className="table-header-TD">Booking</th>
                          </tr>
                        </thead>
                        <tbody className="table-body-TD">
                          {flightData.map((flight) => {
                            const localDepartureDateTime = DateTime.fromISO(
                              flight.departure_date +
                                "T" +
                                flight.departure_time,
                              { zone: "UTC" }
                            ).setZone(userTimeZone);

                            // Format date/time for display
                            const formattedDepartureDateTime =
                              localDepartureDateTime.toLocaleString(
                                DateTime.DATETIME_MED
                              );
                            const localArrivalDateTime = DateTime.fromISO(
                              flight.arrival_date + "T" + flight.arrival_time,
                              { zone: "UTC" }
                            ).setZone(userTimeZone);

                            // Format date/time for display
                            const formattedArrivalDateTime =
                              localArrivalDateTime.toLocaleString(
                                DateTime.DATETIME_MED
                              );
                            return (
                              <tr
                                key={flight.flight_id}
                                className="table-row-TD"
                              >
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.flight_name}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.departure_city},
                                  {flight.departure_country}
                                </td>

                                <td className="table-cell-TD table-cell2-TD">
                                  {formattedDepartureDateTime}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.arrival_city},{flight.arrival_country}
                                </td>

                                <td className="table-cell-TD table-cell2-TD">
                                  {formattedArrivalDateTime}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.seats_available}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.seat_type}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.price}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.rating.toFixed(2)}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flightSelected ? (
                                    <>
                                      {selectedFlightID === flight.flight_id ? (
                                        <>
                                          <button
                                            className="edit-button-TD"
                                            onClick={() => {
                                              setSelectedFlightID(null);
                                              setFlightSelected(false);
                                            }}
                                          >
                                            Selected
                                          </button>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </>
                                  ) : (
                                    <button
                                      className="edit-button-TD"
                                      onClick={() => {
                                        setSelectedFlightID(flight.flight_id);
                                        setFlightSelected(true);
                                      }}
                                    >
                                      Select
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-data-message-TD">No Flights available.</p>
                  )}
                </div>
              </Step>
              <Step>
                <h2 className="step-heading-TD">
                  Select Return Flight to {selectedPackageCountryName}
                </h2>
                <div className="flight-data-stepper-input-div-TD">
                  <TextField
                    type="date"
                    className="seats-input3-TD"
                    value={flightReturnDate}
                    onChange={(e) => {
                      if (isDateBeforeOtherDate(e.target.value, flightDate)) {
                        window.alert("Date can not be in the past!");
                        return;
                      } else if (
                        getDaysBetweenDates(e.target.value, flightDate) <
                        selectedPackageCity.length
                      ) {
                        window.alert(
                          "spend at least 1 day in each city,increase the number of days between :)"
                        );
                      } else {
                        setFlightReturnDate(e.target.value);
                        getReturnFlights(e.target.value, touristQuantity);
                      }
                    }}
                    sx={{
                      backgroundColor: "transparent !important",
                      color: "cyan !important",
                      "& .MuiInputBase-input": {
                        backgroundColor: "transparent !important",
                        color: "cyan !important",
                      },
                      "& .MuiInputBase-root": {
                        backgroundColor: "transparent !important",
                        color: "cyan !important",
                      },
                      '& input[type="date"]::-webkit-calendar-picker-indicator':
                        {
                          filter:
                            "invert(50%) sepia(100%) saturate(500%) hue-rotate(170deg)", // Cyan color
                        },
                    }}
                  ></TextField>
                  <TextField
                    type="number"
                    className="seats-input3-TD"
                    value={touristQuantity}
                    disabled
                    placeholder="Number of persons"
                    onChange={(e) => {
                      setTouristQuantity(e.target.value);
                      getReturnFlights(flightReturnDate, e.target.value);
                    }}
                    sx={{
                      backgroundColor: "transparent !important",
                      color: "cyan !important",
                      "& .MuiInputBase-input": {
                        backgroundColor: "transparent !important",
                        color: "cyan !important",
                      },
                      "& .MuiInputBase-root": {
                        backgroundColor: "transparent !important",
                        color: "cyan !important",
                      },
                      '& input[type="date"]::-webkit-calendar-picker-indicator':
                        {
                          filter:
                            "invert(50%) sepia(100%) saturate(500%) hue-rotate(170deg)", // Cyan color
                        },
                    }}
                  ></TextField>
                </div>
                <div className="table-container-TD">
                  {returnFlightData && returnFlightData.length > 0 ? (
                    <div>
                      <table className="Tourist-table-TD">
                        <thead className="table-head2-TD">
                          <tr>
                            <th className="table-header-TD">Flight Name</th>
                            <th className="table-header-TD">Departure</th>
                            <th className="table-header-TD">Departure Time</th>
                            <th className="table-header-TD">Arrival</th>
                            <th className="table-header-TD">Arrival Time</th>
                            <th className="table-header-TD">Available Seats</th>
                            <th className="table-header-TD">Seat Type</th>
                            <th className="table-header-TD">Price($)</th>
                            <th className="table-header-TD">Airline Rating</th>

                            <th className="table-header-TD">Booking</th>
                          </tr>
                        </thead>
                        <tbody className="table-body-TD">
                          {returnFlightData.map((flight) => {
                            const localDepartureDateTime = DateTime.fromISO(
                              flight.departure_date +
                                "T" +
                                flight.departure_time,
                              { zone: "UTC" }
                            ).setZone(userTimeZone);

                            // Format date/time for display
                            const formattedDepartureDateTime =
                              localDepartureDateTime.toLocaleString(
                                DateTime.DATETIME_MED
                              );
                            const localArrivalDateTime = DateTime.fromISO(
                              flight.arrival_date + "T" + flight.arrival_time,
                              { zone: "UTC" }
                            ).setZone(userTimeZone);

                            // Format date/time for display
                            const formattedArrivalDateTime =
                              localArrivalDateTime.toLocaleString(
                                DateTime.DATETIME_MED
                              );
                            return (
                              <tr
                                key={flight.flight_id}
                                className="table-row-TD"
                              >
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.flight_name}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.departure_city},
                                  {flight.departure_country}
                                </td>

                                <td className="table-cell-TD table-cell2-TD">
                                  {formattedDepartureDateTime}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.arrival_city},{flight.arrival_country}
                                </td>

                                <td className="table-cell-TD table-cell2-TD">
                                  {formattedArrivalDateTime}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.seats_available}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.seat_type}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.price}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {flight.rating.toFixed(2)}
                                </td>
                                <td className="table-cell-TD table-cell2-TD">
                                  {returnFlightSelected ? (
                                    <>
                                      {selectedReturnFlightID ===
                                      flight.flight_id ? (
                                        <>
                                          <button
                                            className="edit-button-TD"
                                            onClick={() => {
                                              setSelectedReturnFlightID(null);
                                              setReturnFlightSelected(false);
                                            }}
                                          >
                                            Selected
                                          </button>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </>
                                  ) : (
                                    <button
                                      className="edit-button-TD"
                                      onClick={() => {
                                        setSelectedReturnFlightID(
                                          flight.flight_id
                                        );
                                        setReturnFlightSelected(true);
                                      }}
                                    >
                                      Select
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-data-message-TD">No Flights available.</p>
                  )}
                </div>
              </Step>
              <Step>
                <h2 className="step-heading-TD">
                  Select Hotel in {selectedPackageCountryName}
                </h2>
                {selectedPackageCity && selectedPackageCity.length > 0 ? (
                  selectedPackageCity.map((city) => (
                    <details
                      className="feedback-details2-TD"
                      key={city}
                      open={openSummary === city}
                    >
                      <summary
                        className="feedback-summary2-TD"
                        onClick={() => {
                          getHotels(city);
                          setOpenSummary(city);
                        }}
                      >
                        {city}
                      </summary>
                      <div className="feedback-content2-TD">
                        {hotelData && hotelData.length > 0 ? (
                          hotelData.map((hotel) => (
                            <details
                              className="feedback-details2-TD"
                              key={hotel.email}
                            >
                              <summary
                                className="feedback-summary2-TD"
                                // onClick={() => getHotels(city)}
                                onClick={() => {
                                  setError3("");
                                  if (
                                    daysStay[hotel.city].email === hotel.email
                                  ) {
                                    RoomDataAPICall(hotel);
                                  } else {
                                    setRoomData(null);
                                  }
                                }}
                              >
                                {hotel.first_name} {hotel.last_name}
                                <p className="summary-rating-TD">
                                  ({hotel.rating.toFixed(2)}
                                  <StarIcon />)
                                </p>
                                {daysStay[hotel.city].email === hotel.email ? (
                                  <>(Selected)</>
                                ) : (
                                  <></>
                                )}
                              </summary>
                              <div className="feedback-content2-TD">
                                <div className="hotel-details-TD">
                                  <div className="details2-TD">
                                    <p className="summary-rating2-TD">
                                      Rating: ({hotel.rating.toFixed(2)}
                                      <StarIcon />)
                                    </p>
                                    <p className="summary-rating2-TD">
                                      Phone:{hotel.phone}
                                    </p>
                                    <p className="summary-rating2-TD">
                                      Address:{hotel.address}
                                    </p>

                                    <p className="error-message-TD">{error3}</p>
                                  </div>
                                  <div className="hotel-details-right-div-TD">
                                    <button
                                      className="hotel-details-right-div-button-TD"
                                      onClick={() => {
                                        if (
                                          daysStay[hotel.city].email ===
                                          hotel.email
                                        ) {
                                          setDaysStay((prevState) => ({
                                            ...prevState,
                                            [hotel.city]: {
                                              ...prevState[hotel.city],
                                              email: "",
                                              first_name: "",
                                              last_name: "",
                                              days: 0,
                                              room_packages: null,
                                            },
                                          }));
                                          setRoomData(null);
                                        } else {
                                          setDaysStay((prevState) => ({
                                            ...prevState,
                                            [hotel.city]: {
                                              ...prevState[hotel.city],
                                              email: hotel.email,
                                              first_name: hotel.first_name,
                                              last_name: hotel.last_name,
                                              days: 0,
                                              room_packages: null,
                                            },
                                          }));
                                        }
                                      }}
                                    >
                                      {daysStay[hotel.city].email ===
                                      hotel.email ? (
                                        <>Selected</>
                                      ) : (
                                        <>Select</>
                                      )}
                                    </button>
                                    <input
                                      className="hotel-details-right-div-input-TD"
                                      type="number"
                                      key={hotel.city}
                                      disabled={
                                        daysStay[hotel.city].email !==
                                        hotel.email
                                      }
                                      value={
                                        daysStay[hotel.city].email ===
                                        hotel.email
                                          ? daysStay[hotel.city].days || 0
                                          : 0
                                      }
                                      onChange={(e) => addStayDays(e, hotel)}
                                    />
                                  </div>
                                </div>
                                <div className="table-container-TD">
                                  {roomData && roomData.length > 0 ? (
                                    <div>
                                      <table className="Tourist-table-TD">
                                        <thead className="table-head2-TD">
                                          <tr>
                                            <th className="table-header-TD">
                                              Room Type
                                            </th>
                                            <th className="table-header-TD">
                                              Person Quantity
                                            </th>
                                            <th className="table-header-TD">
                                              Price per Night($)
                                            </th>
                                            <th className="table-header-TD">
                                              Booking
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="table-body-TD">
                                          {roomData.map((room) => (
                                            <tr
                                              key={room.room_id}
                                              className="table-row-TD"
                                            >
                                              <td className="table-cell-TD table-cell3-TD">
                                                {room.type}
                                              </td>
                                              <td className="table-cell-TD table-cell3-TD">
                                                {room.quantity}
                                              </td>

                                              <td className="table-cell-TD table-cell3-TD">
                                                {room.price}
                                              </td>

                                              <td className="table-cell-TD table-cell3-TD">
                                                <button
                                                  className="edit-button-TD"
                                                  onClick={() => {
                                                    console.log(
                                                      "12,33",
                                                      daysStay
                                                    );
                                                    handleAddRoomPackage(
                                                      room.room_id,
                                                      room.price,
                                                      hotel.city
                                                    );
                                                  }}
                                                >
                                                  {daysStay[hotel.city]
                                                    ?.room_packages &&
                                                  daysStay[hotel.city]
                                                    ?.room_packages[
                                                    room.room_id
                                                  ] ? ( // Compare room.room_id with targetRoomId
                                                    <>Selected</>
                                                  ) : (
                                                    <>Select</>
                                                  )}
                                                </button>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : (
                                    <p className="no-data-message2-TD">
                                      {daysStay[hotel.city].email ===
                                      hotel.email ? (
                                        <>
                                          No Rooms Available(Increase/Decrease
                                          number of days)
                                        </>
                                      ) : (
                                        <>Select Hotel to display Rooms</>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </details>
                          ))
                        ) : (
                          <p>No Hotels Available in this city.</p>
                        )}
                      </div>
                    </details>
                  ))
                ) : (
                  <p>No cities selected.</p>
                )}
              </Step>
              <Step>
                <h2 className="step-heading-TD">
                  Select Tour Guide in {selectedPackageCountryName}
                </h2>
                {selectedPackageCity && selectedPackageCity.length > 0 ? (
                  selectedPackageCity.map((city) => (
                    <details
                      className="feedback-details2-TD"
                      key={city}
                      open={openSummary2 === city}
                    >
                      <summary
                        className="feedback-summary2-TD"
                        onClick={() => {
                          GuideDataAPICall(city);
                          setOpenSummary2(city);
                        }}
                      >
                        {city}
                      </summary>
                      <div className="feedback-content2-TD">
                        {guideData && guideData.length > 0 ? (
                          guideData.map((guide) => (
                            <details
                              className="feedback-details2-TD"
                              key={guide.email}
                            >
                              <summary className="feedback-summary2-TD">
                                {guide.first_name} {guide.last_name}
                                <p className="summary-rating-TD">
                                  ({guide.rating.toFixed(2)}
                                  <StarIcon />)
                                </p>
                                {daysStay[guide.city].guide_email ===
                                guide.email ? (
                                  <>(Selected)</>
                                ) : (
                                  <></>
                                )}
                              </summary>
                              <div className="feedback-content2-TD">
                                <div className="hotel-details-TD">
                                  <div className="details2-TD">
                                    <p className="summary-rating2-TD">
                                      Rating: ({guide.rating.toFixed(2)}
                                      <StarIcon />)
                                    </p>
                                    <p className="summary-rating2-TD">
                                      Phone:{guide.phone}
                                    </p>
                                    <p className="summary-rating2-TD">
                                      Price Per Day($):{guide.price_per_day}
                                    </p>
                                  </div>
                                  <div className="hotel-details-right-div-TD">
                                    <button
                                      className="hotel-details-right-div-button-TD"
                                      onClick={() => {
                                        if (
                                          daysStay[guide.city].guide_email ===
                                          guide.email
                                        ) {
                                          setDaysStay((prevState) => ({
                                            ...prevState,
                                            [guide.city]: {
                                              ...prevState[guide.city],
                                              guide_email: "",
                                              guide_first_name: "",
                                              guide_last_name: "",
                                              guide_price: 0,
                                            },
                                          }));
                                        } else {
                                          setDaysStay((prevState) => ({
                                            ...prevState,
                                            [guide.city]: {
                                              ...prevState[guide.city],
                                              guide_email: guide.email,
                                              guide_first_name:
                                                guide.first_name,
                                              guide_last_name: guide.last_name,
                                              guide_price: guide.price_per_day,
                                            },
                                          }));
                                        }
                                      }}
                                    >
                                      {daysStay[guide.city].guide_email ===
                                      guide.email ? (
                                        <>Selected</>
                                      ) : (
                                        <>Select</>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </details>
                          ))
                        ) : (
                          <p>No Tour Guides Available in this city.</p>
                        )}
                      </div>
                    </details>
                  ))
                ) : (
                  <p>No cities selected.</p>
                )}
              </Step>
              <Step>
                <h2 className="step-heading-TD">
                  Select Car Rental in {selectedPackageCountryName}
                </h2>
                {selectedPackageCity && selectedPackageCity.length > 0 ? (
                  selectedPackageCity.map((city) => (
                    <details
                      className="feedback-details2-TD"
                      key={city}
                      open={openSummary3 === city}
                    >
                      <summary
                        className="feedback-summary2-TD"
                        onClick={() => {
                          RentalDataAPICall(city);
                          setOpenSummary3(city);
                        }}
                      >
                        {city}
                      </summary>
                      <div className="feedback-content2-TD">
                        {rentalData && rentalData.length > 0 ? (
                          rentalData.map((rental) => (
                            <details
                              className="feedback-details2-TD"
                              key={rental.email}
                            >
                              <summary className="feedback-summary2-TD">
                                {rental.first_name} {rental.last_name}
                                <p className="summary-rating-TD">
                                  ({rental.rating.toFixed(2)}
                                  <StarIcon />)
                                </p>
                                {daysStay[rental.city].rental_email ===
                                rental.email ? (
                                  <>(Selected)</>
                                ) : (
                                  <></>
                                )}
                              </summary>
                              <div className="feedback-content2-TD">
                                <div className="hotel-details-TD">
                                  <div className="details2-TD">
                                    <div
                                      className="heading-TD"
                                      style={{
                                        textAlign: "left",
                                      }}
                                    >
                                      <strong>Driver Information</strong>
                                    </div>
                                    <p className="summary-rating2-TD">
                                      Rating: ({rental.rating.toFixed(2)}
                                      <StarIcon />)
                                    </p>
                                    <p className="summary-rating2-TD">
                                      Phone:{rental.phone}
                                    </p>
                                    <p className="summary-rating2-TD">
                                      Address:{rental.address}
                                    </p>
                                    <p className="summary-rating2-TD">
                                      Price Per Day($):{rental.price_per_day}
                                    </p>
                                    <div
                                      className="heading-TD"
                                      style={{
                                        textAlign: "left",
                                        marginTop: "30px",
                                      }}
                                    >
                                      <strong>Car Information</strong>
                                    </div>
                                    <p className="summary-rating2-TD">
                                      Seat Capacity:{rental.capacity}
                                    </p>
                                    <p className="summary-rating2-TD">
                                      Description:{rental.description}
                                    </p>
                                    <p className="summary-rating2-TD">
                                      Plate:{rental.plate}
                                    </p>
                                  </div>
                                  <div className="hotel-details-right-div-TD">
                                    <button
                                      className="hotel-details-right-div-button-TD"
                                      onClick={() => {
                                        if (
                                          daysStay[rental.city].rental_email ===
                                          rental.email
                                        ) {
                                          setDaysStay((prevState) => ({
                                            ...prevState,
                                            [rental.city]: {
                                              ...prevState[rental.city],
                                              rental_email: "",
                                              rental_first_name: "",
                                              rental_last_name: "",
                                              rental_price: 0,
                                            },
                                          }));
                                        } else {
                                          setDaysStay((prevState) => ({
                                            ...prevState,
                                            [rental.city]: {
                                              ...prevState[rental.city],
                                              rental_email: rental.email,
                                              rental_first_name:
                                                rental.first_name,
                                              rental_last_name:
                                                rental.last_name,
                                              rental_price:
                                                rental.price_per_day,
                                            },
                                          }));
                                        }
                                      }}
                                    >
                                      {daysStay[rental.city].rental_email ===
                                      rental.email ? (
                                        <>Selected</>
                                      ) : (
                                        <>Select</>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </details>
                          ))
                        ) : (
                          <p>No Car Rentals Available in this city.</p>
                        )}
                      </div>
                    </details>
                  ))
                ) : (
                  <p>No cities selected.</p>
                )}
              </Step>
              <Step>
                <h2 className="step-heading-TD">Billing Details</h2>
                <h2 className="step-heading-TD">
                  Current Country:{selectedCurrentCity},
                  {selectedCurrentCountryName}
                </h2>
                <h2 className="step-heading-TD">
                  Destination Country:{selectedPackageCountryName}
                </h2>
                <div
                  className="heading-TD"
                  style={{
                    textAlign: "left",
                    marginTop: "5vh",
                    width: "fit-content",
                  }}
                >
                  <strong>Hotel Information</strong>
                </div>

                <div className="table-container-TD">
                  {daysStay && Object.keys(daysStay).length > 0 ? (
                    <div>
                      <table className="Tourist-table-TD">
                        <thead className="table-head2-TD">
                          <tr>
                            <th className="table-header-TD">City</th>
                            <th className="table-header-TD">Days Stay</th>
                            <th className="table-header-TD">Hotel</th>
                            <th className="table-header-TD">Rooms Booked</th>
                            <th className="table-header-TD">
                              Total Price Per Day
                            </th>
                            <th className="table-header-TD">
                              Total Stay Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="table-body-TD">
                          {Object.entries(daysStay).map(([city, cityData]) => (
                            <tr className="table-row-TD" key={city}>
                              <td className="table-cell-TD table-cell2-TD">
                                {city}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.days}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.first_name} {cityData.last_name}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.room_packages &&
                                Object.keys(cityData.room_packages).length >
                                  0 ? (
                                  Object.keys(cityData.room_packages).map(
                                    (roomId) => (
                                      <div key={roomId}>
                                        Room {roomId}: $
                                        {cityData.room_packages[roomId]}
                                      </div>
                                    )
                                  )
                                ) : (
                                  <div>No rooms booked</div>
                                )}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.room_packages &&
                                  Object.values(cityData.room_packages).reduce(
                                    (sum, price) => sum + price,
                                    0
                                  )}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.room_packages &&
                                  cityData.days &&
                                  Object.values(cityData.room_packages).reduce(
                                    (sum, price) => sum + price,
                                    0
                                  ) * cityData.days}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div
                        className="step-heading-TD"
                        style={{
                          textAlign: "left",
                          marginTop: "5vh",
                          width: "fit-content",
                        }}
                      >
                        <strong>
                          Total Hotel Price: {totalHotelPrice ?? "No Data"} $
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <p className="no-data-message-TD">No Data available.</p>
                  )}
                </div>
                <div
                  className="heading-TD"
                  style={{
                    textAlign: "left",
                    marginTop: "5vh",
                    width: "fit-content",
                  }}
                >
                  <strong>Tour Guide Information</strong>
                </div>

                <div className="table-container-TD">
                  {daysStay && Object.keys(daysStay).length > 0 ? (
                    <div>
                      <table className="Tourist-table-TD">
                        <thead className="table-head2-TD">
                          <tr>
                            <th className="table-header-TD">City</th>
                            <th className="table-header-TD">Days Stay</th>
                            <th className="table-header-TD">Tour Guide</th>
                            <th className="table-header-TD">Tour Guide Data</th>
                            <th className="table-header-TD">Price Per Day</th>
                            <th className="table-header-TD">Total Price</th>
                          </tr>
                        </thead>
                        <tbody className="table-body-TD">
                          {Object.entries(daysStay).map(([city, cityData]) => (
                            <tr className="table-row-TD" key={city}>
                              <td className="table-cell-TD table-cell2-TD">
                                {city}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.days}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.guide_email ? <>Yes</> : <>No</>}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.guide_email ? (
                                  <>
                                    {cityData.guide_first_name}{" "}
                                    {cityData.guide_last_name}
                                  </>
                                ) : (
                                  <>N/A</>
                                )}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.guide_price}
                              </td>

                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.guide_price * cityData.days}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div
                        className="step-heading-TD"
                        style={{
                          textAlign: "left",
                          marginTop: "5vh",
                          width: "fit-content",
                        }}
                      >
                        <strong>
                          Total Tour Guide Price: {totalGuidePrice ?? "No Data"}{" "}
                          $
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <p className="no-data-message-TD">No Data available.</p>
                  )}
                </div>
                <div
                  className="heading-TD"
                  style={{
                    textAlign: "left",
                    marginTop: "5vh",
                    width: "fit-content",
                  }}
                >
                  <strong>Car Rental Information</strong>
                </div>

                <div className="table-container-TD">
                  {daysStay && Object.keys(daysStay).length > 0 ? (
                    <div>
                      <table className="Tourist-table-TD">
                        <thead className="table-head2-TD">
                          <tr>
                            <th className="table-header-TD">City</th>
                            <th className="table-header-TD">Days Stay</th>
                            <th className="table-header-TD">Car Rental</th>
                            <th className="table-header-TD">Car Rental Data</th>
                            <th className="table-header-TD">Price Per Day</th>
                            <th className="table-header-TD">Total Price</th>
                          </tr>
                        </thead>
                        <tbody className="table-body-TD">
                          {Object.entries(daysStay).map(([city, cityData]) => (
                            <tr className="table-row-TD" key={city}>
                              <td className="table-cell-TD table-cell2-TD">
                                {city}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.days}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.rental_email ? <>Yes</> : <>No</>}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.rental_email ? (
                                  <>
                                    {cityData.rental_first_name}{" "}
                                    {cityData.rental_last_name}
                                  </>
                                ) : (
                                  <>N/A</>
                                )}
                              </td>
                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.rental_price}
                              </td>

                              <td className="table-cell-TD table-cell2-TD">
                                {cityData.rental_price * cityData.days}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div
                        className="step-heading-TD"
                        style={{
                          textAlign: "left",
                          marginTop: "5vh",
                          width: "fit-content",
                        }}
                      >
                        <strong>
                          Total Car Rental Price:{" "}
                          {totalRentalPrice ?? "No Data"} $
                        </strong>
                      </div>
                    </div>
                  ) : (
                    <p className="no-data-message-TD">No Data available.</p>
                  )}
                </div>
                <div
                  className="step-heading-TD"
                  style={{
                    textAlign: "left",
                    marginTop: "5vh",
                    width: "fit-content",
                  }}
                >
                  <strong>
                    Total Package Cost (10% Discount):{formData.amount}$
                  </strong>
                </div>
              </Step>
              <Step>
              <div className={`payment-container-TD form-${formState}-TD`}>
                  
                  <form
                    id="myForm"
                    className="payment-form-TD"
                    onSubmit={handleSubmit}
                  ><h2 className="payment-header-TD">Payment Details</h2>
                    <div className="form-group-TD card-number-TD">
                      <label className="form-label-TD" htmlFor="card">
                        Card Number
                      </label>
                      <input
                        className={`form-input-TD ${
                          errors.card ? "input-error-TD" : ""
                        }`}
                        type="text"
                        id="card"
                        placeholder="1234 5678 9012 3456"
                        value={formData.card}
                        onChange={handleChange}
                      />
                      {errors.card && (
                        <div className="error-message-TD">{errors.card}</div>
                      )}
                    </div>

                    <div className="card-info-TD">
                      <div className="form-group-TD card-expiry-TD">
                        <label className="form-label-TD" htmlFor="expiry">
                          Expiry Date
                        </label>
                        <input
                          className={`form-input-TD ${
                            errors.expiry ? "input-error-TD" : ""
                          }`}
                          type="text"
                          id="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleChange}
                        />
                        {errors.expiry && (
                          <div className="error-message-TD">
                            {errors.expiry}
                          </div>
                        )}
                      </div>

                      <div className="form-group-TD card-cvv-TD">
                        <label className="form-label-TD" htmlFor="cvv">
                          CVV
                        </label>
                        <input
                          className={`form-input-TD ${
                            errors.cvv ? "input-error-TD" : ""
                          }`}
                          type="text"
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={handleChange}
                        />
                        {errors.cvv && (
                          <div className="error-message-TD">{errors.cvv}</div>
                        )}
                      </div>
                    </div>

                    <div className="form-group-TD">
                      <label className="form-label-TD" htmlFor="amount">
                        Amount
                      </label>
                      <input
                        className={`form-input-TD ${
                          errors.amount ? "input-error-TD" : ""
                        }`}
                        type="text"
                        id="amount"
                        placeholder="$0.00"
                        value={"$" + formData.amount}
                        disabled
                      />
                      {errors.amount && (
                        <div className="error-message-TD">{errors.amount}</div>
                      )}
                    </div>

                    <button className="payment-button-TD" type="submit">
                      Pay Now
                    </button>

                    <div className="secure-badge-TD">
                      Secure payment processing
                    </div>
                  </form>
                  {formState === 'shrinking' && (
  <div className="payment-success-TD">
    <div className="success-checkmark-TD">✓</div>
  </div>
)}
                </div>
                {showSuccessMessage && (
  <div className="payment-complete-message-TD">
    <div className="success-icon-TD">✓</div>
    <h2 className="success-title-TD">Payment Completed</h2>
    <p className="success-text-TD">Your transaction was successful!</p>
  </div>
)}
              </Step>
              <Step>
                <h2>Final Step</h2>
                <p>You made it!</p>
              </Step>
            </Stepper>
          </DialogContent>
        </Dialog>
      </div>
    );
  };
  const TravelPackages = () => {
    return (
      <>
        <div className="Tourist-content-TD">
          <h2 className="heading-TD">
            <strong>Travel The World!</strong>
          </h2>
          <button
            onClick={handleOpenPackageStepper}
            className={"travel-btn travel-btn-animated"}
          >
            <span className="btn-content">
              Let's Travel
              <ChevronRight className="btn-icon" size={18} />
            </span>
          </button>
        </div>
        {
          <PackageStepper
            open={stepperDisplay}
            onClose={handleClosePackageStepper}
          />
        }
      </>
    );
  };
  const TouristButton = styled(Button)(({ theme }) => ({
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
      <div className="star-rating-TD">
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
        <div className="Tourist-content-TD">
          <h2 className="heading-TD">
            <strong>Feedback</strong>
          </h2>
          {displayFeedbackData.length > 0 ? (
            <>
              {displayFeedbackData.map((reserv) => (
                <details
                  className="feedback-details-TD"
                  key={reserv.feedback_id}
                >
                  <summary className="feedback-summary-TD">
                    {reserv.first_name} {reserv.last_name}({reserv.sender_email}
                    )
                  </summary>
                  <div className="feedback-content-TD">
                    <div className="feedback-rating-TD">
                      Rating: <StarRating rating={reserv.rating} />
                    </div>

                    <p className="feedback-text-TD">
                      Description:&nbsp;
                      {reserv.description}
                    </p>
                  </div>
                </details>
              ))}
            </>
          ) : (
            <p className="no-data-message-TD">No feedback available.</p>
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
    const [updatedData, setUpdatedData] = useState({
      first_name: "",
      last_name: "",
      age: "",
      phone: "",
      address: "",
      password: "",
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

      setError("");
      console.log("Updated-Data", updatedData);
      updateData();
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
        //check if there is an existing package going on
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

    return (
      <div>
        <div className="details-container-TD">
          <h2 className="heading-TD">Settings</h2>
        </div>
        {editData === true ? (
          <div className="edit-input-container-TD">
            <TextField
              type="text"
              className="seats-input2-TD"
              label="First Name"
              value={updatedData.first_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "first_name")}
              required
            >
              First Name
            </TextField>
            <TextField
              type="text"
              className="seats-input2-TD"
              label="Last Name"
              value={updatedData.last_name}
              onChange={(e) => handleUpdatedDataInputChange(e, "last_name")}
              required
            >
              Last Name
            </TextField>
            <p className="data-TD">
              <strong>Email:</strong> {AccountData.email}
            </p>

            <TextField
              type="number"
              className="seats-input2-TD"
              label="Age(18-150)"
              value={updatedData.age}
              onChange={(e) => handleUpdatedDataInputChange(e, "age")}
              required
            >
              Age
            </TextField>
            <TextField
              type="tel"
              className="seats-input2-TD"
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
              className="seats-input2-TD"
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
              className="seats-input2-TD"
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
              className="seats-input2-TD"
              label="Complete Address"
              value={updatedData.address}
              onChange={(e) => handleUpdatedDataInputChange(e, "address")}
              required
            >
              Address
            </TextField>
            <TextField
              type="password"
              className="seats-input2-TD"
              label="Enter Password"
              value={updatedData.password}
              onChange={(e) => handleUpdatedDataInputChange(e, "password")}
              required
            >
              Password
            </TextField>
            <TextField
              type="password"
              className="seats-input2-TD"
              label="Confirm Password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required
            >
              Confirm Password
            </TextField>

            {error && <p className="error-message-TD">{error}</p>}
          </div>
        ) : (
          <div className="details-container-TD">
            <p className="data-TD">
              <strong>First Name: {AccountData.first_name}</strong>
            </p>
            <p className="data-TD">
              <strong>Last Name: {AccountData.last_name}</strong>
            </p>
            <p className="data-TD">
              <strong>Email: {AccountData.email}</strong>
            </p>
            <p className="data-TD">
              <strong>Age: {AccountData.age}</strong>
            </p>
            <p className="data-TD">
              <strong>Phone: {AccountData.phone}</strong>
            </p>
            <p className="data-TD">
              <strong>Country: {AccountData.country}</strong>
            </p>
            <p className="data-TD">
              <strong>City: {AccountData.city}</strong>
            </p>
            <p className="data-TD">
              <strong>Address: {AccountData.address}</strong>
            </p>
            <p className="data-TD">
              <strong>
                Password: {"*".repeat(AccountData.password.length)}
              </strong>
            </p>
          </div>
        )}
        <div className="setting-container-TD">
          {editData && (
            <button className="save-button-TD" onClick={saveChanges}>
              Save
            </button>
          )}
          <button className="edit-button-TD" onClick={editDataButton}>
            {editData ? "Cancel Edit" : "Edit Info"}
          </button>
        </div>

        <div className="setting-container-TD">
          <TouristButton
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
          </TouristButton>
          <TouristButton
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
          </TouristButton>
        </div>
        <div className="setting-container-TD">
          {error2 && <p className="error-message2-TD">{error2}</p>}
        </div>

        {accountStatus ? (
          <p className="locking-account-message-TD">
            <LockIcon />
            Locking Account will NOT show your Profile to the Tourists for
            reservations
          </p>
        ) : (
          <p className="locking-account-message-TD">
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
    Packages: Packages,
    TravelPackages: TravelPackages,
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
      <div className="background-TD">
        <Aurora
          colorStops={["#2196F3", "#3498DB", "#FFFFFF", "#87CEEB", "#2196F3"]}
          speed={1.2}
        />
      </div>
      <div className="main-container-TD">
        <div className="hamburger-menu-TD">
          <button
            className={`hamburger-icon-TD ${isOpen ? "open-TD" : ""}`}
            onClick={toggleMenu}
          >
            <span
              className={`line-TD line-top-TD ${isOpen ? "open-TD" : ""}`}
            ></span>
            <span
              className={`line-TD line-middle-TD ${isOpen ? "open-TD" : ""}`}
            ></span>
            <span
              className={`line-TD line-bottom-TD ${isOpen ? "open-TD" : ""}`}
            ></span>
          </button>

          <nav className={`menu-TD ${isOpen ? "open-TD" : ""}`}>
            <ul>
              <li>
                <button
                  className="button-TD"
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
                  className="button-TD"
                  onClick={() => {
                    setActiveCard("Packages");
                    localStorage.setItem("activeCard", "Packages");
                  }}
                >
                  <HistoryIcon />
                  Packages
                </button>
              </li>
              <li>
                <button
                  className="button-TD"
                  onClick={() => {
                    setActiveCard("TravelPackages");
                    localStorage.setItem("activeCard", "TravelPackages");
                  }}
                >
                  <PublicIcon />
                  Travel the World
                </button>
              </li>
              <li>
                <button
                  className="button-TD"
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
                  className="button-TD"
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
                <button className="button-TD" onClick={logOut}>
                  <LogoutIcon />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
        <div className="content-TD">
          <div className="details-TD">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default TouristDashboard;
