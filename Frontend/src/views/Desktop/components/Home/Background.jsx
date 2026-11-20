import Antigravity from "./Animations/Antigravity";
import Navbar from "../Navbar";
import Footer from "../Footer";
import Button from "@mui/material/Button";
import TextType from "./Animations/TextType";
import { useNavigate } from "react-router-dom";

const texts = [
  "Welcome to Callify! Good to see you!",
  "Build some amazing meeting experiences!",
];

export default function Background() {
  const navigate = useNavigate();

  return (
    <>
      <div className="w-screen h-screen bg-black">
        <Navbar />
        <div
          className="d-grid place-items-center absolute inset-0 z-0 fs-1 fw-bold text-center"
          style={{ color: "#5B23FF" }}
        >
          <TextType
            texts={texts}
            text={texts}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            variableSpeedEnabled={false}
            variableSpeedMin={60}
            variableSpeedMax={120}
            cursorBlinkDuration={0.5}
            className="p-0 m-0"
          />
        </div>
        <div className="mt-5 pt-5 container">
          <div className="row pt-5 mt-5">
            <div className="col-5"></div>
            <div className="col-2 mt-5 pt-5">
              <div className="my-5"></div>
              <Button
                variant="outlined"
                color="error"
                size="large"
                onClick={() => navigate("/signup")}
                sx={{ cursor: "pointer" }}
                className="relative z-20 mt-5 relative z-20
    transition-all duration-300 ease-out
    hover:scale-105
    hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]
    active:scale-95"
              >
                Get Start
              </Button>
            </div>
            <div className="col-5"></div>
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <Antigravity
            count={300}
            magnetRadius={5}
            ringRadius={5}
            waveSpeed={0.4}
            waveAmplitude={1}
            particleSize={1.4}
            lerpSpeed={0.05}
            color="#5227FF"
            autoAnimate
            particleVariance={1}
            rotationSpeed={0}
            depthFactor={1}
            pulseSpeed={3}
            particleShape="sphere"
            fieldStrength={5.5}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
