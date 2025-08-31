import { Router } from "express";
import bcrypt from "bcryptjs";
import { signJwt } from "../utils/jwt";

// אם יש לך מודל אמיתי:
// import { UserModel } from "../models/User";

const router = Router();

// דמו קצר לרישום
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    // בדוגמה: במקום DB אמיתי
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: "u_" + Date.now(),
      name,
      email,
      phone,
      passwordHash,
      role: "USER",
      friends: [],
      createdAt: new Date()
    };

    // החתימה היא סינכרונית ומחזירה string
    const token = signJwt({ id: user.id, role: user.role }, { expiresIn: "2h" });
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

// דמו קצר ללוגין
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // בדוגמה: במקום DB אמיתי — משתמש קשיח
    const mockUser = {
      id: "u_demo",
      email: "demo@demo.com",
      name: "Demo",
      phone: "0500000000",
      passwordHash: await bcrypt.hash("secret123", 10),
      role: "USER",
      friends: [],
      createdAt: new Date()
    };

    if (email !== mockUser.email) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, mockUser.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signJwt({ id: mockUser.id, role: mockUser.role }, { expiresIn: "2h" });
    res.json({ user: mockUser, token });
  } catch (err) {
    next(err);
  }
});

export default router;
