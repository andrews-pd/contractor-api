import { col, fn, Op } from 'sequelize';
import Profile from '../../../src/database/models/Profile';
import Job from '../../../src/database/models/Job';
import Contract from '../../../src/database/models/Contract';
import AdminRepository from '../../../src/repositories/AdminRepository';

jest.mock('../../../src/database/models/Profile', () => {
  return {
    findOne: jest.fn(),
  };
});

jest.mock('../../../src/database/models/Job');

jest.mock('../../../src/database/models/Contract', () => {
  return {};
});

describe('AdminService', () => {
  let adminService: AdminRepository;

  beforeEach(() => {
    adminService = new AdminRepository();
    jest.clearAllMocks();
  });

  describe('getBestProfession', () => {
    it('should return the profession with the highest total earnings within the date range', async () => {
      const start = '2023-01-01';
      const end = '2023-12-31';
      const mockResult = { profession: 'Engineer', totalEarned: 20000 };

      (Job.findOne as jest.Mock).mockResolvedValue(mockResult);

      const result = await adminService.getBestProfession(start, end);

      expect(Job.findOne).toHaveBeenCalledWith({
        attributes: [
          [col('Contract.Contractor.profession'), 'profession'],
          [fn('sum', col('price')), 'totalEarned'],
        ],
        include: [
          {
            model: Contract,
            attributes: [],
            include: [
              {
                model: Profile,
                as: 'Contractor',
                attributes: [],
                where: { type: 'contractor' },
              },
            ],
          },
        ],
        where: {
          paid: true,
          paymentDate: {
            [Op.between]: [start, end],
          },
        },
        group: ['Contract.Contractor.profession'],
        order: [[fn('sum', col('price')), 'DESC']],
        raw: true,
      });

      expect(result).toEqual(mockResult);
    });

    it('should return null if no profession is found within the date range', async () => {
      const start = '2023-01-01';
      const end = '2023-12-31';

      (Job.findOne as jest.Mock).mockResolvedValue(null);

      const result = await adminService.getBestProfession(start, end);

      expect(result).toBeNull();
    });
  });

  describe('getBestClients', () => {
    it('should return the top clients based on total payments within the date range', async () => {
      const start = '2023-01-01';
      const end = '2023-12-31';
      const limit = 2;
      const mockResult = [
        { id: 1, fullName: 'John Doe', totalPaid: 5000 },
        { id: 2, fullName: 'Jane Smith', totalPaid: 3000 },
      ];

      (Job.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await adminService.getBestClients(start, end, limit);

      expect(Job.findAll).toHaveBeenCalledWith({
        attributes: [
          [col('Contract.Client.id'), 'id'],
          [fn('concat', col('Contract.Client.firstName'), ' ', col('Contract.Client.lastName')), 'fullName'],
          [fn('sum', col('price')), 'totalPaid'],
        ],
        include: [
          {
            model: Contract,
            attributes: [],
            include: [
              {
                model: Profile,
                as: 'Client',
                attributes: [],
                where: { type: 'client' },
              },
            ],
          },
        ],
        where: {
          paid: true,
          paymentDate: {
            [Op.between]: [start, end],
          },
        },
        group: ['Contract.Client.id'],
        order: [[fn('sum', col('price')), 'DESC']],
        limit,
        raw: true,
      });

      expect(result).toEqual(mockResult);
    });

    it('should return an empty array if no clients are found within the date range', async () => {
      const start = '2023-01-01';
      const end = '2023-12-31';
      const limit = 2;

      (Job.findAll as jest.Mock).mockResolvedValue([]);

      const result = await adminService.getBestClients(start, end, limit);

      expect(result).toEqual([]);
    });
  });
});
