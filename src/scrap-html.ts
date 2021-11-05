import fs from "fs";
import path from "path";
import cheerio from "cheerio";
import axios, { AxiosResponse } from "axios";
import { promisify } from "util";
import { Stream } from "stream";
import Archiver from "archiver";

interface Response {
  pdf: string | undefined;
  xls: string | undefined;
}

const AxiosInstance = axios.create();

let css = fs.readFileSync(
  path.resolve(__dirname, "../resource/lista-datas.html"),
  "utf8"
);

const $ = cheerio.load(css);

const statsTable = $("div.journal-content-article > p"); // Parse the HTML and extract just whatever code contains .statsTableContainer and has tr inside

const archive = Archiver("zip");
var elements = statsTable.find("span:contains(maio/18)");

if (elements.length == 0) {
  console.log("Not found");
}

var precosMedicamentos: Response[] = [];

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

archive.pipe(fs.createWriteStream("teste.zip"));

const promises: Promise<void | AxiosResponse>[] = [];
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
console.log("fim");
