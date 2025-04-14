import Profile from "../../../src/database/models/Profile";
import ProfileService from "../../../src/services/ProfileService";

jest.mock("../../../src/database/models/Profile");

describe("ProfileService", () => {
  let profileService: ProfileService;

  beforeEach(() => {
    profileService = new ProfileService();
  });

  it("should return a profile when found", async () => {
    const mockProfile = { id: 1, firstName: "John", lastName: "Doe" };
    (Profile.findOne as jest.Mock).mockResolvedValue(mockProfile);

    const result = await profileService.getById(1);

    expect(Profile.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockProfile);
  });

  it("should return null when no profile is found", async () => {
    (Profile.findOne as jest.Mock).mockResolvedValue(null);

    const result = await profileService.getById(999);

    expect(Profile.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    expect(result).toBeNull();
  });

  it("should throw an error if findOne fails", async () => {
    const mockError = new Error("Database failure");
    (Profile.findOne as jest.Mock).mockRejectedValue(mockError);

    await expect(profileService.getById(1)).rejects.toThrow("Database failure");
  });
});
