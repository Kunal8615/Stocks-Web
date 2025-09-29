import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import Stock from "../models/stock.model.js";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,  // typee typo fix
        required: true,
        index: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    pan: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    total_invested: {

        type: Number,
        default: 0
    },
    wallet_money: {
        type: Number,
        default: 0
    },
    return: {
        type: Number,
        default: 0
    },
    current_value: {
        type: Number,
        default: 0
    },
    stocks: [
        {
          stock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stock',         
          },
          quantity: {
            type: Number,
            min: 1
          }
        }
      ],
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
})


UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}



UserSchema.methods.generateAccessToken = async function () {
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username,
        name: this.name
    }
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" })
    return token;
}

UserSchema.methods.generateRefreshToken = async function () {
    const payload = {
        _id: this._id
    };
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10d' });
    return token;
}


const User = mongoose.model("User", UserSchema);
export default User;
