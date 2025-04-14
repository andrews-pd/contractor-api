import jwt, { SignOptions } from 'jsonwebtoken';
import 'dotenv/config'
import { NextFunction, Request, Response } from 'express';

const secret = process.env.JWT_SECRET;

const sign = (payload: { id: number, email: string, type: "client" | "contractor" }) => {
  const jwtConfig: SignOptions = {
    algorithm: 'HS256',
    expiresIn: '1d'
  }
  
  return jwt.sign(payload, secret as string, jwtConfig);
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, secret as string);
    req.body.profile = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
}

export { sign, verifyToken };