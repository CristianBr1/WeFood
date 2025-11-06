import mongoose from "mongoose";

const extraSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
});

const meatOptionsSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 1 },
  pricePerExtra: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: { type: String, required: true },
    extras: [extraSchema],
    meatOptions: meatOptionsSchema,
    customerObservations: { type: String, default: "" },
  },
  { timestamps: true }
);

// 🔹 Verifica se já existe o modelo antes de criar
export default mongoose.models.Product || mongoose.model("Product", productSchema);
