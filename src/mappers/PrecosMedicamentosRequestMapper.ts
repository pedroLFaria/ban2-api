import { Request } from "express";
import { HttpException } from "../exceptions/HttpExceptions";
import errorHandler from "../hanlder/errorHandler";

export interface PrecosMedicamentosRequestDto {
  mes?: Mes;
  ano?: string;
  pdf?: boolean;
  xls?: boolean;
}

type Mes =
  | ""
  | "janeiro"
  | "fevereiro"
  | "março"
  | "abril"
  | "maio"
  | "junho"
  | "julho"
  | "agosto"
  | "setembro"
  | "outubro"
  | "novembro"
  | "dezembro";

const requestToPrecosMedicamentosRequestDto = (
  req: Request
): PrecosMedicamentosRequestDto => {
  var dto: PrecosMedicamentosRequestDto = {};
  try {
    dto = {
      mes: req.params.mes as Mes,
      ano: parseInt(req.params.ano).toString(),
      pdf: Boolean(JSON.parse(req.query.pdf ? (req.query.pdf as string) : "1")),
      xls: Boolean(JSON.parse(req.query.xls ? (req.query.xls as string) : "1")),
    };
  } catch (e) {
    throw new HttpException(400, "Falha ao capturar parâmetros");
  }
  return dto;
};

export default requestToPrecosMedicamentosRequestDto;
