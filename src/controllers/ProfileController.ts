import { NextFunction, Request, Response } from 'express';
import ProfileService from '../services/ProfileService';

class ProfileController {
  private profileService: ProfileService;
  constructor() {
    this.profileService = new ProfileService();
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const profile = await this.profileService.login(email, password);
      if (profile.message) {
        return res.status(401).json({ message: profile.message });
      }
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }

  public async deposit(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { amount } = req.body;
      await this.profileService.deposit(Number(userId), amount);
      res.status(201).json({ message: "Deposite  processed" });
    } catch (error) {
      next(error);
    }
  }
}

export default ProfileController;
