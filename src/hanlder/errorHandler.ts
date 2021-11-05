import { NextFunction, Request, Response } from "express";
import type { ErrorRequestHandler } from "express";
import { HttpException } from "../exceptions/HttpExceptions";
const errorHandler: ErrorRequestHandler = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).send({ status, message });
};
export default errorHandler;
