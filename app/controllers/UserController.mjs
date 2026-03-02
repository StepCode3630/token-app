import express from "express";

// Import du module jwt
import jwt from "jsonwebtoken";

const router = express.Router();

export const get = (req, res) => {
  // Remplacez cette portion de code par votre traitement du jeton JWT
  return res.status(418).json({ error: "Salam" });
};

router.get("/", get);

export default router;
