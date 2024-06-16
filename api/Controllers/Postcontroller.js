import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
export const getposts = async (req, res) => {
  const query = req.query;
  console.log(query);

  // Utility function to handle empty strings
  const handleEmptyValues = (value) => (value === "" ? undefined : value);

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: handleEmptyValues(query.city),
        type: handleEmptyValues(query.type),
        property: handleEmptyValues(query.property),
        bedroom: query.bedroom ? parseInt(query.bedroom) : undefined,
        price: {
          gte: query.minPrice ? parseInt(query.minPrice) : undefined,
          lte: query.maxPrice ? parseInt(query.maxPrice) : undefined,
        },
      },
    });
    res.status(200).json({ message: posts });
    console.log(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getpost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postdetail: true,
        User: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
          // Handle JWT verification error
          console.log(err);
          return res.status(500).json({ message: "Failed to verify JWT" });
        }

        // If verification succeeds, check saved post
        try {
          const saved = await prisma.savedpost.findUnique({
            where: {
              userid_postid: {
                postid: id,
                userid: payload.id,
              },
            },
          });
          // Send response with isSaved property
          return res.status(200).json({ ...post, isSaved: saved ? true : false });
        } catch (error) {
          console.log(error);
          return res.status(500).json({ message: "Error fetching saved post" });
        }
      });
    } else {
      // If no token is found, respond without isSaved property
      return res.status(200).json(post);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get post" });
  }
};


export const addpost = async (req, res) => {
  const tokenid = req.userid;
  const body = req.body;
  console.log(body.postdata, body.postdetail)

  try {
    const newpost = await prisma.post.create({
      data: {
        ...body.postdata,
        userid: tokenid,
        postdetail:{
            create:body.postdetail
        }
      },
    });
    res.status(200).json({ newpost });
  } catch (error) {
    res.status(500).json({ mesage: error });
  }
};

export const updatepost = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ mesage: "it failed" });
  }
};

export const deletepost = async (req, res) => {
  const tokenid = req.userid;
  const id = req.params.id;

  try {
    const findpost = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (findpost.userid !== tokenid) {
      return res.status(500).json({ mesage: "it no match" });
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });
    res.status(200).json({ mesage: "it deleted" });
  } catch (error) {
    res.status(500).json({ mesage: "it failed" });
  }
};


export const profilepost = async (req, res) => {
  const tokenid = req.userid;
  console.log(tokenid)

  try {
    const mypost = await prisma.post.findMany({
      where:{
        userid:tokenid
      }
    });
  //  console.log(mypost)
   // res.status(200).json({ mypost });
   const savepostitem = await prisma.savedpost.findMany({
    where:{
      userid:tokenid ,
      
    },include:{post:true}
  });
const savepost=savepostitem.map((item)=>item.post)
console.log(savepost)
console.log(savepostitem)

  if (!savepost){ res.status(200).json({ mypost });} else {res.status(200).json({ mypost,savepost });}

  } catch (error) {
    res.status(500).json({ mesage: error });
  }
};