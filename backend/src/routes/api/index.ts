import { Router } from "express";
import ramRoutes from "./ramRoutes";
import userRoutes from "./userRoutes";
import teamRoutes from "./teamRoutes";
import testRoutes from "./quizRoutes";
import roundRoutes from "./roundRoutes";
import questionRoutes from "./questionRoutes";
import submissionRoutes from "./submissionRoutes";

const router = Router();

router.use(ramRoutes);
router.use(userRoutes);
router.use(teamRoutes);
router.use(testRoutes);
router.use(roundRoutes);
router.use(questionRoutes);
router.use(submissionRoutes);

export default router;
