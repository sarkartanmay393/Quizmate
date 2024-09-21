import { Router } from 'express';
import { createUser, loginAdminUser } from '../controllers/userController';

const router = Router();

router.post('/createUser', createUser);
router.post('/adminLogin', loginAdminUser);

export default router;
