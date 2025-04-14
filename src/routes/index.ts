import { Router } from "express";
import ContractRouter from "./ContractRouter";

const router = Router();

router.use(ContractRouter);

export default router;
