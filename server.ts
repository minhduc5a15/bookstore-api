import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { default as apiRoutes } from './src/routes';

const PORT = process.env.PORT || 3000;

const app = express();

export const isProduction = process.env.NODE_ENV === 'production';
export const domain = isProduction ? `${process.env.CLIENT_DOMAIN}` : 'test-localhost';
export const corsOptions = {
    origin: isProduction ? `https://${domain}` : 'http://test-localhost:5173',
    credentials: true,
};

// cors
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use((req, res, next) => {
    const yellow = '\x1b[33m';
    const blue = '\x1b[34m';
    const pink = '\x1b[35m';
    const reset = '\x1b[0m';

    console.log(`${yellow}[${req.method}]${reset} ${blue}${req.originalUrl}${reset} at ${pink}${new Date()}${reset}`);
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
