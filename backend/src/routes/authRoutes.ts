// parent routes : /auth/*

import express from "express";
import {
  adminLogin,
  liveUserLogin,
  userLogin,
} from "../controllers/authController";

const router = express.Router();

// POST route to login
router.post("/user", (req: express.Request, res: express.Response) => {
  userLogin(req, res);
});

router.post("/live-user", (req: express.Request, res: express.Response) => {
  liveUserLogin(req, res);
});

router.post("/admin", (req: express.Request, res: express.Response) => {
  adminLogin(req, res);
});
export default router;
