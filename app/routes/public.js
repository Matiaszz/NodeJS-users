import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';



const prisma = new PrismaClient();
const router = express.Router();


// register
router.post('/register', async (req, res) => {
    try {
        const user = req.body;

        const encryptedPassword = await encryptPassword(user.password);

        const data = await createUserDB(user, encryptedPassword);
        res.status(201).json(data);

    } catch (err) {
        res.status(500).json({ message: "Internal server error on user registering." });
    }
});



async function createUserDB(user, encryptedPassword) {

    const data = {
        email: user.email,
        name: user.name,
        password: encryptedPassword

    }

    await prisma.user.create({
        data
    })
    return data;
}


async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
}

export default router;