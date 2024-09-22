import { Router } from 'express';
import { createUser, loginUser, getUserNameById } from '../controllers/userController';

const router = Router();

router.post('/createUser', createUser);
router.post('/login', loginUser);
router.post('/getUserNameById', getUserNameById);

export default router;
