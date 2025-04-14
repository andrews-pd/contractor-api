import ContractService from '../../../src/services/ContractService';
import Contract from '../../../src/database/models/Contract';
import { IProfile, ProfileType } from '../../../src/interfaces/IProfile';
import { Op } from 'sequelize';
import { ContractStatus } from '../../../src/interfaces/IContract';

jest.mock('../../../src/database/models/Contract');

describe('ContractService', () => {
  let contractService: ContractService;

  beforeEach(() => {
    jest.clearAllMocks();
    contractService = new ContractService();
  });

  describe('getById', () => {
    it('should return a contract when the profile matches the client type', async () => {
      const mockContract = { id: 1, ClientId: 1 };
      (Contract.findOne as jest.Mock).mockResolvedValue(mockContract);

      const profile: IProfile = { id: 1, type: ProfileType.Client };
      const result = await contractService.getById(1, profile);

      expect(Contract.findOne).toHaveBeenCalledWith({ where: { ClientId: 1 } });
      expect(result).toEqual(mockContract);
    });

    it('should return a contract when the profile matches the contractor type', async () => {
      const mockContract = { id: 1, ContractorId: 1 };
      (Contract.findOne as jest.Mock).mockResolvedValue(mockContract);

      const profile: IProfile = { id: 1, type: ProfileType.Contractor };
      const result = await contractService.getById(1, profile);

      expect(Contract.findOne).toHaveBeenCalledWith({ where: { ContractorId: 1 } });
      expect(result).toEqual(mockContract);
    });

    it('should throw an error if the profile ID does not match the contract ID', async () => {
      const profile: IProfile = { id: 2, type: ProfileType.Client };

      await expect(contractService.getById(1, profile)).rejects.toThrow(
        'Users can only access their respective contracts'
      );
      expect(Contract.findOne).not.toHaveBeenCalled();
    });

    it('should return null if no contract is found', async () => {
      (Contract.findOne as jest.Mock).mockResolvedValue(null);

      const profile: IProfile = { id: 1, type: ProfileType.Client };
      const result = await contractService.getById(1, profile);

      expect(Contract.findOne).toHaveBeenCalledWith({ where: { ClientId: 1 } });
      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return all active contracts for a client profile', async () => {
      const mockContracts = [
        { id: 1, ClientId: 1, status: ContractStatus.InProgress },
        { id: 2, ClientId: 1, status: ContractStatus.New },
      ];
      (Contract.findAll as jest.Mock).mockResolvedValue(mockContracts);

      const profile: IProfile = { id: 1, type: ProfileType.Client };
      const result = await contractService.getAll(profile);

      expect(Contract.findAll).toHaveBeenCalledWith({
        where: {
          status: { [Op.not]: ContractStatus.Terminated },
          ClientId: 1,
        },
      });
      expect(result).toEqual(mockContracts);
    });

    it('should return all active contracts for a contractor profile', async () => {
      const mockContracts = [
        { id: 1, ContractorId: 1, status: ContractStatus.InProgress },
        { id: 2, ContractorId: 1, status: ContractStatus.New },
      ];
      (Contract.findAll as jest.Mock).mockResolvedValue(mockContracts);

      const profile: IProfile = { id: 1, type: ProfileType.Contractor };
      const result = await contractService.getAll(profile);

      expect(Contract.findAll).toHaveBeenCalledWith({
        where: {
          status: { [Op.not]: ContractStatus.Terminated },
          ContractorId: 1,
        },
      });
      expect(result).toEqual(mockContracts);
    });

    it('should return an empty array if no active contracts are found', async () => {
      (Contract.findAll as jest.Mock).mockResolvedValue([]);

      const profile: IProfile = { id: 1, type: ProfileType.Client };
      const result = await contractService.getAll(profile);

      expect(Contract.findAll).toHaveBeenCalledWith({
        where: {
          status: { [Op.not]: ContractStatus.Terminated },
          ClientId: 1,
        },
      });
      expect(result).toEqual([]);
    });

    it('should throw an error if the database query fails', async () => {
      (Contract.findAll as jest.Mock).mockRejectedValue(new Error('Database error'));

      const profile: IProfile = { id: 1, type: ProfileType.Client };

      await expect(contractService.getAll(profile)).rejects.toThrow('Database error');
      expect(Contract.findAll).toHaveBeenCalledWith({
        where: {
          status: { [Op.not]: ContractStatus.Terminated },
          ClientId: 1,
        },
      });
    });
  });
});
