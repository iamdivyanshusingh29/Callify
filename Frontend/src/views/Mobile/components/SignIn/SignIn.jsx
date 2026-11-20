import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import TextField from "@mui/material/TextField";
import { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state || null;
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const { handleSignIn } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  let shrink = username ? true : null ;

  const handleAuth = async () => {
    try {
      let u = username;
      let result = await handleSignIn(username, password);
      setUsername("");
      setPassword("");
      setError("");
      navigate("/home", {
        state: { username: u },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="bg-black h-screen w-screen">
        <nav className="Fixed top-0 pt-2 d-flex">
          <div className="mb-1">
            <IconButton
              aria-label="BackWard"
              size="large"
              onClick={() => navigate("/")}
            >
              <ArrowBackIosIcon fontSize="inherit" sx={{ color: "#a78bfa" }} />
            </IconButton>
          </div>
          <div className="mt-2 mx-auto">
            <h2 className="text-center pe-5" style={{ color: "#a78bfa" }}>
              Sign In
            </h2>
          </div>
        </nav>
        <main className="bg-black bg-gradient relative h-screen w-screen">
          <div className="container">
            <div className="row mx-2">
              <form className="row g-3 needs-validation">
                <label className="form-label text-violet-500 text-xl">
                  Enter Your Details
                </label>
                <div className="mt-3 mb-5 text-white">
                  <TextField
                    label="Username"
                    variant="filled"
                    InputProps={{
                      style: { color: "white" },
                    }}
                    InputLabelProps={{
                      shrink: shrink,
                      style: { color: "white" },
                    }}
                    sx={{
                      width: "290px",
                      "& .MuiFilledInput-root:before": {
                        borderBottomColor: "white",
                      },
                      "& .MuiFilledInput-root:after": {
                        borderBottomColor: "white",
                      },
                    }}
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <div className="my-3"></div>
                  <TextField
                    type="password"
                    label="Password"
                    variant="filled"
                    InputProps={{
                      style: { color: "white" },
                    }}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                    sx={{
                      width: "290px",
                      "& .MuiFilledInput-root:before": {
                        borderBottomColor: "white",
                      },
                      "& .MuiFilledInput-root:after": {
                        borderBottomColor: "white",
                      },
                    }}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <p style={{ color: "red" }} className="pt-5">
                  {error}
                </p>
                <button
                  className="bg-violet-500 text-white col-8 mt-5 p-2 rounded-3 fs-5"
                  type="button"
                  onClick={handleAuth}
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
