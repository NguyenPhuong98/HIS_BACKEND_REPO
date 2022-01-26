import { Router } from 'express';
import { getDepartments, getRooms, getCommands } from '../controllers/list.controller';
import verifyToken from '../middleware/auth';
const router = Router();

// @route  GET api/list/departments
// @desc Get list departments
// @access Private
router.get('/departments', verifyToken, getDepartments);

// @route  GET api/list/rooms
// @desc Get list rooms
// @access Private
router.get('/rooms', verifyToken, getRooms);

// @route  GET api/list/commands
// @desc Get list commands
// @access Private
router.get('/commands', verifyToken, getCommands);

export default router;
