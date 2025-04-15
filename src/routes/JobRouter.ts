import { Router } from "express";
import JobController from "../controllers/JobController";
import { verifyToken } from "../jwt/jwt";

const controller = new JobController();
const JobRouter = Router();

JobRouter.get(
  "/jobs/unpaid",
  verifyToken,
  controller.getAllUnpaid.bind(controller)
);

JobRouter.post(
  "/jobs/:job_id/pay",
  verifyToken,
  controller.payJob.bind(controller)
);

export default JobRouter;
