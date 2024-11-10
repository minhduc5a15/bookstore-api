import express, { urlencoded } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { default as apiRoutes } from './src/routes';

const PORT = process.env.PORT || 3000;

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

// cors
app.use(
    cors({
        origin: isProduction ? `https://${process.env.CLIENT_DOMAIN}` : 'http://127.0.0.1:5501',
        credentials: true,
    }),
);

// body parser
app.use(express.json());

// Middleware
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
    }),
);

// API
app.use("/api", apiRoutes);
app.get('/', (req, res) => {
    return res.send('hello world');
});

// Start server
const server = http.createServer(app);

export const io = new Server(server);

server.listen(PORT, async () => {
    // await connectDb();
    console.log(`[SERVER] ${new Date()} started on port ${PORT}`);
});

export default app;
