import { Router } from "express";

const router = Router()

router.all('*', (req, res, next) => {
    return res.status(404).json({ status: false, message: 'resource not found on server' })
})

export default router