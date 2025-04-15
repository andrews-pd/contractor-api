import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import { verifyToken } from '../jwt/jwt';

const controller = new ProfileController();
const ProfileRouter = Router();

ProfileRouter.post('/login', controller.login.bind(controller));
ProfileRouter.post('/balances/deposit/:userId', controller.deposit.bind(controller));

export default ProfileRouter;
