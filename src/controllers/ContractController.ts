import { NextFunction, Request, Response } from "express";
import ContractService from "../services/ContractService";

class ContractController {
  private contractService: ContractService;
  constructor() {
    this.contractService = new ContractService();
  }

  public async getContractById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const profile = req.body.profile;
      const contract = await this.contractService.getById(Number(id), profile);
      res.status(200).json(contract);
    } catch (error) {
      next(error);
    }
  }

  public async getContracts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const profile = req.body.profile;
      const contract = await this.contractService.getAll(profile);
      res.status(200).json(contract);
    } catch (error) {
      next(error);
    }
  }
}

export default ContractController;
