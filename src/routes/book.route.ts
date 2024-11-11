import { Router } from 'express';
import { getDb } from '../lib/db';
const router = Router();

// [GET] /api/books
router.get('/books', async (req, res) => {
    const db = await getDb();
    if (!db) {
        return res.status(500).send('Error connecting to database');
    }
    const books = await db.collection('books').find().toArray();
    return res.json(books);
});

// [GET] /api/books/:bookId
router.get('/books/:bookId', async (req, res) => {
    const db = await getDb();
    if (!db) {
        return res.status(500).send('Error connecting to database');
    }
    try {
        const book = await db.collection('books').findOne({ id: req.params.bookId });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.json(book);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error getting book', error });
    }
});

export default router;
