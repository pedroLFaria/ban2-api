import pool from "../db/dbconnector";
import { Request, Response } from "express";
import Genero from "../enums/genero";
import { firestore } from "firebase-admin";
import { user } from "firebase-functions/v1/auth";
import UsuarioEntity from "../entitys/UsuarioEntity";
import PreferenciaEntity from "../entitys/PreferenciaEntity";
import GeneroEntity from "../entitys/GeneroEntity";
import PreferenciaRepository from "../repository/PreferenciaRepository";
class UsuarioController {
  static getSql = `SELECT 
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
      const fbRows = await firestore()
        .collection("database")
        .doc(`usuario#${1}`)
        .get();

      const user = JSON.parse(fbRows.data()?.value) as UsuarioEntity;

      const userGenero = JSON.parse(
        (
          await firestore()
            .collection("database")
            .doc(`genero#${user.generoId}`)
            .get()
        ).data()?.value
      ) as  GeneroEntity;

      const userPreferencia = await PreferenciaRepository.fbGetByUserId(user.usuarioId);

      const preferenciaGenero = JSON.parse(
        (
          await firestore()
            .collection("database")
            .doc(`genero#${userPreferencia!.generoId}`)
            .get()
        ).data()?.value
      ) as  GeneroEntity;

      let todos = {...user, ...userPreferencia!, usuarioGenero: userGenero.generoDescricao, preferenciaGenero: preferenciaGenero.generoDescricao }

      res.send({ data: todos }).status(200);
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

      res.send({ data: todos }).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  
  public static getAge(birthDate: Date) {
    var today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  public async getUsuariosByPreference(req: Request, res: Response) {
    try {
      const userId = req.params.id;

      console.log(userId);

      const userPreferencia = await PreferenciaRepository.fbGetByUserId(parseInt(userId));

      const usuarios = (await firestore()
          .collection("database").get()).docs.filter( docs => {
            const isUsuario = docs.id.split("#")[0] == 'usuario';
            if(isUsuario){
              const usuario = (JSON.parse(docs.data().value) as UsuarioEntity);
              const age = UsuarioController.getAge(new Date(usuario.usuarioDataDeNascimento));
              return userPreferencia.preferenciaIdadeMaxima >= age && 
               userPreferencia.preferenciaIdadeMinima <= age &&
               userPreferencia.generoId == usuario.generoId &&
               userPreferencia.usuarioId != usuario.usuarioId;
            }
            return false;
          });
      const todos = await Promise.all(usuarios.map( async e => { 
        const u = JSON.parse(e.data().value) as UsuarioEntity;

        const uGenero = JSON.parse(
          (
            await firestore()
              .collection("database")
              .doc(`genero#${u.generoId}`)
              .get()
          ).data()?.value
        ) as  GeneroEntity;
        return { ...u, usuarioGenero: uGenero.generoDescricao }
      }));

      res.send({ data: todos }).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  
  

  public async updateUsuario(req: Request, res: Response) {
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

      res.send({ data: todos }).status(200);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}

export default UsuarioController;
