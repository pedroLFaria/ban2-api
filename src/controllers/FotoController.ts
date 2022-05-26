import pool from "../db/dbconnector";
import { Request, Response } from "express";

class FotoController {

  public async get(req: Request, res: Response) {
    try {
      const dbClient = await pool.connect();
      const userId = req.params.id;
      const sql = `SELECT "fotoUrl", pricipal
        FROM public.foto
        where "usuarioId" = ${userId};`;
      const { rows } = await dbClient.query(sql);
      const todos = rows;

      dbClient.release();

      res.send({data: todos}).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default FotoController;
