import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import Groups3Icon from "@mui/icons-material/Groups3";
import ShinyText from "../../Mobile/components/Home/Animation/ShinyText";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <>
      <div className="container relative z-20">
        <div className="row">
          <nav className="navbar mt-3 px-5 rounded-full bg-white/10 backdrop-blur-sm">
            <div className="container-fluid">
              <Link
                to={"/"}
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
              </Link>
              <div className="d-flex gap-4">
                <Button
                  variant="outlined"
                  onClick={() => navigate("/meeting")}
                  color="error"
                  className="animate-pulse
    hover:animate-none
    hover:scale-110
    transition-transform"
                >
                  Guest
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/signin")}
                  color="error"
                  className="animate-pulse
    hover:animate-none
    hover:scale-110
    transition-transform"
                >
                  Sign In
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/signup")}
                  color="error"
                  className="animate-pulse
    hover:animate-none
    hover:scale-110
    transition-transform"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
