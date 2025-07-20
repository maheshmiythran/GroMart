// components/CancelOrders.jsx
const CancelOrders = ({ isOpen, onClose, onCancelConfirmed }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>
        <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h3 className="mb-5 text-lg font-medium text-gray-700">
          Are you sure you want to cancel this order?
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancelConfirmed} // ✅ Make sure this is correctly hooked
            className="text-white bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-sm"
          >
            Yes, Cancel
          </button>
          <button
            onClick={onClose}
            className="text-gray-700 bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-lg text-sm"
          >
            No, Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrders;
