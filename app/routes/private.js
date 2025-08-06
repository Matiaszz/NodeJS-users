import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({ omit: { password: true } });
        res.status(200).json(users);
        console.log(req.userId);
        console.log(req.userName);
        console.log(req.userEmail);




    } catch (err) {
        res.status(500).json({ message: "Internal server error on user listing." });
    }

})

export default router;