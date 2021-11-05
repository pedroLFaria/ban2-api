import Cheerio from "cheerio";
import { HttpException } from "../exceptions/HttpExceptions";
import DocumentToDownload from "../models/DocumentToDownload";

const scrapUrlDePrecosMedicamentos = (
  html: string,
  ano: string,
  mes: string,
  pdf = true,
  xls = true
): DocumentToDownload[] => {
  const $ = Cheerio.load(html);
  const statsTable = $("div.journal-content-article > p");

  var elements = statsTable.find(`span:contains(${mes}/${ano})`);  

  if(elements.length == 0 && ano.length == 4){
    elements = statsTable.find(`span:contains(${mes}/${ano.substring(2)})`);
  }

  var urlsDocumentos: DocumentToDownload[] = [];

  elements.each((_, element) => {

    var _element = $(element).next();

    if (pdf && _element.text() == "PDF" && _element.attr("href")) {
      urlsDocumentos.push({ url: _element.attr("href")!, type: "pdf" });
    }    
    if (xls && _element.text() == "XLS" && _element.attr("href")) {
      urlsDocumentos.push({ url: _element.attr("href")!, type: "xls" });
    }

    if (_element.next().text().trim() == ",") {
      _element = _element.next().next();
    }

    if (pdf && _element.text() == "PDF" && _element.attr("href")) {
      urlsDocumentos.push({ url: _element.attr("href")!, type: "pdf" });
    } 
    if (xls && _element.text() == "XLS" && _element.attr("href")) {
      urlsDocumentos.push({ url: _element.attr("href")!, type: "xls" });
    }

  });

  if(urlsDocumentos.length == 0) reportNotFound();

  return urlsDocumentos;
};

const reportNotFound = () => {
   throw new HttpException(404, "Relatórios não encontrados para os parâmetros informada");
}

export default scrapUrlDePrecosMedicamentos;
