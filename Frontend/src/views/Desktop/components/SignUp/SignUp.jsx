import Navbar from "../Navbar";
import Footer from "../Footer";
import LightRays from "./Animation/LightRays";
import Box from "./Box";

export default function SignIn() {
  return (
    <>
      <div className="h-screen w-screen bg-black">
        <Navbar />
        <div className="grid place-items-center absolute z-10 w-full h-full">
            <Box />
        </div>
        <div className="absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
