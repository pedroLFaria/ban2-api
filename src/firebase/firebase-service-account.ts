import { ServiceAccount } from "firebase-admin";
import account from './firebase-service-account.json';

const serviceAccount: ServiceAccount = {  
  projectId: account.project_id,
  privateKey: account.private_key,
  clientEmail: account.client_email,
}

export default serviceAccount;
