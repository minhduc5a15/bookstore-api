import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { default as apiRoutes } from './src/routes';

const PORT = process.env.PORT || 3000;

const app = express();

export const isProduction = process.env.NODE_ENV === 'production';

export const domain = isProduction ? `${process.env.CLIENT_DOMAIN}` : '127.0.0.1';

// cors
app.use(cookieParser());
app.use(
    cors({
        origin: isProduction ? `https://${process.env.CLIENT_DOMAIN}` : 'http://127.0.0.1:5501',
        credentials: true,
    }),
);

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.on('finish', () => {
        const setCookieHeader = res.getHeader('Set-Cookie');
        if (setCookieHeader) {
            console.log('Set-Cookie header:', setCookieHeader);
        }
    });
    next();
});

app.use('/api', apiRoutes);
app.get('/', (req, res) => {
    return res.send('hello world');
});

app.listen(PORT, () => {
    console.log(`[SERVER] ${new Date()} started on port ${PORT}`);
});

export default app;
