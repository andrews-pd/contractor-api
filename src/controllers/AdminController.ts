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

      if (!start || !end) {
        return res.status(400).json({ message: 'Start and end dates are required' });
      }

      if (typeof start !== 'string' || typeof end !== 'string') {
        return res.status(400).json({ message: 'Start and end dates must be strings' });
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      if (startDate >= endDate) {
        return res.status(400).json({ message: 'Start date must be before end date' });
      }

      const profession = await this.adminService.getBestProfession(start, end);
      
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

      if (!start || !end) {
        return res.status(400).json({ message: 'Start and end dates are required' });
      }

      if (typeof start !== 'string' || typeof end !== 'string') {
        return res.status(400).json({ message: 'Start and end dates must be strings' });
      }

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      
      if (startDate >= endDate) {
        return res.status(400).json({ message: 'Start date must be before end date' });
      }

      const profession = await this.adminService.getBestClients(start, end, limitNumber);
      
      res.status(200).json(profession);
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
