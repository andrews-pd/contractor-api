import { Router } from "express";
import ContractController from "../controllers/ContractController";
import { verifyToken } from "../jwt/jwt";

const controller = new ContractController();
const ContractRouter = Router();

/**
 * @swagger
 * /contracts/{id}:
 *   get:
 *     summary: Get a contract by ID
 *     tags:
 *       - Contracts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The contract ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contract retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 status:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contract not found
 */
ContractRouter.get(
  "/contracts/:id",
  verifyToken,
  controller.getContractById.bind(controller)
);

/**
 * @swagger
 * /contracts:
 *   get:
 *     summary: Get all contracts
 *     tags:
 *       - Contracts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contracts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
ContractRouter.get(
  "/contracts",
  verifyToken,
  controller.getContracts.bind(controller)
);

export default ContractRouter;
