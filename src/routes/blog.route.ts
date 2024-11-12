import { Router } from 'express';
import { getDb } from '../lib/db';

const router = Router();

// [GET] /api/blogs
router.get('/blogs', async (req, res) => {
    const db = await getDb();
    if (!db) {
        return res.status(500).send('Error connecting to database');
    }
    try {
        const blogs = await db.collection('blogs').find().toArray();

        return res.json(blogs);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error getting blogs' });
    }
});

router.post('/blogs', async (req, res) => {
    const db = await getDb();
    if (!db) {
        return res.status(500).send('Error connecting to database');
    }
    const { title, content, author } = req.body;
    try {
        await db.collection('blogs').insertOne({ title, content, author, createdAt: new Date() });
        return res.status(200).json({ message: 'Blog created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating blog' });
    }
});

export default router;
