import validateLoginFields from '../../../src/middlewares/validateLoginFields';
import { Request, Response, NextFunction } from 'express';

describe('validateLoginFields Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 400 if email is missing', () => {
    req.body = { password: 'password123' };

    validateLoginFields(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The "email" field is required and must be a string.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if email is not a string', () => {
    req.body = { email: 12345, password: 'password123' };

    validateLoginFields(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The "email" field is required and must be a string.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if password is missing', () => {
    req.body = { email: 'test@example.com' };

    validateLoginFields(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The "password" field is required and must be a string.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if password is not a string', () => {
    req.body = { email: 'test@example.com', password: 12345 };

    validateLoginFields(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'The "password" field is required and must be a string.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if email and password are valid', () => {
    req.body = { email: 'test@example.com', password: 'password123' };

    validateLoginFields(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});