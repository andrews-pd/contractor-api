import express from 'express';
import request from 'supertest';
import ProfileRouter from '../../../src/routes/ProfileRouter';

jest.mock('../../../src/controllers/ProfileController', () => {
  return jest.fn().mockImplementation(() => ({
    login: jest.fn((req, res) => res.status(200).json({ message: 'Logged in' })),
    deposit: jest.fn((req, res) => res.status(201).json({ message: 'Deposit successful' })),
  }));
});

describe('ProfileRouter', () => {
  const app = express();
  app.use(express.json());
  app.use('/profile', ProfileRouter);

  it('POST /profile/login should return status 200 and message', async () => {
    const response = await request(app)
      .post('/profile/login')
      .send({ email: 'test@example.com', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Logged in' });
  });

  it('POST /profile/balances/deposit/:userId should return status 201 and message', async () => {
    const userId = '123';
    const response = await request(app)
      .post(`/profile/balances/deposit/${userId}`)
      .send({ amount: 100 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Deposit successful' });
  });
});
