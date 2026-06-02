const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

async function registerUser({ name, email, password }) {
  // TODO: fix this - password stored as plain text (preserved original TODO)
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });
    return { id: user.id, email: user.email };
  } catch (error) {
    // If it's a unique constraint error (P2002) for email
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

  if (user.password !== password) {
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
