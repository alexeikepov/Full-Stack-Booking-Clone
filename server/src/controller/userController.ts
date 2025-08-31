 import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";
import { signJwt } from "../utils/jwt";

// POST /api/users/register
export async function registerUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({ name, email, phone, passwordHash, role: "USER" });

    const token = signJwt({ id: user.id, role: user.role }, { expiresIn: "2h" });
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/users/login
export async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signJwt({ id: user.id, role: user.role }, { expiresIn: "2h" });
    res.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/users (Protected)
export async function getUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await UserModel.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// GET /api/users/:id (Protected)
export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// PUT /api/users/:id (Protected)
export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, phone, role } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      id,
      { name, phone, role },
      { new: true }
    ).select("-passwordHash");

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/users/:id (Protected)
export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
}
