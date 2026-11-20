import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";
import Image from "../../../../assets/HistoryImage.png";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../../../../Context/AuthContext";

export default function History() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const user = location.state || null;
  const { handleGetHistory } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState("");
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  });

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
      <div className="bg-black h-screen w-screen">
        <nav className="Fixed top-0 pt-2 d-flex">
          <div className="mb-1">
            <IconButton
              aria-label="BackWard"
              size="large"
              onClick={() =>
                navigate("/home", {
                  state: {
                    username: username,
                  },
                })
              }
            >
              <ArrowBackIosIcon fontSize="inherit" sx={{ color: "#a78bfa" }} />
            </IconButton>
          </div>
          <div className="mt-2 mx-auto">
            <h2 className="text-center pe-5" style={{ color: "#a78bfa" }}>
              History
            </h2>
          </div>
        </nav>
        <main className="bg-black bg-gradient relative h-screen w-screen">
          <div className="container">
            <div className="col-12 z-20 mb-5">
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
                          className="my-4 d-flex align-content-center align-items-center"
                          key={index}
                        >
                          <CardMedia
                            component="img"
                            sx={{ width: 100 }}
                            image={Image}
                            alt="Image"
                          />
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <CardContent
                              sx={{ flex: "1 0 auto" }}
                              style={{ height: 130 }}
                            >
                              <Typography
                                component="div"
                                variant="h5"
                                style={{ color: "white" }}
                              >
                                Meeting
                              </Typography>
                              <Typography
                                variant="p"
                                component="div"
                                sx={{ color: "#5B23FF" }}
                              >
                                Meeting Code : &nbsp;
                                <span className="text-white">
                                  {ele.meetingCode}
                                </span>
                              </Typography>
                              
                                <div className="col-12 m-0 p-0">
                                  <Typography
                                    variant="p"
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
                                <div className="col-12 m-0 p-0">
                                  <Typography
                                    variant="p"
                                    component="div"
                                    sx={{ color: "#5B23FF" }}
                                  >
                                    Time : &nbsp;
                                    <span className="text-white">
                                      {new Date(ele.date).toLocaleTimeString(
                                        "en-IN",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        },
                                      )}
                                    </span>
                                  </Typography>
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
        </main>
      </div>
    </>
  );
}
