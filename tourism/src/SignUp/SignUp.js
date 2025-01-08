import { Card, Select, Button } from "@mui/material";
import { useState, useEffect } from "react";
import "./SignUp.css";
function SignUp() {
  return (
    <>
      <div className="image"></div>
      <Card className="card">
        <div className="heading">Sign Up</div>
        <div className="button-container">
          <Button className="button">Tourist</Button>
          <Button className="button">Hotel Management</Button>
          <Button className="button">Airline Company</Button>
          <Button className="button">Tour Guide</Button>
        </div>
      </Card>
    </>
  );
}

export default SignUp;
