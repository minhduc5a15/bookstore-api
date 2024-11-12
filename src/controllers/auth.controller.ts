import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb } from '../lib/db';

const JWT_SECRET = process.env.JWT_SECRET;

export const handleSignUp = async (req: Request, res: Response) => {
    const { username, password, email } = req.body;
    console.log({
        username,
        password,
        email,
    });
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        username,
        password: hashedPassword,
        email,
    };

    const db = await getDb();
    if (!db) {
        return res.status(500).json({ message: 'Error connecting to db' });
    }

    const existingUsername = await db.collection('users').findOne({ username });
    if (existingUsername) {
        return res.status(409).json({ message: 'Username already exists' });
    }
    const existingEmail = await db.collection('users').findOne({ email });
    if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists' });
    }
    try {
        await db.collection('users').insertOne(newUser);
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating user' });
    }
};

// handle [POST] /api/auth/sign-in
export const handleSignIn = async (req: Request, res: Response) => {
    const { email, password } = await req.body;

    if (!JWT_SECRET) {
        return res.status(500).json({ message: 'JWT_SECRET is not set' });
    }

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const db = await getDb();
    if (!db) {
        return res.status(500).json({ message: 'Error connecting to db' });
    }

    const user = await db.collection('users').findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: 'Username or password is incorrect' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Username or password is incorrect' });
    }

    const { password: hashedPassword, ...userData } = user;
    const token = jwt.sign({ ...userData }, JWT_SECRET, { expiresIn: '1d' });

    return res.setHeader('Set-Cookie', `authToken=${token}; Max-Age=86400; SameSite=None; Secure`).json({
        message: 'Sign in successful',
        user: { ...userData, token },
        token,
    });
};

// handle [POST] /api/auth/sign-out
export const handleSignOut = async (req: Request, res: Response) => {
    req.user = undefined;
    req.token = undefined;
    return res
        .clearCookie('authToken', {
            sameSite: 'none',
            secure: true,
            httpOnly: true,
        })
        .json({ message: 'Sign out successful' });
};

// handle [GET] /api/auth/me

// export const handleMe = async (req: Request, res: Response) => {
//     return res.status(200).json(req.user);
// };
