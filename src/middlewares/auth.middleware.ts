import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../lib/types';

if (!process.env.JWT_SECRET) {
    throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
}

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as User;
        req.user = decoded;
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default authMiddleware;
