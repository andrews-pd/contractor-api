import { validateDatesAndLimit } from '../../../src/middlewares/validateDatesAndLimit';
import { Request, Response, NextFunction } from 'express';

describe('validateDatesAndLimit Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 400 if start or end date is missing', () => {
    req.query = { start: '2023-01-01' };

    validateDatesAndLimit(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Start and end dates are required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if start or end date is not a string', () => {
    req.query = { start: 123 as any, end: '2023-01-02' };

    validateDatesAndLimit(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Start and end dates must be strings' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if start or end date is invalid', () => {
    req.query = { start: 'invalid-date', end: '2023-01-02' };

    validateDatesAndLimit(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid date format' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if start date is after or equal to end date', () => {
    req.query = { start: '2023-01-02', end: '2023-01-01' };

    validateDatesAndLimit(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Start date must be before end date' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if limit is not a positive number', () => {
    req.query = { start: '2023-01-01', end: '2023-01-02', limit: '-5' };

    validateDatesAndLimit(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Limit must be a positive number' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if all validations pass', () => {
    req.query = { start: '2023-01-01', end: '2023-01-02', limit: '10' };

    validateDatesAndLimit(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});