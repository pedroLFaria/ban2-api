import express from 'express';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import { Healthcheck } from './routes/HealthCheck';

class Server {
    private app;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();        
    }

    private config() {
        this.app.use(urlencoded({ extended:true }));
        this.app.use(json({ limit: '1mb' })); // 100kb default
        this.app.use(cors());
    }

    private routerConfig() {
        this.app.use('/healthcheck', Healthcheck)
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            var server = this.app.listen(port, () => {
                resolve(port);
                server.close();
            }).on('error', (err: Object) => reject(err));
        });

    }
}

export default Server;