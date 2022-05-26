import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController";

const router: Router = Router();
const usuarioController = new UsuarioController();

router.get('/', usuarioController.getAll);
router.get('/:id', usuarioController.get);
router.post('/:id', usuarioController.updateUsuario);
router.get('/ByPreferences/:id', usuarioController.getUsuariosByPreference);
export const Usuario: Router = router;
