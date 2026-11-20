import ReflectiveCard from "./Animation/ReflectiveCard";
import Navbar from "../Navbar";
import Footer from "../Footer";
import RotatingText from "./Animation/RotatingText";
import PasswordIcon from "@mui/icons-material/Password";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import UserNavbar from "../LandingForUser/UserNavbar";
import { useContext } from "react";
import { AuthContext } from "../../../../Context/AuthContext";

export default function Body() {
  const location = useLocation();
  const user = location.state || null;
  let router = useNavigate();
  let [User, setUser] = useState(false);
  let [username, setUsername] = useState("");
  let [meetingCode, setMeetingCode] = useState("");
  const { handleAddHistory } = useContext(AuthContext);

  let handleVideoCallCode = async () => {
    if (meetingCode !== "") {
      if (localStorage.getItem("token")) {
        try {
          let result = await handleAddHistory(meetingCode);
          console.log(result);
          router(`/meeting/${meetingCode}` , {state : { username : username }});
        } catch (e) {
          console.log(e);
        }
      } else {
        router(`/meeting/${meetingCode}`);
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUser(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    } else {
      setUsername("GUEST");
    }
  }, [user]);

  return (
    <>
      <div className="h-screen w-screen bg-black m-0 p-0">
        <div className="container bg-black">
          <div className="row">
            {User ? <UserNavbar username={username} /> : <Navbar />}
            <div className="col-6 mt-5 pt-5">
              <h1 className="mt-5">
                <div className="flex justify-center gap-0">
                  <div className="w-40 mx-0 text-center text-6xl text-violet-500">
                    Start
                  </div>
                  <div className="w-40 mx-0">
                    <RotatingText
                      texts={["Now!", "Meeting", "Talking", "Chatting"]}
                      mainClassName="px-2 sm:px-2 md:px-3 bg-violet-500 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg w-70 display-block"
                      staggerFrom={"last"}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-120%" }}
                      staggerDuration={0.025}
                      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                      transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 400,
                      }}
                      rotationInterval={2000}
                    />
                  </div>
                </div>
              </h1>
              <div className="row">
                <div className="col-2"></div>
                <div className="my-5 col-8 py-2">
                  <form className="row g-3 needs-validation" noValidate>
                    <label
                      for="floatingInputGroup2"
                      className="form-label text-violet-500 text-xl"
                    >
                      Protect your meeting with a password
                    </label>
                    <div className="input-group position-relative mb-5">
                      <span className="input-group-text p-3">
                        <PasswordIcon />
                      </span>
                      <div className="form-floating is-invalid">
                        <input
                          type="text"
                          className="form-control"
                          id="floatingInputGroup2"
                          placeholder="Password"
                          value={meetingCode}
                          onChange={(e) => setMeetingCode(e.target.value)}
                          required
                        />
                        <label for="floatingInputGroup2">Meeting Code</label>
                      </div>
                      <div className="invalid-tooltip">Enter Meeting Code</div>
                    </div>
                    <button
                      className="bg-violet-500 text-black col-5 mt-5 p-2 rounded-3 fs-5"
                      type="button"
                      onClick={handleVideoCallCode}
                    >
                      Start Meeting
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-6 d-flex justify-content-end align-items-center mt-5 pt-5">
              <div style={{ height: "600px" }}>
                <ReflectiveCard
                  overlayColor="rgba(0, 0, 0, 0.2)"
                  blurStrength={3}
                  glassDistortion={30}
                  metalness={1}
                  roughness={0.75}
                  displacementStrength={20}
                  noiseScale={1}
                  specularConstant={5}
                  grayscale={0.15}
                  color="#ffffff"
                  Client={username}
                  code={meetingCode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
