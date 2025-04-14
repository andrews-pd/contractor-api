import Contract from "../../../src/database/models/Contract";
import ContractService from "../../../src/services/ContractService";

jest.mock("../../../src/database/models/Contract");

describe("ContractService", () => {
  let contractService: ContractService;

  beforeEach(() => {
    contractService = new ContractService();
  });

  it("should return a contract when found", async () => {
    const mockContract = { id: 1, name: "Test Contract" };
    (Contract.findOne as jest.Mock).mockResolvedValue(mockContract);

    const result = await contractService.getById(1);

    expect(Contract.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockContract);
  });

  it("should return null when no contract is found", async () => {
    (Contract.findOne as jest.Mock).mockResolvedValue(null);

    const result = await contractService.getById(999);

    expect(Contract.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(result).toBeNull();
  });
});
