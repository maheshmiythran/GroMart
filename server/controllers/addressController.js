import Address from "../models/Address.js";

// @route   POST /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;

    if (!address || !userId) {
      return res.status(400).json({ success: false, message: "Missing address or userId" });
    }

    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to add address" });
  }
};

// @route   GET /api/address/get?userId=...
export const getAddress = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to fetch addresses" });
  }
};

// @route   PUT /api/address/edit/:id
export const editAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Address.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Address updated", address: updated });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update address" });
  }
};

// @route   DELETE /api/address/delete/:id
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Address.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @route   GET /api/address/:id
export const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.json({ success: true, address });
  } catch (error) {
    console.error("Error fetching address by ID:", error);
    res.status(500).json({ success: false, message: "Failed to fetch address" });
  }
};
