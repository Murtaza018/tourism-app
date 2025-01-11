import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./home/home.js";
import SignUp from "./SignUp/SignUp.js";
import SignIn from "./SignIn/SignIn.js";
//import { useState, useEffect } from "react";

function App() {
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
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
