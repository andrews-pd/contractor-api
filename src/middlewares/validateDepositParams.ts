import { Request, Response, NextFunction } from 'express';

const validateDepositParams = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { amount } = req.body;

  if (!userId || isNaN(Number(userId))) {
    return res.status(400).json({ message: 'The "userId" parameter is required and must be a valid number.' });
  }

  if (amount === undefined || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'The "amount" field is required and must be a positive number.' });
  }

  next();
};

export default validateDepositParams;