import { Router } from "express";
import { createAuction, getAllAuctions, getSingleAuction, placeBid } from "../controllers/auction.controller.js";
const router = Router()

router.get('/', getAllAuctions)
router.post('/', createAuction)
router.get('/:id', getSingleAuction)
router.put('/', placeBid)

export default router