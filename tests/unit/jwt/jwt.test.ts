import jwt from 'jsonwebtoken';
import { sign, verifyToken } from '../../../src/jwt/jwt';
import { Request, Response, NextFunction } from 'express';

jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('sign function', () => {
  it('should call jwt.sign with correct arguments', () => {
    const payload = { id: 1, email: 'test@example.com', type: 'client' as 'client' | 'contractor' };
    const fakeToken = 'fake.jwt.token';
    mockedJwt.sign.mockImplementation(() => fakeToken);

    const result = sign(payload);

    expect(mockedJwt.sign).toHaveBeenCalledWith(
      payload,
      expect.any(String),
      {
        algorithm: 'HS256',
        expiresIn: '1d',
      }
    );
    expect(result).toBe(fakeToken);
  });
});

describe('verifyToken middleware', () => {
  const mockReq = {} as Request;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if no token is provided', () => {
    mockReq.header = jest.fn().mockReturnValue(undefined);

    verifyToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', () => {
    const decoded = { id: 1, email: 'test@example.com', type: 'client' };
    mockReq.header = jest.fn().mockReturnValue('valid.token');
    mockedJwt.verify.mockImplementation(() => decoded);

    mockReq.body = {};

    verifyToken(mockReq, mockRes, mockNext);

    expect(mockedJwt.verify).toHaveBeenCalledWith('valid.token', expect.any(String));
    expect(mockReq.body.profile).toEqual(decoded);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    mockReq.header = jest.fn().mockReturnValue('invalid.token');
    mockedJwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    verifyToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Expired or invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
