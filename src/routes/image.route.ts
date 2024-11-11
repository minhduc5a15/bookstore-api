import { Router } from 'express';
import cloudinary from '../lib/cloud';
import axios from 'axios';

const router = Router();

router.get('/image/:filename', async (req, res) => {
    const { filename } = req.params;
    try {
        const imageUrl = cloudinary.url(filename, {
            fetch_format: 'auto',
            quality: 'auto',
            secure: false,
        });

        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        });
        const contentType = response.headers['content-type'];
        res.set('Content-Type', contentType);
        res.send(response.data);
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).json({ error: 'Failed to retrieve image' });
    }
});

export default router;
