import { Router } from "express";
import upload from "../middleware/multer.middleware.js"
import Verifyjwt from "../middleware/auth.middleware.js"

import { RegisterUser,loginUser,logoutUser,GetCurrentUser,addMoney} from "../controllers/user.controller.js";

const router = Router();

router.route("/resigter").post(
    upload.fields([
        {
            name : "photo",
            maxCount : 1
        }
    ]),RegisterUser

)

router.route("/login").post(loginUser);
router.route("/GetCurrentUser").get(Verifyjwt,GetCurrentUser);
router.route("/logout").post(Verifyjwt,logoutUser)
router.route("/addMoney").post(Verifyjwt,upload.none(),addMoney)





export default router;

