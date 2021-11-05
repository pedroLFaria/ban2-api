import archiver from "archiver";
import axios, { AxiosResponse } from "axios";
import { Router, Request, Response, NextFunction } from "express";
import { Stream } from "stream";
import { HttpException } from "../exceptions/HttpExceptions";
import requestToPrecosMedicamentosRequestDto from "../mappers/PrecosMedicamentosRequestMapper";
import scrapUrlDePrecosMedicamentos from "../scrapers/PrecosMedicamentosScraper";
import documentDownloader from "../services/DocumentDownloader";
import htmlGet from "../services/HtmlGetter";

const router: Router = Router();

const url =
  "https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/cmed/precos/anos-anteriores/anos-anteriores";

const AxiosInstance = axios.create();

router.get(
  "/:mes/:ano",
  async (req: Request, res: Response, next: NextFunction) => {
    
    try {      
      var reqDto = requestToPrecosMedicamentosRequestDto(req);
      var html = await htmlGet(url);

      var documentsToDownload = scrapUrlDePrecosMedicamentos(
        html,
        reqDto.ano!,
        reqDto.mes!,
        reqDto.pdf,
        reqDto.xls
      );

      const archive = archiver("zip");

      const filename = `Precos_Medicamentos_${reqDto.mes}-${reqDto.ano}.zip`
      
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + filename
      );

      const promises: Promise<void | AxiosResponse>[] = [];
      
      console.log("Upload Iniciado!")

      documentsToDownload.forEach((e, i) => {
        promises.push(
          documentDownloader(AxiosInstance, e.url).then((response) => {
            var name = e.url?.split("/").pop() + "." + e.type;            
            archive.append(response.data, { name: name });
          }).then(()=> console.log(i + " download finalizado;"))
        );
      });      

      Promise.all(promises).then(() => {
        archive.pipe(res);
        archive.finalize();
        res.attachment(filename);
      });

    } catch (e) {
      if (e instanceof HttpException) {
        next(e);
      }
      next(new HttpException(500, (e as Error).message));
    }
  }
);

export const PrecosMedicamentos: Router = router;
