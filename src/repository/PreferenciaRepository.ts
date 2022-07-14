import Genero from "../enums/genero";
import PreferenciaDto from "../models/PreferenciaDto";
import BaseRepository from "./BaseRepository";

export default class PreferenciaRepository extends BaseRepository {

    public static async update(dto: PreferenciaDto, usuarioId: number) {
        const sql = `UPDATE public.preferencia
        SET "preferenciaIdadeMinima"=${dto.preferenciaIdadeMinima}, 
            "preferenciaIdadeMaxima"=${dto.preferenciaIdadeMaxima}, 
            "generoId"=${Genero[dto.preferenciaGenero]}
        WHERE 
            "usuarioId" = ${usuarioId};`;
        this.edit(sql);
    }
}