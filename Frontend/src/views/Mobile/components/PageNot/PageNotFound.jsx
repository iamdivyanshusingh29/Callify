import ShinyText from "../Home/Animation/ShinyText";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div className="h-screen w-screen d-grid place-items-center bg-black">
        <div className="text-5xl text-center fw-bold">
          <ShinyText
            text="404 Page Not Found"
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
          <button
            className="btn mt-4"
            style={{ backgroundColor: "#a78bfa" }}
            onClick={() => navigate("/")}
          >
            Go Back
          </button>
        </div>
      </div>
    </>
  );
}
