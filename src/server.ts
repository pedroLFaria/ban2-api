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
import migration from './firebase/migration';
import UsuarioEntity from './entitys/UsuarioEntity';
import PreferenciaEntity from './entitys/PreferenciaEntity';

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
      pool.connect(function (err: any) {
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

    private async scriptInicial(){
        migration.toKeyValye();
        
        const fbRows = await firestore()
        .collection("database")
        .doc(`usuario#${1}`)
        .get();

        const user = JSON.parse(fbRows.data()?.value) as UsuarioEntity;
        
        const genero = JSON.parse((await firestore()
        .collection("database")
        .doc(`genero#${user.generoId}`)
        .get()).data()?.value);

        const preferencias = await firestore()
            .collection("database")
            .get();
        
        let userPreferencia: PreferenciaEntity;
        preferencias.forEach(doc => {
            const data = JSON.parse(doc.data()?.value) as PreferenciaEntity;
            const id = doc.id.split('#')[0];
            if(id == 'preferencia' && data.usuarioId == user.usuarioId)
                userPreferencia = data;
        });
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