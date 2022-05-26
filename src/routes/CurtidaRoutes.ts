import { Router } from "express";
import CurtidaController from "../controllers/CurtidaController";

const router: Router = Router();
const curtidaController = new CurtidaController();


router.post('/', curtidaController.post);
router.delete('/:id', curtidaController.delete);
router.get('/matches/:id', curtidaController.getMatches);
export const Curtida: Router = router;
