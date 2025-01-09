import { Card, Button } from "@mui/material";
import { useState } from "react";
import "./SignUp.css";

function SignUp() {
  const [activeCard, setActiveCard] = useState(null);

  const Card1 = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <h2>Card 1</h2>
      <p>This is the content of Card 1.</p>
    </div>
  );

  const Card2 = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <h2>Card 2</h2>
      <p>This is the content of Card 2.</p>
    </div>
  );

  const Card3 = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <h2>Card 3</h2>
      <p>This is the content of Card 3.</p>
    </div>
  );

  const Card4 = () => (
    <div className="card2">
      <button className="close-icon" onClick={() => setActiveCard(null)}>
        ✕
      </button>
      <h2>Card 4</h2>
      <p>This is the content of Card 4.</p>
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
