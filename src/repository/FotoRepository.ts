import FotoEntity from "../entitys/FotoEntity";
import BaseRepository from "./BaseRepository";

export default class FotoRepository extends BaseRepository {

    public static async getByUsuarioId(usuarioId: number) {
        const sql = `SELECT 
            "fotoUrl", 
            pricipal
            FROM public.foto
            where "usuarioId" = ${usuarioId};`;
        return await this.fetch<any>(sql);
    }

    public static async getAll() {
        const sql = `SELECT * 
            FROM public.foto;`
        return await this.fetch<FotoEntity>(sql);
    }
}