import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import Verifyjwt from "../middleware/auth.middleware.js";
import { createStock, buy_stock,update_stock ,getStockDetail,getAllStocks,searchStock} from "../controllers/stock.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.use(Verifyjwt, upload.none());

router.post("/createStock", createStock);
router.post("/buyStock", buy_stock);
router.post("/update_stock", update_stock);
router.get("/getStockDetail", getStockDetail);
router.get("/getAllStocks", getAllStocks);
router.get("/searchStock",verifyJWT, searchStock);




export default router;