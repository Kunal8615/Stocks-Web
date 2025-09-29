import mongoose from "mongoose";
import User from "./user.model.js";
const StockSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    description: {
        type: String,
    },
    price_per_unit: {
        type: Number,
        required: true
    },
    available_quantity: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        default: 'other'
    },
    invested_amount: {  
        type: Number,
        default: 0
    },
    investor_count: { 
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Stock = mongoose.model("Stock", StockSchema);

export default Stock;
