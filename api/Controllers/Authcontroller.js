import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        console.log(req.body);
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                email
            }
        });
      console.log(newUser);
        res.status(201).json({ message: "Successfully created user" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to create user" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user.id, admin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: userPassword, ...userInfo } = user;

        res.cookie("token", token, {
            httpOnly: true,
            path: "/",
           secure:  true, // Ensure 'secure' for sameSite 'none'
           sameSite: "none", maxAge: 24 * 60 * 60 * 1000 
        }).status(200).json({ message: userInfo });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to login user" });
    }
};



export const logout = (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
        secure: true,
    }).status(200).json({ message: "Logout successful" });
};
