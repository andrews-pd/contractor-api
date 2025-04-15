import { Router } from "express";
import ContractRouter from "./ContractRouter";
import ProfileRouter from "./ProfileRouter";
import JobRouter from "./JobRouter";
import AdminRouter from "./AdminRouter";

const router = Router();

router.use(ContractRouter);
router.use(ProfileRouter);
router.use(JobRouter);
router.use(AdminRouter);

export default router;
