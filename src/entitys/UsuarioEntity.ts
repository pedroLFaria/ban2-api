interface UsuarioEntity {
    usuarioId: number;
    usuarioNome: string;
    usuarioSenha: string;
    usuarioEmail: string;
    genero: GeneroEntity;
    usuarioDataDeNascimento: Date;
}