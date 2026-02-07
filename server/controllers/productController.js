import { cloudinary } from '../configs/cloudinary.js';
import Product from "../models/Product.js";
import Order from "../models/Order.js";
// Add Product : /api/product/add
export const AddProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);

        const images = req.files;

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );

        await Product.create({ ...productData, image: imagesUrl });
        res.json({
            success: true,
            message: "Product added successfully"
        });

    } catch (error) {

        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Get Product : /api/product/list
export const productList = async (req, res) => {
    try {
        const products = await Product.find({})
        res.json({ success: true, products: products });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Get single Product : /api/product/id
export const ProductById = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        res.json({ success: true, product: product });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}

// Change Product inStock : /api/product/stock

export const ChangeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        await Product.findByIdAndUpdate(id, { inStock });
        res.json({ success: true, message: "Stock updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }

}

// Delete Product : /api/product/delete/:id
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Status  : /api/product/update-status/:id
export const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;
    try {
        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Product : /api/product/update
export const updateProduct = async (req, res) => {
    try {
        const { id, updatedData } = req.body;
        await Product.findByIdAndUpdate(id, updatedData);
        res.json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
