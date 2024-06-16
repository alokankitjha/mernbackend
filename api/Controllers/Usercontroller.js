import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getusers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ message: users });
    console.log(users.length);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const getuser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const updateuser = async (req, res) => {
  
    const id = req.params.id;
    const tokenid = req.userid;
  
    try {
      const { password, avatar, ...inputs } = req.body;
  
      // Hash the password if provided
      const hashpassword = password ? await bcrypt.hash(password, 10) : undefined;
  
      // Update user information
      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: {
          ...inputs,
          password: hashpassword,
          avatar: avatar,
        },
      });
  
      return res.status(200).json({ message: updatedUser });
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  };
  
export const deleteuser = async (req, res) => {
  const id = req.params.id;
  const tokenid = req.userid;
  try {
    if (id !== tokenid) {
      return res.status(403).json({ message: "Forbidden" });
    } else {
      await prisma.user.delete({
        where: { id: id },
      });
      return res.status(204).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};



export const savePost = async (req, res) => {
  const postid = req.body.postid;
  const tokenUserid = req.userid;

  console.log("Post ID:", postid);
  console.log("User ID from token:", tokenUserid);

  if (!tokenUserid) {
    return res.status(400).json({ message: "User ID not provided" });
  }

  try {
    const savedPost = await prisma.savedpost.findUnique({
      where: {
        userid_postid: {
          userid: tokenUserid,
          postid,
        },
      },
    });

    if (savedPost) {
      console.log("Saved post found:", savedPost);
      await prisma.savedpost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      console.log("No saved post found, creating new saved post");
      await prisma.savedpost.create({
        data: {
          userid: tokenUserid,
          postid,
        },
      });
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.error("Error in saving post:", err);
    res.status(500).json({ message: "An error occurred while saving the post." });
  }
};
