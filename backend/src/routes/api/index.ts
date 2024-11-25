import { Router } from "express";
import ramRoutes from "./ramRoutes";
import userRoutes from "./userRoutes";
import teamRoutes from "./teamRoutes";
import testRoutes from "./quizRoutes";
import roundRoutes from "./roundRoutes";
import questionRoutes from "./questionRoutes";
import submissionRoutes from "./submissionRoutes";
import liveQuizRoutes from "./liveQuizRoute";
import { adminProtectionMiddleware } from "../../controllers/protectController";

const router = Router();

router.use(ramRoutes);

router.use((req, res, next) => {
  if(process.env.NODE_ENV == 'dev') return next();
  adminProtectionMiddleware(req, res, next);
});

router.use(liveQuizRoutes)
router.use(userRoutes);
router.use(teamRoutes);
router.use(testRoutes);
router.use(roundRoutes);
router.use(questionRoutes);
router.use(submissionRoutes);

export default router;
