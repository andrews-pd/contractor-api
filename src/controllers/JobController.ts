import { NextFunction, Request, Response } from "express";
import JobService from "../services/JobService";

class JobController {
  private jobService: JobService;
  constructor() {
    this.jobService = new JobService();
  }

  public async getAllUnpaid(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const profile = req.body.profile;
      const contracts = await this.jobService.getAllUnpaid(profile);
      res.status(200).json(contracts);
    } catch (error) {
      next(error);
    }
  }
}

export default JobController;
