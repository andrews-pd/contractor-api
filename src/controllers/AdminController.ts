import { NextFunction, Request, Response } from 'express';
import AdminService from '../services/AdminService';

class AdminController {
  private adminService: AdminService;
  constructor() {
    this.adminService = new AdminService();
  }

  public async getBestProfession(req: Request, res: Response, next: NextFunction) {
    try {
      const { start, end } = req.query;

      const profession = await this.adminService.getBestProfession(start as string, end as string);
      
      res.status(200).json(profession);
    } catch (error) {
      next(error);
    }
  }

  public async getBestClients(req: Request, res: Response, next: NextFunction) {
    try {
      const { start, end, limit } = req.query;

      let limitNumber = Number(limit);
      if (isNaN(limitNumber) || limitNumber <= 0) {
        limitNumber = 2;
      }

      const clients = await this.adminService.getBestClients(start as string, end as string, limitNumber);
      
      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
