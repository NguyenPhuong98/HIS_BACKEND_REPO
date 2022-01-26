import { Router } from 'express';
import { login, getAuth } from '../controllers/auth.controller';
import { getConnection, sql } from '../database';
import verifyToken from '../middleware/auth';
const router = Router();

// @route  GET api/auth
// @desc Get list auth
// @access Public
router.get('/', verifyToken, getAuth);

// @route  POST api/auth/login
// @desc Login User
// @access Public
router.post('/login', login);

export default router;
