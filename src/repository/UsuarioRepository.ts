import UsuarioEntity from "../entitys/UsuarioEntity";
import BaseRepository from "./BaseRepository";

export default class UsuarioRepository extends BaseRepository {
    public static async getAll(){
        const sql = `SELECT "usuarioId", "usuarioNome", "usuarioSenha", "usuarioEmail", "generoId", "usuarioDataDeNascimento"
        FROM public.usuario;`;
        return await this.fetch<UsuarioEntity>(sql);
    }
}