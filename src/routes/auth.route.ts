import express, { Request, Response } from 'express';
import { handleSignIn, handleSignUp, handleSignOut } from '../controllers/auth.controller';
import { type User } from '../lib/types';
import authMiddleware from '../middlewares/auth.middleware';


const router = express.Router();

declare global {
    namespace Express {
        interface Request {
            user?: User;
            token?: string;
        }
    }
}

// [POST] /api/auth/sign-in
router.post('/auth/sign-in', handleSignIn);

// [GET] /api/auth/sign-in
router.get('/auth/sign-in', (req: Request, res: Response) => {
    res.json({ message: req.user });
});

// [POST] /api/auth/sign-up
router.post('/auth/sign-up', handleSignUp);

// [POST] /api/auth/logout
router.post('/auth/sign-out', handleSignOut);

// [POST] /api/auth/jwt
router.post('/auth/verify', authMiddleware, (req, res) => {
    // Các route tiếp theo có thể truy cập req.user
    res.json({ message: 'Authorized', success: true });
});

// [GET] /api/auth/me
router.get('/auth/me', authMiddleware, (req: Request, res: Response) => {
    return res.json({
        currentUser: req.user,
    });
});

// [POST] /api/auth/me
router.post('/auth/me', authMiddleware, (req: Request, res: Response) => {
    if (req.user) {
        return res.status(200).json({
            user: req.user,
        });
    }

    return res.status(401).json({ message: 'Unauthorized' });
});

export default router;
