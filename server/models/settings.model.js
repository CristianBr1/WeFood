import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    serviceFee: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    restaurantOpen: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

const SettingsModel = mongoose.model("settings", settingsSchema);
export default SettingsModel;
