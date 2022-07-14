interface PreferenciaEntity {
    preferenciaId: number;
    preferenciaTelefoneDDI: string;
    preferenciaTelefoneDDD: string;
    preferenciaTelefoneNumero: string;
    preferenciaIdadeMinima: number;
    preferenciaIdadeMaxima: number;
    genero: GeneroEntity;
    usuario: UsuarioEntity;
}