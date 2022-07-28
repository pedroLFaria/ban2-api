import express from 'express';
import { json, urlencoded } from 'body-parser';
import pool from "./db/dbconnector";
import { Usuario } from './routes/UsuarioRoutes';
import cors from 'cors';
import { Foto } from './routes/FotoRoutes';
import { Preferencia } from './routes/PreferenciaRoutes';
import { Curtida } from './routes/CurtidaRoutes';
import firebase, { firestore } from 'firebase-admin';
import { Firestore, getFirestore } from 'firebase-admin/firestore'
import serviceAccount from './firebase/firebase-service-account';

class Server {
    private app;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();
        this.fbConnect();
        this.scriptInicial();
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

    private fbConnect() {
        firebase.initializeApp({
            credential: firebase.credential.cert(serviceAccount)
        });
    }

    private scriptInicial(){
        const db = firestore().collection('foo').doc('ble').set({
            name: 'ada',
            email: 'fdsa'
        })
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