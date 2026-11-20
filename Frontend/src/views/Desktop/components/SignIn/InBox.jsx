import * as React from "react";
import PasswordIcon from "@mui/icons-material/Password";
import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { AuthContext } from "../../../../Context/AuthContext";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function Box() {
  const navigate = useNavigate("");
  const location = useLocation();
  const user = location.state || null;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const { handleSignIn } = useContext(AuthContext);

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

  const handleAuth = async () => {
    try {
      let u = username;
      let result = await handleSignIn(username, password);
      setUsername("");
      setPassword("");
      setError("");
      console.log(result);
      navigate("/home", {
        state: { username: u, message: result, open: true },
      });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="row relative grid place-items-center mb-5">
      <div className="h-100 w-80 rounded-lg p-5 bg-white/30 backdrop-blur-sm">
        <p className="text-6xl text-violet-500 mb-5">Sign In</p>
        <form className="row g-3 needs-validation" noValidate>
          <div className="input-group position-relative mt-5">
            <span className="input-group-text p-3">@</span>
            <div className="form-floating is-invalid">
              <input
                type="text"
                className="form-control"
                id="floatingInputGroup2"
                placeholder="Username"
                value={username}
                required
                autoComplete=""
                onChange={(e) => setUsername(e.target.value)}
              />
              <label for="floatingInputGroup2">Username</label>
            </div>
            <div className="invalid-tooltip">Enter your username</div>
          </div>
          <div className="input-group position-relative my-5">
            <span className="input-group-text p-3">
              <PasswordIcon />
            </span>
            <div className="form-floating is-invalid">
              <input
                type="password"
                className="form-control"
                id="floatingInputGroup3"
                placeholder="Password"
                value={password}
                required
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label for="floatingInputGroup3">Password</label>
            </div>
            <div className="invalid-tooltip">Enter Correct Password</div>
          </div>
          <p style={{ color: "red" }} className="pt-5">
            {error}
          </p>
          <button
            className="bg-violet-500 text-white col-4 mt-3 p-2 rounded-3 fs-5"
            type="button"
            onClick={handleAuth}
          >
            Sign In
          </button>
        </form>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        message={message}
        onClose={handleClose}
        action={action}
      />
    </div>
  );
}
