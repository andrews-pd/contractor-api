import express from 'express';
import request from 'supertest';
import ContractRouter from '../../../src/routes/ContractRouter';

jest.mock('../../../src/controllers/ContractController', () => {
  return jest.fn().mockImplementation(() => ({
    getContractById: jest.fn((req, res) => res.status(200).json({ id: req.params.id, name: 'Test Contract' })),
    getContracts: jest.fn((req, res) => res.status(200).json([{ id: req.body.profile.id, name: 'Test Contract' }])),
  }));
});

jest.mock('../../../src/jwt/jwt', () => ({
  verifyToken: (req: any, _res: any, next: any) => {
    req.body.profile = { id: 1, email: 'mock@example.com', type: 'client' };
    next();
  }
}));

describe('ContractRouter', () => {
  const app = express();
  app.use(express.json());
  app.use('/api', ContractRouter);

  it('GET /api/contracts/:id - should return contract with valid token', async () => {
    const response = await request(app)
      .get('/api/contracts/123')
      .set('Authorization', 'Bearer mocktoken');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '123', name: 'Test Contract' });
  });

  it('GET /api/contracts/ - should return contracts with valid token', async () => {
    const response = await request(app)
      .get('/api/contracts')
      .set('Authorization', 'Bearer mocktoken');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'Test Contract' }]);
  });
});
