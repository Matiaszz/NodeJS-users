import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

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


// login
router.post('/login', async (req, res) => {
    try {
        const login = req.body;

        const condition = {
            // email == login.email
            email: login.email
        }

        const user = await prisma.user.findUnique({ where: condition });

        if (!user) {
            return res.status(404).json({ message: "User not found on login." });
        }

        const isCorrectPassword = await bcrypt.compare(login.password, user.password);

        if (!isCorrectPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // generate 

        const secret = process.env.JWT_SECRET;
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        const jwtToken = jwt.sign(payload, secret, { expiresIn: '1m' });



        res.status(200).json(jwtToken);

    } catch (err) {
        res.status(500).json({ message: "Internal server error on user login." });
    }
})


// Services
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