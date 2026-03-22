import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        type: { type: String, enum: ["flat", "percent"], required: true },
        value: { type: Number, required: true },
        maxDiscount: { type: Number, default: null }, // for percent
        minOrderValue: { type: Number, default: 0 },
        usageLimit: { type: Number, default: null }, // null means unlimited
        usedCount: { type: Number, default: 0 },
        perUserLimit: { type: Number, default: 1 },
        expiryDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ["active", "inactive", "expired"],
            default: "active",
        },
    },
    { timestamps: true }
);

const PromoCode =
    mongoose.models.promoCode || mongoose.model("promoCode", promoCodeSchema);

export default PromoCode;
