import { Router } from "express";
import ContractController from "../controllers/ContractController";
import { verifyToken } from "../jwt/jwt";

const controller = new ContractController();
const ContractRouter = Router();

ContractRouter.get(
  "/contracts/:id",
  verifyToken,
  controller.getContractById.bind(controller)
);

ContractRouter.get(
  "/contracts",
  verifyToken,
  controller.getContracts.bind(controller)
);

export default ContractRouter;
