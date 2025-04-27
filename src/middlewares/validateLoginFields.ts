import { Request, Response, NextFunction } from 'express';

const validateLoginFields = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ message: 'The "email" field is required and must be a string.' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ message: 'The "password" field is required and must be a string.' });
  }

  next();
};

export default validateLoginFields;