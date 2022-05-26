import pool from "../db/dbconnector";
import { Request, Response } from "express";
import Genero from "../enums/genero";
class UsuarioController {
    
    static getSql  = `SELECT 
            usuario."usuarioNome", 
            usuario."usuarioEmail", 
            usuario."usuarioDataDeNascimento", 
            g."generoDescricao" as "usuarioGenero",
            p."preferenciaTelefoneDDI",
            p."preferenciaTelefoneDDD",
            p."preferenciaTelefoneNumero",
            p."preferenciaIdadeMinima",
            p."preferenciaIdadeMaxima",
            gp."generoDescricao" as "preferenciaGenero"
            FROM public.usuario
            left join public.genero g on g."generoId" = usuario."generoId"
            left join public.preferencia p on p."usuarioId" = usuario."usuarioId"
            left join public.genero gp on gp."generoId" = p."generoId"
            where usuario."usuarioId" = `;

  public async get(req: Request, res: Response) {
    try {
      const dbClient = await pool.connect();
      const userId = req.params.id;
      const { rows } = await dbClient.query(UsuarioController.getSql + userId);
      const todos = rows[0];

      dbClient.release();

      res.send({data: todos}).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  public async getAll(req: Request, res: Response) {
    try {
      const dbClient = await pool.connect();
      const sql = `SELECT 
            usuario."usuarioNome", 
            usuario."usuarioEmail", 
            usuario."usuarioDataDeNascimento", 
            g."generoDescricao" as "usuarioGenero",
            p."preferenciaTelefoneDDI",
            p."preferenciaTelefoneDDD",
            p."preferenciaTelefoneNumero",
            p."preferenciaIdadeMinima",
            p."preferenciaIdadeMaxima",
            gp."generoDescricao" as "preferenciaGenero"
            FROM public.usuario
            left join public.genero g on g."generoId" = usuario."generoId"
            left join public.preferencia p on p."usuarioId" = usuario."usuarioId"
            left join public.genero gp on gp."generoId" = p."generoId";`;
      const { rows } = await dbClient.query(sql);
      const todos = rows;

      dbClient.release();

      res.send({data: todos}).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  public async getUsuariosByPreference(req: Request, res: Response) {
    try {
      const dbClient = await pool.connect();
      const userId = req.params.id;
      const sql = `SELECT
        u."usuarioId", 
        u."usuarioNome", 
        u."usuarioEmail", 
        u."usuarioDataDeNascimento", 
        g."generoDescricao" as "usuarioGenero"
        FROM public.preferencia p 
        join public.usuario u  
            on p."preferenciaIdadeMaxima" >= (date_part('year',age(u."usuarioDataDeNascimento"))) and 
                p."preferenciaIdadeMinima" <= (date_part('year',age(u."usuarioDataDeNascimento"))) and
                p."generoId" = u."generoId" and
                u."usuarioId" != p."usuarioId"
        join public.genero g on g."generoId" = u."generoId"
        where p."usuarioId" = ${userId} and u."usuarioId" not in (select "usuarioAlvoId" from public.curtida where "usuarioId" = ${userId});`;
      const { rows } = await dbClient.query(sql);
      const todos = rows;

      dbClient.release();

      res.send({data: todos}).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }

  public async updateUsuario(req: Request, res: Response){
    try {
        const dbClient = await pool.connect();
        const userId = req.params.id;
        const body = req.body;
        const sql = `UPDATE public.usuario
        SET "usuarioNome"='${body.usuarioNome}',
        "usuarioEmail"='${body.usuarioEmail}', 
        "generoId"=${Genero[body.usuarioGenero]}, 
        "usuarioDataDeNascimento"='${body.usuarioDataDeNascimento}'
        WHERE "usuarioId" = ${userId};`;
        await dbClient.query(sql);
        
        const { rows } = await dbClient.query(UsuarioController.getSql + userId);
        const todos = rows[0];
  
        dbClient.release();
  
        res.send({data: todos}).status(200);
      } catch (error) {
        res.status(500).send(error);
      }
  }
}

export default UsuarioController;
