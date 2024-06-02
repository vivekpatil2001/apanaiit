import {Router} from "express"
import { register,login, logout, getProfile } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middlewares.js";

const router = Router()

router.post("/register", upload.single("avatar"), register);
router.post("/login",login);
router.get('/logout', logout);
router.get('/me', getProfile);

export default router;

