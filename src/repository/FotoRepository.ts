import { FotoEntity } from "../entitys/FotoEntity";
import BaseRepository from "./BaseRepository";

export default class FotoRepository extends BaseRepository {

    public static async getByUsuarioId(usuarioId: number) {
        const sql = `SELECT "fotoUrl", pricipal
            FROM public.foto
            where "usuarioId" = ${usuarioId};`;
        return this.fetch<FotoEntity[]>(sql);
    }

    public static async getAll() {
        const sql = `SELECT * 
            FROM public.foto;`
        return this.fetch<FotoEntity[]>(sql);
    }
}