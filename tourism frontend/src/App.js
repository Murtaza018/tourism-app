import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./home/home.js";
import SignUp from "./SignUp/SignUp.js";
import SignIn from "./SignIn/SignIn.js";
import TouristDashboard from "./dashboard/tourist/TouristDashboard.js";
import AdminDashboard from "./dashboard/admin/AdminDashboard.js";
import HotelDashboard from "./dashboard/hotel/HotelDashboard.js";
import AirlineDashboard from "./dashboard/airline/AirlineDashboard.js";
import GuideDashboard from "./dashboard/guide/GuideDashboard.js";
import RentalDashboard from "./dashboard/rental/RentalDashboard.js";
// import { useEffect, useState } from "react";

function App() {
  // const [roleID, setRoleID] = useState("");
  // useEffect(() => {
  //   if (
  //     localStorage.getItem("loggedIn") &&
  //     localStorage.getItem("loggedIn") === true &&
  //     localStorage.getItem("email")
  //   ) {
  //     fetch("http://localhost:8008/Tourism/UserDataRetreival", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ email: localStorage.getItem("email") }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.code === 200) {
  //           console.log(data.data);
  //           setRoleID(data.data[0].role_ID);
  //         } else {
  //           console.log("Data not retreived!", data.data);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="signUp">
              <Route index element={<SignUp />} />
            </Route>
            <Route path="signIn">
              <Route index element={<SignIn />} />
            </Route>
            <Route path="TouristDashboard">
              <Route index element={<TouristDashboard />} />
            </Route>
            <Route path="HotelDashboard">
              <Route index element={<HotelDashboard />} />
            </Route>
            <Route path="AirlineDashboard">
              <Route index element={<AirlineDashboard />} />
            </Route>
            <Route path="GuideDashboard">
              <Route index element={<GuideDashboard />} />
            </Route>
            <Route path="AdminDashboard">
              <Route index element={<AdminDashboard />} />
            </Route>
            <Route path="RentalDashboard">
              <Route index element={<RentalDashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
