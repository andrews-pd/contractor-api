import { container } from "tsyringe";
import { Router } from "express";
import AdminController from "../controllers/AdminController";
import { validateDatesAndLimit } from "../middlewares/validateDatesAndLimit";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Rotas administrativas
 */

/**
 * @swagger
 * /admin/best-profession:
 *   get:
 *     summary: Retorna a melhor profissão
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profession:
 *                   type: string
 *                   description: Nome da melhor profissão
 *                 totalEarnings:
 *                   type: number
 *                   description: Ganhos totais
 *       500:
 *         description: Erro interno do servidor
 */

/**
 * @swagger
 * /admin/best-clients:
 *   get:
 *     summary: Retorna os melhores clientes
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   clientId:
 *                     type: number
 *                     description: ID do cliente
 *                   fullName:
 *                     type: string
 *                     description: Nome completo do cliente
 *                   paid:
 *                     type: number
 *                     description: Valor total pago pelo cliente
 *       500:
 *         description: Erro interno do servidor
 */

const controller = container.resolve(AdminController);
const AdminRouter = Router();

AdminRouter.get(
  "/admin/best-profession",
  validateDatesAndLimit,
  controller.getBestProfession.bind(controller)
);

AdminRouter.get(
  "/admin/best-clients",
  validateDatesAndLimit,
  controller.getBestClients.bind(controller)
);

export default AdminRouter;
