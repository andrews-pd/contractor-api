import request from "supertest";
import ProfileService from "../../src/services/ProfileService";
import ContractService from "../../src/services/ContractService";
import app from "../../src/app";

jest.mock("../../src/services/ContractService");
jest.mock("../../src/services/ProfileService");

describe("Integration - GET /contracts/:id", () => {
  const mockProfile = { id: 1, firstName: "Jane", lastName: "Doe" };
  const mockContract = { id: 123, terms: "Test Contract", status: "active" };

  beforeEach(() => {
    (ProfileService.prototype.getById as jest.Mock).mockResolvedValue(mockProfile);
  });

  it("should return contract data when profile is authenticated", async () => {
    (ContractService.prototype.getById as jest.Mock).mockResolvedValue(mockContract);

    const res = await request(app)
      .get("/contracts/123")
      .set("profile_id", "1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockContract);
    expect(ContractService.prototype.getById).toHaveBeenCalledWith(123);
  });

  it("should return 401 if profile is not found", async () => {
    (ProfileService.prototype.getById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .get("/contracts/123")
      .set("profile_id", "999");

    expect(res.status).toBe(401);
  });

  it("should return 500 if an error occurs in the controller", async () => {
    (ContractService.prototype.getById as jest.Mock).mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .get("/contracts/123")
      .set("profile_id", "1");

    expect(res.status).toBe(500);
  });
});
