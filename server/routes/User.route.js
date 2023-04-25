import { Router } from "express";
import { createUser, getUserProfile } from "../controllers/users.controlller.js";
import { verifyToken } from "../middlewares/verifyJwt.js";

const router = Router()

router.post('/', createUser)
router.get('/me', verifyToken, getUserProfile)

export default router