import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number }
      }
    ],
    default: []
  },
  createdAt: { type: Date, default: Date.now }
});

cartSchema.pre("findOne", function(){
    this.populate("products.product");
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;