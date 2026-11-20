import { Routes , Route } from "react-router-dom";
import LandingPage from "./components/Home/LandingPage";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import JoinMeeting from "./components/Join/JoinMeeting";
import Meeting from "./components/Meeting/Meeting";
import PageNotFound from "./components/PageNot/PageNotFound";
import HomePageUser from "./components/LandingPage/home";
import History from "./components/History/history"

export default function MobileScreen() {
    return (
        <Routes>
            <Route index path="/" element={<LandingPage />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/signin" element={<SignIn />}/>
            <Route path="/meeting" element={<JoinMeeting />}/>
            <Route path="/meeting/:url" element={<Meeting />}/>
            <Route path="/home" element={<HomePageUser />}/>
            <Route path="/home/history" element={<History />}/>
            <Route path="/*" element={<PageNotFound />}/>
        </Routes>
    );
}