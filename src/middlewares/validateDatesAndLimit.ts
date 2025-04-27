import { Request, Response, NextFunction } from 'express';

export const validateDatesAndLimit = (req: Request, res: Response, next: NextFunction) => {
  const { start, end, limit } = req.query;

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

  if (limit !== undefined) {
    const limitNumber = Number(limit);
    if (isNaN(limitNumber) || limitNumber <= 0) {
      return res.status(400).json({ message: 'Limit must be a positive number' });
    }
  }

  next();
};