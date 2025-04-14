import { Router } from "express";
import ContractRouter from "./ContractRouter";
import ProfileRouter from "./ProfileRouter";

const router = Router();

router.use(ContractRouter);
router.use(ProfileRouter);

export default router;
