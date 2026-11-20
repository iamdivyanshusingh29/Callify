import { Link, useNavigate } from "react-router-dom";
import Groups3Icon from "@mui/icons-material/Groups3";
import ShinyText from "../../../Mobile/components/Home/Animation/ShinyText";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";

export default function UserNavbar({ username }) {
  let navigate = useNavigate();
  let handleNav = () => {
    navigate("/home", {
      state: { username: username },
    });
  };
  let handleHistory = () => {
    navigate("/home/history", {
      state: { username: username },
    });
  }

  return (
    <nav className="navbar mt-3 rounded-full bg-white/10 backdrop-blur-sm">
      <div className="container-fluid">
        <IconButton
          onClick={handleNav}
          className="navbar-brand fs-4"
          style={{ color: "#5B23FF", cursor: "pointer" }}
        >
          <Groups3Icon fontSize="large" className="pb-1 mx-2" />
          <ShinyText
            text="Callify"
            speed={2}
            delay={0}
            color="#5B23FF"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </IconButton>
        <div className="d-flex gap-5">
          <IconButton style={{ color: "#5B23FF" }} onClick={handleHistory}>
            <HistoryToggleOffIcon fontSize="large" />
            <p className="m-0 p-0 ms-2">History</p>
          </IconButton>
          <IconButton
            style={{ color: "#5B23FF" }}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            <LogoutIcon fontSize="large" />
            <p className="m-0 p-0 ms-2">Logout</p>
          </IconButton>
        </div>
      </div>
    </nav>
  );
}
