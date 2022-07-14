import Genero from "../enums/genero";

export default interface PreferenciaDto {
    preferenciaIdadeMinima: number;
    preferenciaIdadeMaxima: number;
    preferenciaGenero: Genero;    
}