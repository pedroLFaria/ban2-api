import GeneroEntity from "../entitys/GeneroEntity";
import BaseRepository from "./BaseRepository";

export default class GeneroRepository extends BaseRepository {

    public static async getAll(){
        const sql = `SELECT "generoId", "generoDescricao"
        FROM public.genero;`
        return await this.fetch<GeneroEntity>(sql);
    }
}