import PromoCode from "../models/PromoCode.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

// === SELLER/ADMIN ENDPOINTS ===

// Create Promo Code
export const createPromoCode = async (req, res) => {
    try {
        const { code, type, value, maxDiscount, minOrderValue, usageLimit, perUserLimit, expiryDate, status } = req.body;

        // check if exists
        const existing = await PromoCode.findOne({ code: code.toUpperCase() });
        if (existing) return res.json({ success: false, message: "Promo code already exists" });

        const newCode = await PromoCode.create({
            code: code.toUpperCase(),
            type,
            value,
            maxDiscount,
            minOrderValue: minOrderValue || 0,
            usageLimit: usageLimit || null,
            perUserLimit: perUserLimit || 1,
            expiryDate,
            status: status || 'active'
        });

        res.json({ success: true, message: "Promo Code created", promoCode: newCode });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get all Promo Codes
export const getPromoCodes = async (req, res) => {
    try {
        const codes = await PromoCode.find().sort({ createdAt: -1 });
        res.json({ success: true, promoCodes: codes });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Promo Code
export const updatePromoCode = async (req, res) => {
    try {
        const { id, code, type, value, maxDiscount, minOrderValue, usageLimit, perUserLimit, expiryDate, status } = req.body;

        // if code changes, check uniqueness
        if (code) {
            const existing = await PromoCode.findOne({ code: code.toUpperCase(), _id: { $ne: id } });
            if (existing) return res.json({ success: false, message: "Promo code name already in use" });
        }

        const updated = await PromoCode.findByIdAndUpdate(id, {
            ...(code && { code: code.toUpperCase() }),
            ...(type && { type }),
            ...(value !== undefined && { value }),
            ...(maxDiscount !== undefined && { maxDiscount }),
            ...(minOrderValue !== undefined && { minOrderValue }),
            ...(usageLimit !== undefined && { usageLimit }),
            ...(perUserLimit !== undefined && { perUserLimit }),
            ...(expiryDate && { expiryDate }),
            ...(status && { status })
        }, { new: true });

        if (!updated) return res.json({ success: false, message: "Promo code not found" });

        res.json({ success: true, message: "Promo Code updated", promoCode: updated });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Delete Promo Code (or archive)
export const deletePromoCode = async (req, res) => {
    try {
        const { id } = req.body;
        const promo = await PromoCode.findById(id);
        if (!promo) return res.json({ success: false, message: "Promo code not found" });

        if (promo.usedCount > 0) {
            // archive it instead
            promo.status = "expired";
            await promo.save();
            return res.json({ success: true, message: "Promo code has been used, marked as expired instead of deleting", promoCode: promo });
        }

        await PromoCode.findByIdAndDelete(id);
        res.json({ success: true, message: "Promo Code deleted" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// === CLIENT ENDPOINTS ===

// Validate Promo Code
export const validatePromoCode = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        const userId = req.user.id;

        if (!code) {
            return res.json({ success: false, message: "Please enter a promo code" });
        }

        const promo = await PromoCode.findOne({ code: code.toUpperCase() });

        if (!promo) {
            return res.json({ success: false, message: "Invalid or expired promo code" });
        }

        if (promo.status !== "active") {
            return res.json({ success: false, message: "This promo code is no longer active" });
        }

        if (new Date(promo.expiryDate) < new Date()) {
            return res.json({ success: false, message: "This promo code has expired" });
        }

        if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
            return res.json({ success: false, message: "This promo code's usage limit has been reached" });
        }

        if (cartTotal < promo.minOrderValue) {
            return res.json({ success: false, message: `This code is valid on orders above ₹${promo.minOrderValue}` });
        }

        // Check per-user limit
        const userOrdersCount = await Order.countDocuments({ userId, promoCode: promo.code });
        if (userOrdersCount >= promo.perUserLimit) {
            return res.json({ success: false, message: "You have reached the usage limit for this promo code" });
        }

        // Calculate discount
        let discountAmount = 0;
        if (promo.type === "flat") {
            discountAmount = promo.value;
        } else if (promo.type === "percent") {
            discountAmount = (cartTotal * promo.value) / 100;
            if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
                discountAmount = promo.maxDiscount;
            }
        }

        // Ensure discount doesn't exceed cart total
        discountAmount = Math.min(discountAmount, cartTotal);
        discountAmount = Math.floor(discountAmount); // Round down

        res.json({
            success: true,
            message: `Code ${promo.code} applied! You saved ₹${discountAmount}.`,
            promoCode: {
                code: promo.code,
                discountAmount
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
