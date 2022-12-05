import { Request, Response } from "express";
import { STATUS_CODES } from "http";
import { listenerCount } from "process";
import { LoremIpsun } from "../models/LoremIpsun";
import loremIpsun from '../resource/lorem_ipsun.json';
class HealthCheckController {

  public async get(req: Request, res: Response) {
    var li = loremIpsun as LoremIpsun[];
    const liId = li.map(li => li._id );
    res.send({data: {
      length: li.length,
      idList: liId,
    }}).status(200);
    li=[];
  }

  public async getId(req: Request, res: Response) {
    const li = loremIpsun as LoremIpsun[];
    const hcId = req.params.id;
    const foundLi = li.filter(li => li._id == hcId);
    if(foundLi)
      res.send({data: foundLi}).status(200);
    else
      res.send().status(404);
  }
}

export default HealthCheckController;
