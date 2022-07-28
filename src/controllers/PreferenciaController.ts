import { Request, Response } from "express";
import { firestore } from "firebase-admin";
import UsuarioController from "../controllers/UsuarioController";
import pool from "../db/dbconnector";
import PreferenciaEntity from "../entitys/PreferenciaEntity";
import Genero from "../enums/genero";
import PreferenciaRepository from "../repository/PreferenciaRepository";

class PreferenciaController{

    public async updatePreferenciaByUsuario(req: Request, res: Response){
        try {
            const dbClient = await pool.connect();
            const userId = req.params.id;
            const body = {
              ...req.body,
              generoId: Genero[req.body.preferenciaGenero]
          } as PreferenciaEntity;
            await firestore()
            .collection("database")
            .doc(`preferencia#${body.preferenciaId}`)
            .set({ value: JSON.stringify(body) });
            
            res.send({data: body}).status(200);
          } catch (error) {
            res.status(500).send(error);
          }
      }
}

export default PreferenciaController;