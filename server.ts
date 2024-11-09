import express, { urlencoded } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { default as apiRoutes } from './src/routes';

const PORT = process.env.PORT || 3000;

const app = express();

// cors
app.use(
    cors({
        origin: `https://${process.env.CLIENT_DOMAIN}`,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
