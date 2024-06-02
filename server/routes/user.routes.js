import {Router} from "express"
import { register,login, logout, getProfile } from "../controllers/user.controller.js";
// import upload from "../middlewares/multer.middlewares.js";

import multer from "multer";

const upload = multer();

const router = Router()

// router.post("/register", upload.single("avatar"), register);


router.route("/register").post(upload.none(), register);

router.post("/login",login);
router.get('/logout', logout);
router.get('/me', getProfile);

export default router;