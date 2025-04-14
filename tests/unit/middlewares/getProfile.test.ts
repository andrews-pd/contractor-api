import { Request, Response, NextFunction } from "express";
import Profile from "../../../src/database/models/Profile";
import ProfileService from "../../../src/services/ProfileService";
import getProfile from "../../../src/middlewares/getProfile";

jest.mock("../../../src/services/ProfileService");

describe("getProfile middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let endMock: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      get: jest.fn().mockReturnValue("1"),
    };

    endMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ end: endMock });

    mockResponse = {
      status: statusMock,
    };

    mockNext = jest.fn();
  });

  it("should attach profile to request and call next when found", async () => {
    const mockProfile = { id: 1, firstName: "Jane" } as Profile;

    (ProfileService.prototype.getById as jest.Mock).mockResolvedValue(mockProfile);

    await getProfile(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(ProfileService.prototype.getById).toHaveBeenCalledWith(1);
    expect(mockRequest.profile).toEqual(mockProfile);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should respond with 401 if profile not found", async () => {
    (ProfileService.prototype.getById as jest.Mock).mockResolvedValue(null);

    await getProfile(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(ProfileService.prototype.getById).toHaveBeenCalledWith(1);
    expect(statusMock).toHaveBeenCalledWith(401);
    expect(endMock).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });
});
