import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
    title: String,
    description: { type: String, index: "text" },
    thumbnail: String,
    code: { type: String, unique: true },
    price: Number,
    stock: Number,
    category: { type: String, index: true },
    status: {
        type: Boolean,
        default: true,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);

export default Product;