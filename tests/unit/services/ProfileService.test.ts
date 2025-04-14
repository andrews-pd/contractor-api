import ProfileService from "../../../src/services/ProfileService";
import Profile from "../../../src/database/models/Profile";
import md5 from "md5";
import { sign } from "../../../src/jwt/jwt";

jest.mock("../../../src/database/models/Profile");
jest.mock("../../../src/jwt/jwt");
jest.mock("md5");

describe("ProfileService", () => {
  const profileService = new ProfileService();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    it("should return a profile when found", async () => {
      const mockProfile = { id: 1, email: "test@example.com" };
      (Profile.findOne as jest.Mock).mockResolvedValue(mockProfile);

      const result = await profileService.getById(1);

      expect(Profile.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockProfile);
    });

    it("should return null when no profile is found", async () => {
      (Profile.findOne as jest.Mock).mockResolvedValue(null);

      const result = await profileService.getById(1);

      expect(Profile.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBeNull();
    });
  });

  describe("login", () => {
    it("should return a token when login is successful", async () => {
      const mockProfile = { id: 1, email: "test@example.com", type: "user", password: "hashedPassword" };
      const mockToken = "mockToken";

      (md5 as jest.Mock).mockReturnValue("hashedPassword");
      (Profile.findOne as jest.Mock).mockResolvedValue(mockProfile);
      (sign as jest.Mock).mockReturnValue(mockToken);

      const result = await profileService.login("test@example.com", "password");

      expect(md5).toHaveBeenCalledWith("password");
      expect(Profile.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com", password: "hashedPassword" },
      });
      expect(sign).toHaveBeenCalledWith({ id: 1, email: "test@example.com", type: "user" });
      expect(result).toEqual({ id: 1, email: "test@example.com", token: mockToken });
    });

    it("should return an error message when login fails", async () => {
      (md5 as jest.Mock).mockReturnValue("hashedPassword");
      (Profile.findOne as jest.Mock).mockResolvedValue(null);

      const result = await profileService.login("test@example.com", "password");

      expect(md5).toHaveBeenCalledWith("password");
      expect(Profile.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com", password: "hashedPassword" },
      });
      expect(result).toEqual({ message: "Invalid email or password" });
    });
  });
});