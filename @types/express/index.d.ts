import * as express from 'express';
import { type User } from '../../src/lib/types';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
