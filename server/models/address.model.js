import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    address_line: { type: String, default: "" }, // Rua, número
    complement: { type: String, default: "" }, // Complemento ou bloco/apartamento
    neighborhood: { type: String, default: "" }, // Bairro
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, required: [true, "Provide pincode"] },
    country: { type: String, default: "Brasil" },
    mobile: { type: String, default: null },
    favoriteAs: { type: String, default: "Casa" }, // Casa, Trabalho, etc.
    status: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("address", addressSchema);
export default AddressModel;
