import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import { verifyToken } from '../jwt/jwt';
import validateLoginFields from '../middlewares/validateLoginFields';
import validateDepositParams from '../middlewares/validateDepositParams';

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile-related routes
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /balances/deposit/{userId}:
 *   post:
 *     summary: Deposits an amount into the user's balance
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Bad request
 */

const controller = new ProfileController();
const ProfileRouter = Router();

ProfileRouter.post('/login', validateLoginFields, controller.login.bind(controller));

ProfileRouter.post('/balances/deposit/:userId', validateDepositParams, controller.deposit.bind(controller));

export default ProfileRouter;
