import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({ omit: { password: true } });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Internal server error on user listing." });
    }

})

router.get(`/user/:id`, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await prisma.user.findUnique({ where: { id: userId }, omit: { password: true } })
        return res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ message: "Internal server error on user listing." });

    }
})

export default router;