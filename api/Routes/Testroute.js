import express from "express";
import jwt from "jsonwebtoken";

import { verifytoken } from "../Middleware/Verifytoken.js";

const router = express.Router();

router.post("/test",verifytoken, (req, res) => {
 // const token = req.cookies.token;

 console.log(req.userid)
});

router.post("/testadmin", (req, res) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid" });
      } else { if (!payload.admin){ return res.status(200).json({ message: "Token is  not valid admin " });} else{
        return res.status(200).json({ message: "Token is valid", payload });
      }
        
      }
    });
  });

export default router;
