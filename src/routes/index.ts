import { Router } from "express";
import ContractRouter from "./ContractRouter";
import ProfileRouter from "./ProfileRouter";
import JobRouter from "./JobRouter";

const router = Router();

router.use(ContractRouter);
router.use(ProfileRouter);
router.use(JobRouter);

export default router;
