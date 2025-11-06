import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Conexão com o backend OK 🚀",
    timestamp: new Date(),
  });
});

export default router;
