import { Router } from 'express';
import { create, list, update, remove } from '../controllers/posts.js';

const router = Router();
router.post('/create', create);
router.get('/getPosts', list);
router.patch('/update/:id', update);
router.delete('/delete/:id', remove);
export default router;
