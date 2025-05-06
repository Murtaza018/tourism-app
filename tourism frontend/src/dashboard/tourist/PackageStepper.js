import "./TouristDashboard.css";
import { useState, useEffect } from "react";
import Stepper, { Step } from "../../components/Stepper";
import { Country, City } from "country-state-city";
import PublicIcon from "@mui/icons-material/Public";
import { DateTime } from "luxon";
import {
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { ChevronRight, ChevronLeft, Plane } from "lucide-react";
import moment from "moment";
const PackageStepper = ({ open, onClose }) => {
  const [selectedPackageCity, setSelectedPackageCity] = useState([]);
  const [selectedPackageCountry, setSelectedPackageCountry] = useState("");
  const [selectedPackageCountryName, setSelectedPackageCountryName] =
    useState("");
  const [Packagecities, setPackageCities] = useState([]);
  const [selectedCurrentCity, setSelectedCurrentCity] = useState("");
  const [selectedCurrentCountry, setSelectedCurrentCountry] = useState("");
  const [selectedCurrentCountryName, setSelectedCurrentCountryName] =
    useState("");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flightDate, setFlightDate] = useState(null);
  const [touristQuantity, setTouristQuantity] = useState(null);
  const [selectedFlightID, setSelectedFlightID] = useState(null);
  const [flightSelected, setFlightSelected] = useState(false);
  const [selectedReturnFlightID, setSelectedReturnFlightID] = useState(null);
  const [returnFlightSelected, setReturnFlightSelected] = useState(false);
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
  const [selectedFlightPrice, setSelectedFlightPrice] = useState(0);
  const [selectedReturnFlightPrice, setSelectedReturnFlightPrice] = useState(0);
  useEffect(() => {
    setRentalPrice(totalRentalPrice);
  }, [totalRentalPrice]);
  useEffect(() => {
    setFormData({
      amount: Math.floor(
        (hotelPrice +
          guidePrice +
          rentalPrice +
          selectedFlightPrice +
          selectedReturnFlightPrice) *
          0.9
      ),
    });
  }, [
    guidePrice,
    hotelPrice,
    rentalPrice,
    selectedFlightPrice,
    selectedReturnFlightPrice,
  ]);
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
          formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 4);
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

  const [formState, setFormState] = useState("visible");
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Process payment here
      insertPackage();

      // Start the shrinking animation
      setFormState("shrinking");

      // After animation completes, fully hide the form
      setTimeout(() => {
        // Hide the form
        setFormState("hidden");

        // Show appropriate success/failure message
      }, 600); // Slightly longer than the animation duration
    }
  };
  const [showSuccessMessage, setShowSuccessMessage] = useState("undefined");
  const insertPackage = async () => {
    fetch("http://localhost:8008/Tourism/insertPackage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataObject: daysStay,
        quantity: touristQuantity,
        flightID: selectedFlightID,
        returnFlightID: selectedReturnFlightID,
        departureCountry: selectedCurrentCountryName,
        departureCity: selectedCurrentCity,
        arrivalCountry: selectedPackageCountryName,
        arrivalCity: selectedPackageCity,
        email: localStorage.getItem("email"),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          console.log(data.data);
          setTimeout(() => {
            setShowSuccessMessage("success");
          }, 600);
        } else {
          console.log("Package not inserted!", data.data);
          setTimeout(() => {
            setShowSuccessMessage("fail");
          }, 600);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
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
              if (step === 1) {
                if (selectedCurrentCountryName === "") {
                  return "Select Country!";
                }
                if (selectedCurrentCity.length <= 0 && !noCurrentCity) {
                  return "Select City!";
                }
              }
              if (step === 2) {
                if (selectedPackageCountryName === "") {
                  return "Enter Country!";
                }
                if (selectedPackageCity.length <= 0 && !noPackageCity) {
                  return "Select at least 1 City!";
                }
              }
              if (step === 3) {
                if (touristQuantity <= 0) {
                  return "Quantity can not be less than 0";
                }
                if (!flightDate) {
                  return "Select a Date!";
                }
                if (!selectedFlightID) {
                  return "Select a flight!";
                }
              }
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

                if (touristQuantity <= 0) {
                  return "Quantity can not be less than 0";
                }

                if (!selectedReturnFlightID) {
                  if (
                    window.confirm(
                      "You have not selected a return flight,continue?"
                    )
                  ) {
                    return true;
                  }
                  return "Select a flight!";
                }
              }
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

                if (flightReturnDate && selectedReturnFlightID) {
                  const startDate = new Date(flightDate);
                  const endDate = new Date(flightReturnDate);

                  const timeDifference =
                    endDate.getTime() - startDate.getTime();
                  const days = Math.round(
                    timeDifference / (1000 * 60 * 60 * 24)
                  );

                  let intervalDays = 0;
                  for (const city in daysStay) {
                    intervalDays += parseInt(daysStay[city].days, 10);
                  }

                  intervalDays = parseInt(intervalDays, 10);
                  console.log("days:", days);
                  console.log("interval days:", intervalDays);
                  if (days !== intervalDays) {
                    return "Invalid! Total Package Days do not match with total days selected at hotels";
                  }
                }
                for (const city in daysStay) {
                  if (daysStay[city].email === "") {
                    return `Hotel not selected in city: ${city}`;
                  }
                }
                for (const city in daysStay) {
                  if (daysStay[city].days === 0) {
                    return `Inavlid days(0) in city: ${city}`;
                  }
                }
                for (const city in daysStay) {
                  if (daysStay[city].room_id) {
                    return `No Rooms selected in city: ${city}`;
                  }
                }
              }
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

                let no_guide_cities = [];
                for (const city in daysStay) {
                  if (daysStay[city].guide_email === "") {
                    no_guide_cities.push(city);
                  }
                }
                if (
                  !window.confirm(
                    `You have not selected tour guides in these cities:(${no_guide_cities}) Continue(OK)?`
                  )
                ) {
                  return "";
                }
              }
              if (step === 7) {
                console.log("days Stay:", daysStay);
                let no_rental_cities = [];
                for (const city in daysStay) {
                  if (daysStay[city].rental_email === "") {
                    no_rental_cities.push(city);
                  }
                }
                if (
                  !window.confirm(
                    `You have not selected car rentals in these cities:(${no_rental_cities}) Continue(OK)?`
                  )
                ) {
                  return "";
                }
              }
              if (step === 9) {
                if (
                  showSuccessMessage !== "fail" &&
                  showSuccessMessage !== "success"
                ) {
                  return "Complete Payment!";
                }
              }
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
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
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
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
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
                            flight.departure_date + "T" + flight.departure_time,
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
                            <tr key={flight.flight_id} className="table-row-TD">
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
                                      setSelectedFlightPrice(flight.price);
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
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
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
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
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
                            flight.departure_date + "T" + flight.departure_time,
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
                            <tr key={flight.flight_id} className="table-row-TD">
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
                                      setSelectedReturnFlightPrice(
                                        flight.price
                                      );
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
                                      daysStay[hotel.city].email !== hotel.email
                                    }
                                    value={
                                      daysStay[hotel.city].email === hotel.email
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
                                            guide_first_name: guide.first_name,
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
                                            rental_last_name: rental.last_name,
                                            rental_price: rental.price_per_day,
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
                          <th className="table-header-TD">Total Stay Price</th>
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
                              Object.keys(cityData.room_packages).length > 0 ? (
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
                        Total Tour Guide Price: {totalGuidePrice ?? "No Data"} $
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
                        Total Car Rental Price: {totalRentalPrice ?? "No Data"}{" "}
                        $
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
                >
                  <h2 className="payment-header-TD">Payment Details</h2>
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
                        <div className="error-message-TD">{errors.expiry}</div>
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
                {formState === "shrinking" && (
                  <div className="payment-success-TD">
                    <div className="success-checkmark-TD">✓</div>
                  </div>
                )}
              </div>
              {showSuccessMessage && showSuccessMessage === "success" && (
                <div className="payment-complete-message-TD">
                  <div className="success-icon-TD">✓</div>
                  <h2 className="success-title-TD">Package Completed</h2>
                  <p className="success-text-TD">
                    Your transaction was successful!
                  </p>
                </div>
              )}
              {showSuccessMessage && showSuccessMessage === "fail" && (
                <div className="payment-failure-message-TD">
                  <div className="failure-icon-TD">✗</div>
                  <h2 className="failure-title-TD">Package Failed</h2>
                  <p className="failure-text-TD">
                    There was an issue processing your transaction.
                  </p>
                </div>
              )}
              {/* <button className="payment-button-TD" onClick={handleSubmit}>
Call API
</button> */}
            </Step>
            <Step>
              {showSuccessMessage && (
                <div className="container-TD">
                  {showSuccessMessage === "success" ? (
                    <p className="success-message-TD success-positive-TD">
                      Enjoy your vacations!
                    </p>
                  ) : (
                    <p className="success-message-TD success-negative-TD">
                      Create a Package to enjoy your vacations!
                    </p>
                  )}
                </div>
              )}
            </Step>
          </Stepper>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PackageStepper;
