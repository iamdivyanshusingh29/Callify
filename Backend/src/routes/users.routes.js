import { Router } from "express";
import { addHistory, getUserHistory, signin, signup } from "../controllers/user.controller.js";
import { authMiddlewareGET , authMiddlewareADD } from "../Utils/middleware.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.post("/addHistory" , authMiddlewareADD , addHistory);
router.get("/userHistory" , authMiddlewareGET , getUserHistory);

export default router;