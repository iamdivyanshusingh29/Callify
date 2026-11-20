import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../../../../Utils/Auth";

import ShinyText from "../Home/Animation/ShinyText";
import Button from "@mui/material/Button";

function HomeUser() {
  const location = useLocation();
  const user = location.state || null;
  const [username, setUsername] = useState("");
  let router = useNavigate();

  let meetingPage = async () => {
    router("/meeting", {
      state: { username: username },
    });
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  return (
    <>
      <div className="w-screen h-screen d-grid place-items-center bg-black">
        <div className="absolute z-50 h-screen top-3 right-5 p-2">
          <Button
            variant="text"
            onClick={() => {
              localStorage.removeItem("token");
              router("/");
            }}
          >
            <p style={{color: "#a78bfa"}} className="text-decoration-underline">LOGOUT</p>
          </Button>
        </div>
        <div className="text-5xl text-center fw-bold p-5 my-5 h-[60vh] fixed top-0">
          <br />
          <ShinyText
            text={`Hi , ${username}`}
            speed={2}
            delay={0}
            color="#a78bfa"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </div>
        <div className="border-t-4 rounded-t-2xl mt-5 p-0 bg-white mb-0 fixed bottom-0 h-[40vh]">
          <div className="container mt-0 pt-0">
            <div className="row text-center mt-0">
              <h4 style={{ color: "#a78bfa" }} className="my-4">
                Get started with your account
              </h4>
              <div className="col-12">
                <button
                  className="col-12 btn text-light fs-4 my-2"
                  style={{ backgroundColor: "#a78bfa" }}
                  onClick={() => router("/meeting" , { state : {username : username} })}
                >
                  Re-Join
                </button>
              </div>
              <div className="col-12">
                <button
                  className="col-12 btn fs-4 my-2"
                  style={{ color: "#a78bfa", backgroundColor: "#827f7f6e" }}
                  onClick={() => router("/home/history" , { state : {username : username} })}
                >
                  History
                </button>
              </div>
              <div className="col-12 fw-bolder text-3xl pt-2">
                <ShinyText
                  text={`Callify`}
                  speed={2}
                  delay={0}
                  color="#a78bfa"
                  shineColor="#ffffff"
                  spread={120}
                  direction="left"
                  yoyo={false}
                  pauseOnHover={false}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth(HomeUser);
