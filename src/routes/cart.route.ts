import { Router } from 'express';
import { getDb } from '../lib/db';

const router = Router();
// [POST] /api/carts
router.post('/carts', async (req, res) => {
    const db = await getDb();
    if (!db) {
        return res.status(500).send('Error connecting to database');
    }

    const { id } = req.body;
    console.log('id', id);
    const email = req.user?.email;

    try {
        const user = await db.collection('carts').findOne({ email });
        const book = await db.collection('books').findOne({ id });

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!user) {
            // Nếu user chưa có giỏ hàng
            await db.collection('carts').insertOne({
                email,
                carts: [
                    {
                        ...book,
                        quantity: 1,
                    },
                ],
            });
        } else {
            // Kiểm tra nếu sách đã có trong giỏ hàng dựa vào id
            const existingCartItem = user.carts.find((cartItem: { id: any }) => cartItem.id === book.id);

            if (existingCartItem) {
                // Tăng quantity nếu sách đã tồn tại trong giỏ hàng
                await db.collection('carts').updateOne({ email, 'carts.id': book.id }, { $inc: { 'carts.$.quantity': 1 } });
            } else {
                // Thêm sách mới vào giỏ hàng nếu sách chưa có
                await db.collection('carts').updateOne(
                    { email },
                    {
                        $addToSet: {
                            carts: {
                                ...book,
                                quantity: 1,
                            },
                        },
                    },
                );
            }
        }

        return res.status(200).json({ message: 'Book added to cart' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding book to cart' });
    }
});

// [GET] /api/carts
router.get('/carts', async (req, res) => {
    const db = await getDb();
    if (!db) {
        return res.status(500).send('Error connecting to database');
    }
    const email = req.user?.email;

    try {
        const user = await db.collection('carts').findOne({ email });
        if (!user) {
            return res.status(200).json([]);
        }
        return res.status(200).json(user.carts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error getting cart' });
    }
});

// [DELETE] /api/carts
router.delete('/carts', async (req, res) => {
    const db = await getDb();
    if (!db) {
        return res.status(500).send('Error connecting to database');
    }
    const { id } = req.body;
    console.log('id', id);
    const email = req.user?.email;
    try {
        const user = await db.collection('carts').findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        await db.collection('carts').updateOne({ email }, { $pull: { carts: { id } as any } });
        return res.status(200).json({ message: 'Book removed from cart' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error removing book from cart' });
    }
});

router.patch('/carts/:id', async (req, res) => {
    const db = await getDb();
    if (!db) {
        return res.status(500).send('Error connecting to database');
    }
    const { id } = req.params;
    const { quantity } = req.body;
    const email = req.user?.email;
    try {
        const user = await db.collection('carts').findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        await db.collection('carts').updateOne({ email, 'carts.id': id }, { $set: { 'carts.$.quantity': quantity } });
        return res.status(200).json({ message: 'Book quantity updated in cart' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating book quantity in cart' });
    }
});

export default router;
