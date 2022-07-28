import pool from "../db/dbconnector";
import CurtidaEntity from "../entitys/curtidaEntity";
import curtidaDto from "../models/CurtidaDto";
import BaseRepository from "./BaseRepository";


export default class curtidaRepository extends BaseRepository {

    public static async insert(dto: CurtidaEntity) {
        const sql = `INSERT INTO public.curtida(
            "usuarioId", "usuarioAlvoId", "isCurtida", "curtidaData")
            VALUES (${dto.usuarioId}, ${dto.usuarioAlvoId}, ${dto.isCurtida}, now()) 
            ON CONFLICT ("usuarioId", "usuarioAlvoId") DO UPDATE
            SET "isCurtida"=${dto.isCurtida},
            "curtidaData"= now();`;
        await this.edit(sql);
    }

    public static async getMatches(userId: number) {
        const sql = `SELECT  u."usuarioNome",
            u."usuarioId"
        FROM public.curtida ca
        join public.usuario u on u."usuarioId" = ca."usuarioId"
        where ca."usuarioAlvoId" = ${userId} and ca."isCurtida"=true and ca."usuarioId" in (
            SELECT c."usuarioAlvoId"
                FROM public.curtida c
                where c."usuarioId" = ${userId} and c."isCurtida"=true);`;
        return await this.fetch<CurtidaEntity[]>(sql);
    }

    public static async getAll(){
        const sql =  `SELECT * 
                        FROM public.curtida;`
        return await this.fetch<CurtidaEntity[]>(sql);
    }

    public static async delete(userId: number){
        const sql = ` DELETE FROM public.curtida
            WHERE "usuarioId" = ${userId};`;
        this.edit(sql);
    }
}
