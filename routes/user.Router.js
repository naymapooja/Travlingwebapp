import { Router } from "express";
import { SignUp, verifyEmail, resendEmail, Login,logout} from "../controller/user.Controller.js"
import { planATour, updateTour, imagesUpload, searchTour } from "../controller/tour.Controller.js";
import upload from "../middleware/multer.Middleware.js";
import authMiddleware from "../middleware/authMiddle.js";
const router = Router();
router.route("/").post(SignUp)
router.route("/Login").post(Login)
router.route("/verifyEmail").post(verifyEmail)
router.route("/resendEmail").post(resendEmail)
router.route("/Logout").post(logout)
router.route("/planATour").post(planATour)       
router.route("/updateTour").post(updateTour)
router.route("/searchTour").post(searchTour)
router.route("/:tourId/images/upload").post(authMiddleware, upload.array("images"), imagesUpload)
export default router;

