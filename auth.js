
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByUsername } from "../utils/db.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};

  // Kiểm tra dữ liệu đăng nhập
  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required."
    });
  }

  // Tìm người dùng
  const user = findByUsername(username);

  if (!user) {
    return res.status(401).json({
      error: "Invalid credentials."
    });
  }

  // Kiểm tra mật khẩu bcrypt
  const isValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isValid) {
    return res.status(401).json({
      error: "Invalid credentials."
    });
  }

  // Tạo JWT
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ token });
});

export default router;
