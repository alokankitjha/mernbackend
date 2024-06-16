import express from "express"
import { login, logout, register } from "../Controllers/Authcontroller.js"
import { deleteuser, getuser, getusers, savePost, updateuser } from "../Controllers/Usercontroller.js"
import { verifytoken } from "../Middleware/Verifytoken.js"

const router= express.Router()

router.get("/users",verifytoken,getusers)

router.get("/:id",verifytoken,getuser)

router.put("/:id",verifytoken,updateuser)

router.delete("/:id",verifytoken,deleteuser)
router.post("/save",verifytoken,savePost)

export default router;