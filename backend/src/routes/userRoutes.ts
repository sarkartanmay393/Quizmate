import { Router } from 'express';
import { createUser, loginUser } from '../controllers/userController';

const router = Router();

router.post('/createUser', createUser);
router.post('/login', loginUser);

export default router;
