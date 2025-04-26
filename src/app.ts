import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./routes";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import CustomError from "./interfaces/CustomError";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

export default app;
