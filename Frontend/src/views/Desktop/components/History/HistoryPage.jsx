import react, { useContext } from "react";
import { useEffect, useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import ShinyText from "../../../Mobile/components/Home/Animation/ShinyText";
import Box from "@mui/material/Box";
import Image from "../../../../assets/HistoryImage.png";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Footer from "../Footer";
import { AuthContext } from "../../../../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const location = useLocation();
  const user = location.state || null;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { handleGetHistory } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState("");
  const router = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, []);

  let handleHome = () => {
    console.log(username);
    router("/home", {
      state: { username: username },
    });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await handleGetHistory();
        setMeetings(history);
      } catch (e) {
        setError(e);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <div className="h-screen w-screeen bg-black px-2 py-3">
        <div className="h-fit w-fit rounded-full p-2 bg-white">
          <IconButton style={{ color: "#5B23FF" }} onClick={handleHome}>
            <ReplyAllIcon fontSize="large" />
          </IconButton>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p className="fs-1 fw-bolder">
                <ShinyText
                  text="HISTORY"
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
              </p>
              <div
                className="w-full h-[4px] bg-violet-500 rounded-full 
shadow-[0_0_25px_6px_rgba(139,92,246,0.8)]
animate-pulse"
              ></div>
            </div>
            <div className="col-12 z-20 mb-5">
              <div
                ref={ref}
                className={`mx-3 my-2 overflow-y-auto overflow-x-hidden scolling-bar-hide scroll-smooth transition-all duration-700 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ height: "550px", width: "auto" }}
              >
                {console.log(meetings)}
                {meetings == null ? (
                  <></>
                ) : (
                  meetings.map((ele, index) => {
                    return (
                      <Card
                        sx={{
                          display: "flex",
                          backgroundColor: "black",
                          border: "2px solid #5B23FF",
                          borderRadius: "25px",
                        }}
                        className="my-4"
                        key={index}
                      >
                        <CardMedia
                          component="img"
                          sx={{ width: 200 }}
                          image={Image}
                          alt="Image"
                        />
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <CardContent sx={{ flex: "1 0 auto" }} style={{ width: 550}}>
                            <Typography
                              component="div"
                              variant="h2"
                              style={{ color: "white", marginBottom: "25px" }}
                            >
                              Meeting
                            </Typography>
                            <Typography
                              variant="h5"
                              component="div"
                              sx={{ color: "#5B23FF" }}
                              className="py-2"
                            >
                              Meeting Code : &nbsp;
                              <span className="text-white">
                                {ele.meetingCode}
                              </span>
                            </Typography>
                            <div className="row m-0 p-0">
                              <div className="col-6 m-0 p-0">
                                <Typography
                                  variant="h5"
                                  component="div"
                                  sx={{ color: "#5B23FF" }}
                                >
                                  Date : &nbsp;
                                  <span className="text-white">
                                    {new Date(ele.date).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      },
                                    )}
                                  </span>
                                </Typography>
                              </div>
                              <div className="col-6 m-0 p-0">
                                <Typography
                                  variant="h5"
                                  component="div"
                                  sx={{ color: "#5B23FF" }}
                                >
                                  Time : &nbsp;
                                  <span className="text-white">
                                    {new Date(ele.date).toLocaleTimeString(
                                      "en-IN",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      },
                                    )}
                                  </span>
                                </Typography>
                              </div>
                            </div>
                          </CardContent>
                        </Box>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
