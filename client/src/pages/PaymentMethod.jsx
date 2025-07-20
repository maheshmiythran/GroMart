const Payment = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-6 text-gray-700">
      <h1 className="text-3xl font-bold mb-4 text-primary">Accepted Payment Methods</h1>

      <p className="mb-6 text-gray-600">
        At <span className="font-semibold text-primary">GroMart</span>, we offer a variety of secure and convenient payment options to make your checkout experience smooth and hassle-free.
      </p>

      {/* Payment Methods */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 border border-gray-200 rounded p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">💳 Credit / Debit Cards</h2>
          <p>We accept Visa, MasterCard, RuPay, and American Express. All transactions are 100% secure and encrypted.</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">📱 UPI & Wallets</h2>
          <p>Pay using Google Pay, PhonePe, Paytm, or any UPI-enabled app. Quick and convenient!</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">💰 Cash On Delivery (COD)</h2>
          <p>Prefer to pay when you receive your order? Choose COD at checkout. No extra charge!</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">🌐 Net Banking</h2>
          <p>We support all major Indian banks including SBI, HDFC, ICICI, Axis, and more.</p>
        </div>
      </div>

      {/* Offers Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-primary mb-4">🎉 Exclusive Card Offers</h2>

        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold">HDFC Bank Credit Cards</h3>
            <p>Get flat ₹150 off on orders above ₹999. Use code <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">HDFC150</span>.</p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold">ICICI Amazon Pay Credit Card</h3>
            <p>Get 5% cashback as Amazon Pay balance on all orders.</p>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold">SBI SimplySAVE Card</h3>
            <p>Earn 10 reward points per ₹100 spent on groceries.</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold">Kotak Mahindra Cards</h3>
            <p>Enjoy 0% EMI on orders above ₹3,000 for 3 months.</p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-500 text-center">
        * Offers are subject to terms and availability. Please check during checkout for latest updates.
      </p>
    </div>
  );
};

export default Payment;
