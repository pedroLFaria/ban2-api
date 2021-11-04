import express, { Application, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import cheerio from "cheerio";
import fs from "fs";
import { promisify } from "util";
import { pipeline, Stream } from "stream";
import Archiver from "archiver";
import cors from 'cors';

interface _Response {
  pdf: string | undefined;
  xls: string | undefined;
}

const url =
  "https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/cmed/precos/anos-anteriores/anos-anteriores";
const AxiosInstance = axios.create();
const finished = promisify(Stream.finished);

const app: Application = express();
const port: number = 3000;
app.use(cors());
app.get("/", async (req: Request, res: Response) => {
  const archive = Archiver("zip");
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=my.zip");

  AxiosInstance.get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const statsTable = $("div.journal-content-article > p");
      var elements = statsTable.find("span:contains(maio/18)");
      
      if (elements.length == 0) {
        console.log("Not found");
      }

      var precosMedicamentos: _Response[] = [];

      elements.each((index, element) => {
        var pdf: string | undefined;
        var xls: string | undefined;

        const firstChild = $(element).next();

        if (firstChild.text() == "PDF") {
          pdf = firstChild.attr("href");
        } else if (firstChild.text() == "XLS") {
          xls = firstChild.attr("href");
        }

        var secondChild: any;

        if (firstChild.next().text().trim() == ",") {
          secondChild = firstChild.next().next();
        }

        if (secondChild.text() == "PDF") {
          pdf = secondChild.attr("href");
        } else if (secondChild.text() == "XLS") {
          xls = secondChild.attr("href");
        }

        precosMedicamentos.push({
          pdf,
          xls,
        });
      });

      const promises: Promise<void | AxiosResponse>[] = [];

      archive.pipe(res);

      precosMedicamentos.forEach((e) => {
        promises.push(
          AxiosInstance.request({
            method: "GET",
            url: e.pdf,
            responseType: "stream",
          }).then((response) => {
            var name = e.pdf?.split("/").pop() + ".pdf";
            archive.append(response.data, { name: name });
          })
        );
        promises.push(
          AxiosInstance.request({
            method: "GET",
            url: e.xls,
            responseType: "stream",
          }).then((response) => {
            var name = e.xls?.split("/").pop() + ".xls";
            archive.append(response.data, { name: name });
          })
        );
      });
      
      Promise.all(promises).then(() => {        
        archive.finalize();        
      });

    })
    .catch(console.error);
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
