import { Router } from "express";
import HealthCheckController from "../controllers/HealthCheckController";

const router: Router = Router();
const healthCheckController = new HealthCheckController();

router.get('/', healthCheckController.get);
router.get('/:id', healthCheckController.getId);
export const Healthcheck: Router = router;
