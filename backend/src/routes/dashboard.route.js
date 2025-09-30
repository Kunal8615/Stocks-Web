import { Router } from "express";

import Verifyjwt from "../middleware/auth.middleware.js"

import {invested ,returns,current_value,wallet_balance}from "../controllers/dashboard.controller.js"

const router = Router();



router.route("/invested").get(Verifyjwt,invested);
router.route("/returns").get(Verifyjwt,returns);
router.route("/current_value").get(Verifyjwt,current_value);
router.route("/wallet_balance").get(Verifyjwt,wallet_balance);



export default router;

