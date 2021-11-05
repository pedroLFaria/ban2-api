import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { PrecosMedicamentos } from "./routes/PrecosMedicamentosRoutes";
import errorHandler from "./hanlder/errorHandler";

const app: express.Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/", PrecosMedicamentos);
app.use(errorHandler);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});