import React, { useEffect, useState } from "react";
import Auth from "../../../../Utils/Auth";
import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import DecayCard from "./Animations/DecayCard";
import image from "../../../../assets/CallImage.jpg";
import Footer from "../Footer";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import UserNavbar from "./UserNavbar";

function HomeUser() {
  const location = useLocation();
  const user = location.state || null;
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  let router = useNavigate();

  let meetingPage = async () => {
    router("/meeting" , {
      state : {username : username}
    });
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setOpen(user.open);
      setMessage(user.message);
    }
  }, [user]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <div className="h-screen w-screen bg-black">
        <div className="container">
          <div className="row">
            <UserNavbar username={username} />
            <div className="col-6">
              <div className="relative top-75">
                <p
                  style={{ color: "#5B23FF", fontSize: "5rem" }}
                  className="m-0 p-0"
                >
                  Hi, {username}
                </p>
                <p className="fs-1 lh-lg text-light m-0 p-0 mb-5">
                  Stay Close, No Matter the Miles.
                </p>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ backgroundColor: "#5B23FF", colour: "white" }}
                  onClick={meetingPage}
                >
                  Rejoin
                </Button>
              </div>
            </div>
            <div className="col-2"></div>
            <div className="col-4 mt-5 pt-3">
              <DecayCard width={400} height={550} image={image}>
                <h2 style={{ color: "#675b8b" }}>
                  <i>Callify</i>
                </h2>
              </DecayCard>
              <br />
              <p
                className="lh-lg m-0 p-0 mb-5 text-end"
                style={{ color: "#675b8b" }}
              >
                Because Every Moment Matters.
              </p>
            </div>
          </div>
        </div>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          message={message}
          onClose={handleClose}
          action={action}
        />
      </div>
      <Footer />
    </>
  );
}

export default Auth(HomeUser);
