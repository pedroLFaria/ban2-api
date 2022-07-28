import { firestore } from "firebase-admin";
import PreferenciaEntity from "../entitys/PreferenciaEntity";
import BaseRepository from "./BaseRepository";
export default class PreferenciaRepository extends BaseRepository {

    public static async update(entity: PreferenciaEntity, usuarioId: number) {
        const sql = `UPDATE public.preferencia
        SET "preferenciaIdadeMinima"=${entity.preferenciaIdadeMinima}, 
            "preferenciaIdadeMaxima"=${entity.preferenciaIdadeMaxima}, 
            "generoId"=${entity.generoId}
        WHERE 
            "usuarioId" = ${usuarioId};`;
        await this.edit(sql);
    }
    
    public static async getAll() {
        const sql = `SELECT  *
        FROM public.preferencia;`;
        return await this.fetch<PreferenciaEntity>(sql);
    }

    public static async get(id: number) {
        const sql = `SELECT  *
        FROM public.preferencia
        where "preferenciaId" = ${id}`;
        return this.fetch(sql);
    }

    public static async getByUsuarioId(usuarioId: number) {
        const sql = `SELECT *
        FROM public.preferencia
        where "usuarioId" = ${usuarioId}`;
        return this.fetch(sql);
    }

    public static async fbGetByUserId(userId: number){
        const preferencias = await firestore().collection("database").get();

        let userPreferencia: PreferenciaEntity;
        preferencias.forEach((doc) => {
          const data = JSON.parse(doc.data()?.value) as PreferenciaEntity;
          const id = doc.id.split("#")[0];
          if (id == "preferencia" && data.usuarioId == userId)
            userPreferencia = data;
        });

        return userPreferencia!;
    }
}