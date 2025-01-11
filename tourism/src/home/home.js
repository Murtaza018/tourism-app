import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };
  const handleSignIn = () => {
    navigate("/signin");
  };
  return (
    <>
      <Button onClick={handleSignUp}>Sign Up</Button>
      <Button onClick={handleSignIn}>Sign In</Button>
    </>
  );
}
export default Home;
