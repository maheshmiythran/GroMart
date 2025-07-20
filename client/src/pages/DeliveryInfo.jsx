import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DeliveryInfo = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-6 text-gray-700">
      <h1 className="text-3xl font-bold text-primary mb-4">Delivery Information</h1>
      <p className="mb-6 text-gray-600">
        We're committed to getting your groceries delivered fresh and on time. Here's everything you need to know about our delivery process.
      </p>

      {/* Delivery Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gray-50 border border-gray-200 rounded p-5">
          <h2 className="text-xl font-semibold mb-2">🚚 Standard Delivery</h2>
          <p>
            Delivered within <strong>1–3 business days</strong>. Available for all orders across serviceable pincodes.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-5">
          <h2 className="text-xl font-semibold mb-2">⚡ Same-Day Express</h2>
          <p>
            Order before <strong>2:00 PM</strong> and get your order delivered the same day by <strong>9:00 PM</strong>. Available in select cities only.
          </p>
        </div>
      </div>

      {/* Order Tracking */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Need to check your delivery?</h2>
        <button
          onClick={() => navigate("/track-order")}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition"
        >
          Track My Order
        </button>
      </div>

      {/* Delivery Coverage */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🌍 Service Locations</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>Major metro cities: Chennai, Bengaluru, Hyderabad, Mumbai, Delhi</li>
          <li>Tier-2 cities: Coimbatore, Pune, Kochi, Vizag, Jaipur</li>
          <li>We’re constantly expanding. Use the pin code checker at checkout to confirm delivery availability.</li>
        </ul>
      </div>

      {/* Delivery Schedule */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🕒 Delivery Schedule</h2>
        <table className="w-full border text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2 px-3 text-left">Day</th>
              <th className="py-2 px-3 text-left">Delivery Window</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-700">
            {[
              ["Monday - Friday", "9:00 AM – 8:00 PM"],
              ["Saturday", "10:00 AM – 6:00 PM"],
              ["Sunday", "Limited Slots (10:00 AM – 2:00 PM)"],
            ].map(([day, time], i) => (
              <tr key={i} className="border-t">
                <td className="py-2 px-3">{day}</td>
                <td className="py-2 px-3">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note */}
      <p className="text-sm text-gray-500 text-center">
        Delivery times may vary due to weather, location, or high-demand events. You’ll be notified of any delays in advance.
      </p>
    </div>
  );
};

export default DeliveryInfo;
