import express from 'express';
import { adminLogin, userLogin } from '../../controllers/authController';

const router = express.Router();

// POST route to login
router.post('/user', (req:express.Request, res:express.Response)=>{
  userLogin(req, res);
});

router.post("/admin", (req:express.Request, res:express.Response)=>{
  adminLogin(req, res);
});
export default router;
