import 'reflect-metadata';
import AdminService from '../../../src/services/AdminService';
import AdminRepository from '../../../src/repositories/AdminRepository';
import Job from '../../../src/database/models/Job';

jest.mock('../../../src/repositories/AdminRepository');

describe('AdminService', () => {
  let adminService: AdminService;
  const getBestProfession = jest.fn();
  const getBestClients = jest.fn();

  beforeEach(() => {
    adminService = new AdminService( { getBestProfession, getBestClients } as unknown as AdminRepository);
  });

  describe('getBestProfession', () => {
    it('should return the best profession within the given date range', async () => {
      const mockJob = { id: 1, profession: 'Engineer' } as unknown as Job;
      getBestProfession.mockResolvedValue(mockJob);

      const result = await adminService.getBestProfession('2023-01-01', '2023-12-31');

      expect(getBestProfession).toHaveBeenCalledWith('2023-01-01', '2023-12-31');
      expect(result).toEqual(mockJob);
    });

    it('should return null if no profession is found', async () => {
      getBestProfession.mockResolvedValue(null);

      const result = await adminService.getBestProfession('2023-01-01', '2023-12-31');

      expect(getBestProfession).toHaveBeenCalledWith('2023-01-01', '2023-12-31');
      expect(result).toBeNull();
    });
  });

  describe('getBestClients', () => {
    it('should return the best clients within the given date range and limit', async () => {
      const mockClients = [
        { id: 1, name: 'Client A', paid: 1000 },
        { id: 2, name: 'Client B', paid: 800 },
      ] as unknown as Job[];
      getBestClients.mockResolvedValue(mockClients);

      const result = await adminService.getBestClients('2023-01-01', '2023-12-31', 2);

      expect(getBestClients).toHaveBeenCalledWith('2023-01-01', '2023-12-31', 2);
      expect(result).toEqual(mockClients);
    });

    it('should return an empty array if no clients are found', async () => {
      getBestClients.mockResolvedValue([]);

      const result = await adminService.getBestClients('2023-01-01', '2023-12-31', 2);

      expect(getBestClients).toHaveBeenCalledWith('2023-01-01', '2023-12-31', 2);
      expect(result).toEqual([]);
    });
  });
});