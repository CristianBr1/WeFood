import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // 🔹
  quantity: { type: Number, default: 1 },
  extras: { type: Array, default: [] },
  meatCount: { type: Number, default: 1 },
  observations: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("CartProduct", cartProductSchema);
