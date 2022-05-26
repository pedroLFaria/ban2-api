import pool from "../db/dbconnector";
import { Request, Response } from "express";

class CurtidaController {
  public async post(req: Request, res: Response) {
    try {
      const dbClient = await pool.connect();
      const body = req.body;
      const sql = `INSERT INTO public.curtida(
        "usuarioId", "usuarioAlvoId", "isCurtida", "curtidaData")
        VALUES (${body.usuarioId}, ${body.usuarioAlvoId}, ${body.isCurtida}, now()) 
        ON CONFLICT ("usuarioId", "usuarioAlvoId") DO UPDATE
        SET "isCurtida"=${body.isCurtida},
        "curtidaData"= now();`;
      const { rows } = await dbClient.query(sql);
      const todos = rows;

      dbClient.release();

      res.send({ data: todos }).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  public async getMatches(req: Request, res: Response) {
    try {
      const dbClient = await pool.connect();
      const userId = req.params.id;
      const sql = `SELECT  u."usuarioNome",
            u."usuarioId"
        FROM public.curtida ca
        join public.usuario u on u."usuarioId" = ca."usuarioId"
        where ca."usuarioAlvoId" = ${userId} and ca."isCurtida"=true and ca."usuarioId" in (
            SELECT c."usuarioAlvoId"
                FROM public.curtida c
                where c."usuarioId" = ${userId} and c."isCurtida"=true);`;
      const { rows } = await dbClient.query(sql);
      const todos = rows;

      dbClient.release();

      res.send({ data: todos }).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const dbClient = await pool.connect();
      const userId = req.params.id;
      const sql = ` DELETE FROM public.curtida
      WHERE "usuarioId" = ${userId};`;
      const { rows } = await dbClient.query(sql);
      const todos = rows;

      dbClient.release();

      res.send({ data: todos }).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default CurtidaController;
