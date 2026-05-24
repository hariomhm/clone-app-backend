import { Router } from "express";
import {loginUser, logOutUser, registerUser} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"
import { authJWT } from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/register").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]),registerUser)

router.route("/login").post(loginUser);



// authentication

router.route("/logout").post(authJWT, logOutUser);

export default router;