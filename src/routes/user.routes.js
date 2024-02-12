import { Router } from "express";
import { addToWatchList, getWatchList, loginUser, logoutUser, registerUser, removeFromWatchList } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser)
router.route('/add-to-watchlist').post(verifyJWT, addToWatchList);
router.route('/remove-from-watchlist').post(verifyJWT, removeFromWatchList);
router.route('/watchlist').get(verifyJWT, getWatchList);


export default router