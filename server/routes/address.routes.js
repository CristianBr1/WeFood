import express from "express";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress
} from "../controllers/address.controller.js";
import { authMiddleware  } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAddresses);
router.post("/", authMiddleware, createAddress);
router.put("/:id", authMiddleware, updateAddress);
router.delete("/:id", authMiddleware, deleteAddress);

export default router;
