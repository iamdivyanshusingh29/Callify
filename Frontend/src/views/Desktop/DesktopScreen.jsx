import { Routes , Route } from "react-router-dom"; 

import LandingPage from "./components/Home/HomePage";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import VideoCallPage from "./components/Call/VideoCallPage";
import CreateMeeting from "./components/CreateMeeting/CreateMeeting";
import PageNotFound from "./components/NotFound/PageNotFound";
import User from "./components/LandingForUser/UserHome";
import HistoryPage from "./components/History/HistoryPage";

export default function DesktopScreen() {
    return (
        <Routes>
            <Route index path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/meeting" element={<CreateMeeting />} />
            <Route path='/meeting/:url' element={<VideoCallPage />} />
            <Route path="/home" element={<User />} />
            <Route path="/home/history" element={<HistoryPage />} />
            <Route path="/*" element={<PageNotFound />} />
        </Routes>
    )
}