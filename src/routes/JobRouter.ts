import { Router } from "express";
import JobController from "../controllers/JobController";
import { verifyToken } from "../jwt/jwt";

const controller = new JobController();
const JobRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Endpoints relacionados a jobs
 */

/**
 * @swagger
 * /jobs/unpaid:
 *   get:
 *     summary: Retorna todos os jobs não pagos
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de jobs não pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 *       401:
 *         description: Token inválido ou não fornecido
 */
JobRouter.get(
  "/jobs/unpaid",
  verifyToken,
  controller.getAllUnpaid.bind(controller)
);

/**
 * @swagger
 * /jobs/{job_id}/pay:
 *   post:
 *     summary: Realiza o pagamento de um job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: job_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do job a ser pago
 *     responses:
 *       200:
 *         description: Job pago com sucesso
 *       400:
 *         description: Erro ao processar o pagamento
 *       401:
 *         description: Token inválido ou não fornecido
 */
JobRouter.post(
  "/jobs/:job_id/pay",
  verifyToken,
  controller.payJob.bind(controller)
);

export default JobRouter;
