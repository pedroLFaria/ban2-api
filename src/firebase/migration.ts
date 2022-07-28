import { json } from "body-parser";
import { firestore } from "firebase-admin";
import { omit } from "lodash";
import CurtidaRepository from "../repository/CurtidaRepository";
import FotoRepository from "../repository/FotoRepository";
import GeneroRepository from "../repository/GeneroRepository";
import PreferenciaRepository from "../repository/PreferenciaRepository";
import UsuarioRepository from "../repository/UsuarioRepository";

export default class migration {
  public static async toKeyValye() {
    const curtidas = await CurtidaRepository.getAll();
    const fotos = await FotoRepository.getAll();
    const generos = await GeneroRepository.getAll();
    const preferencias = await PreferenciaRepository.getAll();
    const usuarios = await UsuarioRepository.getAll();
    curtidas.forEach(async (e) => {
      await firestore()
        .collection("database")
        .doc(
          `curtida#usuarioId:${e["usuarioId"]};usuarioAlvoId:${e["usuarioAlvoId"]}`
        )
        .set({ value: JSON.stringify(e) });
    });
    fotos.forEach(async (e) => {
      await firestore()
        .collection("database")
        .doc(`foto#${e["fotoId"]}`)
        .set({ value: JSON.stringify(e) });
    });
    generos.forEach(async (e) => {
      await firestore()
        .collection("database")
        .doc(`genero#${e["generoId"]}`)
        .set({ value: JSON.stringify(e) });
    });
    preferencias.forEach(async (e) => {
      await firestore()
        .collection("database")
        .doc(`preferencia#${e["preferenciaId"]}`)
        .set({ value: JSON.stringify(e) });
    });
    usuarios.forEach(async (e) => {
      await firestore()
        .collection("database")
        .doc(`usuario#${e["usuarioId"]}`)
        .set({ value: JSON.stringify(e) });
    });
  }
}
