import request from 'supertest';
import app from '../../src/app'; 
import AdminService from '../../src/services/AdminService';

jest.mock('../../src/services/AdminService');

describe('AdminController Integration Tests', () => {
  describe('GET /admin/best-profession', () => {
    it('should return 400 if start or end dates are missing', async () => {
      const response = await request(app).get('/admin/best-profession');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Start and end dates are required');
    });

    it('should return 400 if start or end dates are invalid', async () => {
      const response = await request(app).get('/admin/best-profession?start=invalid&end=invalid');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid date format');
    });

    it('should return 400 if start date is after end date', async () => {
      const response = await request(app).get('/admin/best-profession?start=2023-10-10&end=2023-10-01');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Start date must be before end date');
    });

    it('should return 200 with the best profession', async () => {
      const mockProfession = { profession: 'Engineer', totalEarnings: 5000 };
      (AdminService.prototype.getBestProfession as jest.Mock).mockResolvedValue(mockProfession);

      const response = await request(app).get('/admin/best-profession?start=2023-01-01&end=2023-12-31');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProfession);
    });
  });

  describe('GET /admin/best-clients', () => {
    it('should return 400 if start or end dates are missing', async () => {
      const response = await request(app).get('/admin/best-clients');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Start and end dates are required');
    });

    it('should return 400 if start or end dates are invalid', async () => {
      const response = await request(app).get('/admin/best-clients?start=invalid&end=invalid');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid date format');
    });

    it('should return 400 if start date is after end date', async () => {
      const response = await request(app).get('/admin/best-clients?start=2023-10-10&end=2023-10-01');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Start date must be before end date');
    });

    it('should return 200 with the best clients (default limit)', async () => {
      const mockClients = [
        { id: 1, fullName: 'John Doe', paid: 3000 },
        { id: 2, fullName: 'Jane Smith', paid: 2500 },
      ];
      (AdminService.prototype.getBestClients as jest.Mock).mockResolvedValue(mockClients);

      const response = await request(app).get('/admin/best-clients?start=2023-01-01&end=2023-12-31');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClients);
    });

    it('should return 200 with the best clients (custom limit)', async () => {
      const mockClients = [
        { id: 1, fullName: 'John Doe', paid: 3000 },
      ];
      (AdminService.prototype.getBestClients as jest.Mock).mockResolvedValue(mockClients);

      const response = await request(app).get('/admin/best-clients?start=2023-01-01&end=2023-12-31&limit=1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClients);
    });
  });
});