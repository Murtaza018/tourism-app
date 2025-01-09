import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };
  return (
    <>
      <Button onClick={handleSignUp}>Sign Up</Button>
    </>
  );
}
export default Home;
