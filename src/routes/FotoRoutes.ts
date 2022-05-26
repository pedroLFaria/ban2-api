import { Router } from "express";
import FotoController from "../controllers/FotoController";

const router: Router = Router();
const usuarioController = new FotoController();


router.get('/:id', usuarioController.get);
export const Foto: Router = router;
