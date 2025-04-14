import { NextFunction, Request, Response } from "express";
import Profile from "../database/models/Profile";
import ProfileService from "../services/ProfileService";

declare global {
  namespace Express {
    interface Request {
      profile?: Profile;
    }
  }
}

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  const profileService = new ProfileService();
  const profile = await profileService.getById(Number(req.get("profile_id")));
  if (!profile) return res.status(401).end();
  req.profile = profile;
  next();
};

export default getProfile;
