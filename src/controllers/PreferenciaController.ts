import { Request, Response } from "express";
import UsuarioController from "../controllers/UsuarioController";
import pool from "../db/dbconnector";
import Genero from "../enums/genero";

class PreferenciaController{

    public async updatePreferenciaByUsuario(req: Request, res: Response){
        try {
            const dbClient = await pool.connect();
            const userId = req.params.id;
            const body = req.body;
            const sql = `UPDATE public.preferencia
            SET "preferenciaIdadeMinima"=${body.preferenciaIdadeMinima}, 
                "preferenciaIdadeMaxima"=${body.preferenciaIdadeMaxima}, 
                "generoId"=${Genero[body.preferenciaGenero]}
            WHERE 
                "usuarioId" = ${userId};`;
    
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

export default PreferenciaController;