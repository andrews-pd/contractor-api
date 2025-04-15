import { Router } from "express";
import AdminController from "../controllers/AdminController";

const controller = new AdminController();
const AdminRouter = Router();

AdminRouter.get(
  "/admin/best-profession",
  controller.getBestProfession.bind(controller)
);

AdminRouter.get(
  "/admin/best-clients",
  controller.getBestClients.bind(controller)
);

export default AdminRouter;
