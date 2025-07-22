import Address from "../models/Address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address, userId } = req.body;

    if (!address || !userId) {
      return res.json({ success: false, message: "Missing address or userId" });
    }

    await Address.create({ ...address, userId });
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error);
    res.json({ success: false, message: error.message || "Failed to add address" });
  }
};

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.query.userId;
    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.json({ success: false, message: error.message || "Failed to fetch addresses" });
  }
};

// Update Address : /api/address/edit/:id
export const editAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Address.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, message: "Address updated", address: updated });
  } catch (error) {
    console.error("Error updating address:", error);
    res.json({ success: false, message: error.message || "Failed to update address" });
  }
};

// Delete Address : /api/address/delete/:id
export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const deleted = await Address.findByIdAndDelete(addressId);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }
    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getAddressById = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.json({ success: false, message: "Address not found" });
    }
    res.json({ success: true, address });
  } catch (error) {
    console.error("Error fetching address by ID:", error);
    res.json({ success: false, message: "Failed to fetch address" });
  }
};

