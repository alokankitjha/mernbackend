import express from "express"
import { addpost, deletepost, getpost, getposts, profilepost, updatepost } from "../Controllers/Postcontroller.js"
import { verifytoken } from "../Middleware/Verifytoken.js"




const router= express.Router()

router.get("/",getposts)

router.get("/:id",getpost)

router.post("/:id" ,verifytoken, addpost)

router.put("/:id",updatepost)

router.delete("/:id",verifytoken,deletepost)
router.get("/profile/post",verifytoken,profilepost)

export default router;