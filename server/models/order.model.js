import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: [true, "Provide orderId"],
      unique: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
        },
        product_details: {
          name: String,
          image: [String],
        },
        quantity: {
          type: Number,
          default: 1,
        },
        extras: [
          {
            name: String,
            price: Number,
          },
        ],
        observations: {
          type: String,
          default: "",
        },
        totalPrice: {
          type: Number,
          default: 0,
        },
      },
    ],
    paymentId: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      enum: ["pendente", "pago", "falhou"],
      default: "pendente",
    },
    order_status: {
      type: String,
      enum: [
        "Pendente",
        "Em preparo",
        "Saiu para entrega",
        "Entregue",
        "Cancelado",
      ],
      default: "Pendente",
    },

    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
    },
    pickup: {
      type: Boolean,
      default: false,
    },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    invoice_receipt: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
