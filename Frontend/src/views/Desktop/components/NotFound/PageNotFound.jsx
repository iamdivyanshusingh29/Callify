import Navbar from "../Navbar";
import Footer from "../Footer";
import ASCIIText from "./Animation/ASCIIText";

export default function PageNotFound() {
  return (
    <>
      <div className="h-screen w-screen bg-black">
        <Navbar />
        <div
          className="d-flex justify-content-center absolute inset-0 z-0"
          sx={{ width: "50%" }}
        >
            <ASCIIText
              text="Oops! 404"
              enableWaves
              asciiFontSize={8}
              texts="Hey!"
            />
        </div>
      </div>
      <Footer />
    </>
  );
}
