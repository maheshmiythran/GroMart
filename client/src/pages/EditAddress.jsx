import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const EditAddress = () => {
  const { id } = useParams();
  const { axios, user } = useAppContext();
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const { data } = await axios.get(`/api/address/${id}`);
        if (data.success && data.address) {
          setFormData(data.address);
        } else {
          toast.error(data.message || "Address not found");
          navigate("/cart");
        }
      } catch (err) {
        toast.error("Failed to fetch address");
        navigate("/cart");
      }
    };
    fetchAddress();
  }, [id, axios, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user._id) {
      toast.error("Please log in to update your address");
      return;
    }

    try {
      const { data } = await axios.put(`/api/address/edit/${id}`, {
        ...formData,
        userId: user._id,
      });

      if (data.success) {
        toast.success("Address updated!");
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const isFormValid = Object.values(formData).every(Boolean);

  return (
    <div className="max-w-lg mx-auto mt-12 p-4 border border-gray-300 rounded">
      <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["street", "city", "state", "country"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field}
            value={formData[field]}
            onChange={(e) =>
              setFormData({ ...formData, [field]: e.target.value })
            }
            className="w-full p-2 border border-gray-300"
            required
          />
        ))}
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 w-full disabled:opacity-50"
          disabled={!isFormValid}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditAddress;
