import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';

const controller = new ProfileController();
const ProfileRouter = Router();

ProfileRouter.post('/login', controller.login.bind(controller));

export default ProfileRouter;
