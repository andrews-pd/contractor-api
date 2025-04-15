import request from "supertest";
import express from "express";
import AdminRouter from "../../../src/routes/AdminRouter";

const app = express();
app.use(express.json());
app.use(AdminRouter);

jest.mock("../../../src/controllers/AdminController", () => {
  return jest.fn().mockImplementation(() => ({
    getBestProfession: jest.fn((req, res) =>
      res.status(200).json({ profession: "Engineer", totalEarned: "5000.00" })
    ),
    getBestClients: jest.fn((req, res) =>
      res.status(200).json([
        { id: 1, fullName: "John Doe", totalPaid: "3000.00" },
        { id: 2, fullName: "Jane Smith", totalPaid: "2500.00" },
      ])
    ),
  }));
});

describe("AdminRouter", () => {
  describe("GET /admin/best-profession", () => {
    it("should return the profession that earned the most", async () => {
      const response = await request(app).get("/admin/best-profession?start=2022-01-01&end=2022-12-31");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        profession: "Engineer",
        totalEarned: "5000.00",
      });
    });
  });

  describe("GET /admin/best-clients", () => {
    it("should return the top clients who paid the most", async () => {
      const response = await request(app).get("/admin/best-clients?start=2022-01-01&end=2022-12-31");

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { id: 1, fullName: "John Doe", totalPaid: "3000.00" },
        { id: 2, fullName: "Jane Smith", totalPaid: "2500.00" },
      ]);
    });
  });
});
