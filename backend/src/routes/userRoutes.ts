import { Router } from 'express';
import { getAllUsers, getUserById, createUser, loginUser } from '../controllers/userController';

const router = Router();

router.get('/getAllUsers', getAllUsers);
router.get('/getUser/:id', getUserById);
router.post('/createUser', createUser);
router.post('/login', loginUser);

export default router;
