const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

async function registerUser({ name, email, password }) {
  // TODO: hash the password in the future (preserved intentional plain-text TODO)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password
    }
  });
  return { id: user.id, email: user.email };
}

async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404; // corrected to proper 404
    throw error;
  }

  if (user.password !== password) {
    const error = new Error("Wrong password");
    error.status = 401; // corrected to proper 401
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
