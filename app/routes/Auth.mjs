import express from "express";
import { connectToDatabase } from "../utils/dbUtils.mjs";
import jwt from "jsonwebtoken";

const router = express.Router();

const secretKey = "hi";

// Middleware pour la connexion à la base de données
const connectToDatabaseMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).send("Accès refusé. Token non fourni.");

  try {
    req.dbConnection = await connectToDatabase();
    next();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

router.post("/", connectToDatabaseMiddleware, async (req, res) => {
  const { username, password } = req.body;

  const queryString = `SELECT *
                         FROM t_users
                         WHERE useName = '${username}'
                           AND usePassword = '${password}'`;

  try {
    const [rows] = await req.dbConnection.query(queryString, [
      username,
      password,
    ]);
    if (rows.length > 0) {
      // signer et renvoyer votre token ici (utiliser un code http de succès)
      const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
