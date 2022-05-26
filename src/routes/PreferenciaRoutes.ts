import { Router } from "express";
import PreferenciaController from "../controllers/PreferenciaController";

const router: Router = Router();
const preferenciaController = new PreferenciaController();


router.post('/usuario/:id', preferenciaController.updatePreferenciaByUsuario);
export const Preferencia: Router = router;
