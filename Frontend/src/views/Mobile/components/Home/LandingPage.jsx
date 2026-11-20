import ShinyText from "./Animation/ShinyText";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-screen h-screen d-grid place-items-center bg-black">
        <div className="text-5xl text-center fw-bold p-5 my-5 h-[60vh] fixed top-0">
          <br />
          <ShinyText
            text="Welcome to Callify"
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
                  onClick={()=>navigate("/meeting")}
                >
                  Join a meeting
                </button>
              </div>
              <div className="col-12">
                <button
                  className="col-12 btn fs-4 my-2"
                  style={{ color: "#a78bfa", backgroundColor: "#827f7f6e" }}
                  onClick={()=>navigate("/signup")}
                >
                  Sign up
                </button>
              </div>
              <div className="col-12">
                <button
                  className="col-12 btn fs-4 my-2"
                  style={{ color: "#a78bfa" , backgroundColor: "#827f7f6e"}}
                  onClick={()=>navigate("/signin")}
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
