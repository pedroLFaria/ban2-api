import { Request, Response } from "express";
import curtidaRepository from "../repository/CurtidaRepository";
import curtidaDto from "../models/CurtidaDto";
import CurtidaEntity from "../entitys/curtidaEntity";

class CurtidaController {

  public async post(req: Request, res: Response) {
    const dto = req.body as CurtidaEntity;

    await curtidaRepository.insert(dto);
    res.send({ data: dto }).status(200);
  }

  public async getMatches(req: Request, res: Response) {    
    const userId = parseInt(req.params.id);
    const curtidas = curtidaRepository.getMatches(userId);
    res.send({ data: curtidas }).status(200);
  }

  public async delete(req: Request, res: Response) {
      const userId = parseInt(req.params.id);
      curtidaRepository.delete(userId);
      res.send().status(200);
  }
}

export default CurtidaController;
