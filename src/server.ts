import express from 'express';
import { json, urlencoded } from 'body-parser';
import pool from "./db/dbconnector";
import { Usuario } from './routes/UsuarioRoutes';
import cors from 'cors';
import { Foto } from './routes/FotoRoutes';
import { Preferencia } from './routes/PreferenciaRoutes';
import { Curtida } from './routes/CurtidaRoutes';
class Server {
    private app;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();
    }

    private config() {
        this.app.use(urlencoded({ extended:true }));
        this.app.use(json({ limit: '1mb' })); // 100kb default
        this.app.use(cors());
    }

    private dbConnect() {
      pool.connect(function (err) {
            if (err) throw new Error(err.message);
            console.log('Connected');
          }); 
    }

    private routerConfig() {
        this.app.use('/usuario', Usuario);
        this.app.use('/foto', Foto);
        this.app.use('/preferencia', Preferencia);
        this.app.use('/curtida', Curtida);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }
}

export default Server;