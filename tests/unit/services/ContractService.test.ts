import ContractService from '../../../src/services/ContractService';
import Contract from '../../../src/database/models/Contract';
import IProfile from '../../../src/interfaces/IProfile';

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

      const profile: IProfile = { id: "1", type: 'client' };
      const result = await contractService.getById(1, profile);

      expect(Contract.findOne).toHaveBeenCalledWith({ where: { ClientId: 1 } });
      expect(result).toEqual(mockContract);
    });

    it('should return a contract when the profile matches the contractor type', async () => {
      const mockContract = { id: 1, ContractorId: 1 };
      (Contract.findOne as jest.Mock).mockResolvedValue(mockContract);

      const profile: IProfile = { id: "1", type: 'contractor' };
      const result = await contractService.getById(1, profile);

      expect(Contract.findOne).toHaveBeenCalledWith({ where: { ContractorId: 1 } });
      expect(result).toEqual(mockContract);
    });

    it('should throw an error if the profile ID does not match the contract ID', async () => {
      const profile: IProfile = { id: "2", type: 'client' };

      await expect(contractService.getById(1, profile)).rejects.toThrow(
        'Users can only access their respective contracts'
      );
      expect(Contract.findOne).not.toHaveBeenCalled();
    });

    it('should return null if no contract is found', async () => {
      (Contract.findOne as jest.Mock).mockResolvedValue(null);

      const profile: IProfile = { id: "1", type: 'client' };
      const result = await contractService.getById(1, profile);

      expect(Contract.findOne).toHaveBeenCalledWith({ where: { ClientId: 1 } });
      expect(result).toBeNull();
    });
  });
});