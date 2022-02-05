import { Router } from 'express';
import {
	getPatients,
	getPatientByMaBA,
	getCouponCares,
	saveCouponCare,
	DeleteCouponCare,
} from '../controllers/inpatients.controller';
import verifyToken from '../middleware/auth';
const router = Router();

router.get('/couponcare', verifyToken, getCouponCares);

router.post('/couponcare', verifyToken, saveCouponCare);

router.delete('/couponcare', verifyToken, DeleteCouponCare);

router.get('/search', verifyToken, getPatients);

// router.get('/', verifyToken, getPatients);

router.get('/:id', verifyToken, getPatientByMaBA);

export default router;
