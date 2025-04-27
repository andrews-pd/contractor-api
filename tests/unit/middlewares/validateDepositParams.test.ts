import validateDepositParams from '../../../src/middlewares/validateDepositParams';
import { Request, Response, NextFunction } from 'express';

describe('validateDepositParams Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 400 if userId is missing', () => {
    req.params = {};

    validateDepositParams(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The "userId" parameter is required and must be a valid number.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if userId is not a valid number', () => {
    req.params = { userId: 'abc' };

    validateDepositParams(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The "userId" parameter is required and must be a valid number.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if amount is missing', () => {
    req.params = { userId: '1' };
    req.body = {};

    validateDepositParams(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The "amount" field is required and must be a positive number.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if amount is not a number', () => {
    req.params = { userId: '1' };
    req.body = { amount: 'abc' };

    validateDepositParams(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The "amount" field is required and must be a positive number.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if amount is not a positive number', () => {
    req.params = { userId: '1' };
    req.body = { amount: -10 };

    validateDepositParams(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The "amount" field is required and must be a positive number.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if userId and amount are valid', () => {
    req.params = { userId: '1' };
    req.body = { amount: 100 };

    validateDepositParams(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});