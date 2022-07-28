import pool from "../db/dbconnector";
import { Request, Response } from "express";
import FotoRepository from "../repository/FotoRepository";

class FotoController {

  public async get(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      const todos = await FotoRepository.getByUsuarioId(userId);
      res.send({data: todos}).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default FotoController;
