import request from "supertest";
import ProfileService from "../../../src/services/ProfileService";
import ContractService from "../../../src/services/ContractService";
import app from "../../../src/app";

jest.mock("../../../src/services/ProfileService");
jest.mock("../../../src/services/ContractService");

describe("GET /contracts/:id", () => {
  const mockProfile = { id: 1, firstName: "Jane" };
  const mockContract = { id: 123, terms: "Test Contract" };

  beforeEach(() => {
    (ProfileService.prototype.getById as jest.Mock).mockResolvedValue(mockProfile);
    (ContractService.prototype.getById as jest.Mock).mockResolvedValue(mockContract);
  });

  it("should return contract data when authenticated", async () => {
    const response = await request(app)
      .get("/contracts/123")
      .set("profile_id", "1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockContract);
    expect(ProfileService.prototype.getById).toHaveBeenCalledWith(1);
    expect(ContractService.prototype.getById).toHaveBeenCalledWith(123);
  });

  it("should return 401 if profile is not found", async () => {
    (ProfileService.prototype.getById as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .get("/contracts/123")
      .set("profile_id", "999");

    expect(response.status).toBe(401);
  });

  it("should return 500 if controller throws an error", async () => {
    (ContractService.prototype.getById as jest.Mock).mockRejectedValue(new Error("DB fail"));

    const response = await request(app)
      .get("/contracts/123")
      .set("profile_id", "1");

    expect(response.status).toBe(500);
  });
});
