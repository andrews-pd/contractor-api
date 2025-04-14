import { Router } from "express";
import ContractController from "../controllers/ContractController";
import getProfile from "../middleware/getProfile";

const controller = new ContractController();
const ContractRouter = Router();

ContractRouter.get(
  "/contracts/:id",
  getProfile,
  controller.getContractById.bind(controller)
);

export default ContractRouter;
