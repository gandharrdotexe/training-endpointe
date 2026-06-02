const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

async function registerUser({ name, email, password }) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });
    return { id: user.id, email: user.email };
  } catch (error) {
    if (error.code === "P2002") {
      const err = new Error("Email already registered");
      err.status = 400;
      throw err;
    }
    throw error;
  }
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = new Error("Wrong password");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d"
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email }
  };
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: { id }
  });

  if (!user) {
    const error = new Error("User missing");
    error.status = 404;
    throw error;
  }

  return { id: user.id, name: user.name, email: user.email };
}

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
