import express, {Application, Request, Response} from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const url = "https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/cmed/precos/anos-anteriores/anos-anteriores";
const AxiosInstance = axios.create();

const app: Application = express();
const port: number = 3000;

app.get('/', async (req: Request, res: Response) => {
  
  var response;
  console.time('didnt wait');
  console.time('waited');  
  AxiosInstance.get(url)
  .then(
    response => {
      const html = response.data;
      response = html;
      res.send(response);
      console.timeEnd('waited');
    })
  .catch(console.error);

  console.timeEnd('didnt wait');
});



app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});