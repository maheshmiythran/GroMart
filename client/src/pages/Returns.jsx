import { useEffect } from "react";

const Returns = () => {

  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-6 text-gray-700">
      <h1 className="text-3xl font-bold text-primary mb-4">Return & Refund Policy</h1>

      <p className="mb-6 text-gray-600">
        At <span className="font-semibold text-primary">GroMart</span>, your satisfaction is our priority. If you're not happy with a product, we’re here to help.
      </p>

      {/* Section 1: Eligibility */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📦 Return Eligibility</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>You must request a return within <strong>48 hours</strong> of delivery.</li>
          <li>Product must be unused, in original packaging, and with receipt or proof of purchase.</li>
          <li>Perishable items (fruits, vegetables, dairy) are <span className="text-red-500 font-medium">non-returnable</span> unless damaged.</li>
        </ul>
      </div>

      {/* Section 2: Refund Process */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">💰 Refund Process</h2>
        <ol className="list-decimal ml-6 text-gray-700 space-y-1">
          <li>Submit your return request via <span className="font-medium">Contact Us</span> or Track Order section.</li>
          <li>Our team will review your request within 24 hours.</li>
          <li>Once approved, the product will be picked up or you'll be guided to ship it back.</li>
          <li>Refunds will be processed to your original payment method within <strong>5–7 business days</strong>.</li>
        </ol>
      </div>

      {/* Section 3: Non-Refundable Cases */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🚫 Non-Refundable Situations</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-1">
          <li>Products damaged due to misuse or negligence.</li>
          <li>Items returned without proper packaging or proof of purchase.</li>
          <li>Late requests beyond the 48-hour return window.</li>
        </ul>
      </div>

      {/* Section 4: Need Help */}
      <div>
        <h2 className="text-xl font-semibold mb-2">📞 Need Help?</h2>
        <p className="text-gray-700">
          Reach out via our <span className="text-primary underline cursor-pointer">Contact Us</span> page or email <span className="font-mono">support@gromart.com</span>. We're here for you 5 days a week!
        </p>
      </div>

      <p className="text-center text-sm text-gray-500 mt-10">
        * This policy is subject to change without notice. Always check before purchase.
      </p>
    </div>
  );
};

export default Returns;
