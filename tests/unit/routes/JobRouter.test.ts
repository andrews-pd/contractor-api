import express from 'express';
import request from 'supertest';
import JobRouter from '../../../src/routes/JobRouter';

jest.mock('../../../src/controllers/JobController', () => {
  return jest.fn().mockImplementation(() => ({
    getAllUnpaid: jest.fn((req, res) => res.status(200).json([{ id: 1, status: "unpaid" }])),
    payJob: jest.fn((req, res) => res.status(201).json([{ id: 1, name: 'Test Contract' }])),
  }));
});

jest.mock('../../../src/jwt/jwt', () => ({
  verifyToken: (req: any, _res: any, next: any) => {
    req.body.profile = { id: 1, email: 'mock@example.com', type: 'client' };
    next();
  }
}));

describe('JobRouter', () => {
  const app = express();
  app.use(express.json());
  app.use('/api', JobRouter);

  it('GET /jobs/unpaid - should return contract with valid token', async () => {
    const response = await request(app)
      .get('/api/jobs/unpaid')
      .set('Authorization', 'Bearer mocktoken');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, status: "unpaid" }]);
  });

  it('POST /jobs/:job_id/pay - should pay job', async () => {
    const response = await request(app)
      .post('/api/jobs/:job_id/pay')
      .set('Authorization', 'Bearer mocktoken');

    expect(response.status).toBe(201);
  });
});
