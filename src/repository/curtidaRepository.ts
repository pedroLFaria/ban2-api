import pool from "../db/dbconnector";
import curtidaDto from "../models/CurtidaDto";
import curtidaEntity from "../models/curtidaEntity";

export default class curtidaRepository {

    public static async insert(dto: curtidaDto) {
        const dbClient = await pool.connect();
        const sql = `INSERT INTO public.curtida(
            "usuarioId", "usuarioAlvoId", "isCurtida", "curtidaData")
            VALUES (${dto.usuarioId}, ${dto.usuarioAlvoId}, ${dto.isCurtida}, now()) 
            ON CONFLICT ("usuarioId", "usuarioAlvoId") DO UPDATE
            SET "isCurtida"=${dto.isCurtida},
            "curtidaData"= now();`;
            
        await dbClient.query(sql);        
        dbClient.release();
    }

    public static async getMatches(userId: number) {
        const dbClient = await pool.connect();
        const sql = `SELECT  u."usuarioNome",
            u."usuarioId"
        FROM public.curtida ca
        join public.usuario u on u."usuarioId" = ca."usuarioId"
        where ca."usuarioAlvoId" = ${userId} and ca."isCurtida"=true and ca."usuarioId" in (
            SELECT c."usuarioAlvoId"
                FROM public.curtida c
                where c."usuarioId" = ${userId} and c."isCurtida"=true);`;
        const { rows } = await dbClient.query(sql);
        dbClient.release();
        const todos: curtidaEntity[] = rows;
        return todos;
    }

    public static async delete(userId: number){
        const dbClient = await pool.connect();
      const sql = ` DELETE FROM public.curtida
      WHERE "usuarioId" = ${userId};`;
      await dbClient.query(sql);
      dbClient.release();
    }
}
