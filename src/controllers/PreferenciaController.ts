import { Request, Response } from "express";
import UsuarioController from "../controllers/UsuarioController";
import pool from "../db/dbconnector";
import Genero from "../enums/genero";
import PreferenciaDto from "../models/PreferenciaDto";
import PreferenciaRepository from "../repository/PreferenciaRepository";

class PreferenciaController{

    public async updatePreferenciaByUsuario(req: Request, res: Response){
        try {
            const dbClient = await pool.connect();
            const userId = req.params.id;
            const body = req.body;
            const dto: PreferenciaDto = {
                preferenciaIdadeMaxima: body.preferenciaIdadeMaxima,
                preferenciaIdadeMinima: body.preferenciaIdadeMinima,
                preferenciaGenero: body.preferenciaGenero,
            };
            await PreferenciaRepository.update(dto, parseInt(userId));
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