const mongoose = require("mongoose");
const { Schema } = mongoose;

const wishlistSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        size: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        addedOn: {
            type: Date,
            default: Date.now
        }
    }]
})

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;

