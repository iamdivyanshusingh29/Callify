import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import TextField from "@mui/material/TextField";

import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../Context/AuthContext";

export default function JoinMeeting() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state || null;
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const { handleAddHistory } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleMeeting = async () => {
    if (code !== null) {
      if (localStorage.getItem("token")) {
        try {
          let result = await handleAddHistory(code);
          console.log(result);
          navigate(`/meeting/${code}`, { state: { username: username } });
        } catch (e) {
          console.log(e);
        }
      } else {
        navigate(`/meeting/${code}`);
      }
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
              onClick={() => (username ? navigate("/home", { state: { username: username } }) : navigate("/"))}
            >
              <ArrowBackIosIcon fontSize="inherit" sx={{ color: "#a78bfa" }} />
            </IconButton>
          </div>
          <div className="mt-2 mx-auto">
            <h2 className="text-center pe-5" style={{ color: "#a78bfa" }}>
              Join
            </h2>
          </div>
        </nav>
        <main className="bg-black bg-gradient relative h-screen w-screen">
          <div className="container">
            <div className="row mx-2">
              <form className="row g-3 needs-validation" noValidate>
                <label
                  for="pasOfMeet"
                  className="form-label text-violet-500 text-xl"
                >
                  Protect your meeting with a password
                </label>
                <div className="mt-3 mb-5">
                  <TextField
                    type="number"
                    label="Code"
                    variant="filled"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
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
                  />
                </div>
                <button
                  className="bg-violet-500 text-white col-8 mt-5 p-2 rounded-3 fs-5"
                  type="button"
                  onClick={handleMeeting}
                >
                  Start Meeting
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
