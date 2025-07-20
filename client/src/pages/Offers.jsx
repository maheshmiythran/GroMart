import { useEffect, useState } from "react";

const offers = [
  {
    title: "Flat ₹150 OFF on HDFC Credit Cards",
    description: "Use code HDFC150 on orders above ₹999. Valid once per user.",
    tag: "Bank Offer",
    color: "green",
    expiry: "2025-07-30T23:59:59",
  },
  {
    title: "Buy 1 Get 1 FREE on Snacks",
    description: "Applicable on select brands every Friday. Auto-applied at checkout.",
    tag: "Limited Time",
    color: "red",
    expiry: "2025-07-25T23:59:00",
  },
  {
    title: "10% Cashback on UPI Payments",
    description: "Pay using Google Pay or PhonePe and get instant cashback up to ₹100.",
    tag: "Cashback",
    color: "blue",
    expiry: "2025-07-31T12:00:00",
  },
  {
    title: "₹200 OFF on First Order",
    description: "Use code WELCOME200. Valid only for first-time customers.",
    tag: "New User",
    color: "purple",
  },
  {
    title: "Free Delivery on Orders Above ₹499",
    description: "Get free doorstep delivery without any hidden charges.",
    tag: "Free Delivery",
    color: "gray",
  },
  {
    title: "0% EMI on Kotak Credit Cards",
    description: "Shop now and pay later with no interest for 3 months.",
    tag: "EMI Offer",
    color: "yellow",
  },
];

const getTimeRemaining = (expiry) => {
  const total = Date.parse(expiry) - Date.now();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

const isToday = (expiry) => {
  const expiryDate = new Date(expiry);
  const now = new Date();
  return (
    expiryDate.getDate() === now.getDate() &&
    expiryDate.getMonth() === now.getMonth() &&
    expiryDate.getFullYear() === now.getFullYear()
  );
};

const Offers = () => {
  const [timers, setTimers] = useState({});

  useEffect(() => {
    const updateTimers = () => {
      const newTimers = {};
      offers.forEach((offer, idx) => {
        if (offer.expiry) {
          const t = getTimeRemaining(offer.expiry);
          newTimers[idx] = t;
        }
      });
      setTimers(newTimers);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-6 text-gray-700">
      <h1 className="text-3xl font-bold text-primary mb-4">Offers & Deals</h1>
      <p className="mb-8 text-gray-600">
        Browse our latest discounts — some for a limited time, others just because we love you!
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer, index) => {
          const timer = timers[index];
          const expired = offer.expiry && timer?.total <= 0;
          if (expired) return null; // Auto-hide expired offers

          const showEndsToday = offer.expiry && isToday(offer.expiry);

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`inline-block text-xs font-bold text-white bg-${offer.color}-500 px-2 py-1 rounded`}
                >
                  {offer.tag}
                </span>

                {showEndsToday && (
                  <span className="text-xs text-red-600 font-medium bg-red-100 px-2 py-1 rounded">
                    Ends Today
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {offer.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{offer.description}</p>

              {offer.expiry && timer && (
                <div className="text-xs font-mono text-gray-500 bg-gray-100 rounded px-3 py-1 inline-block">
                  ⏳ Ends in:{" "}
                  {timer.days > 0 && `${timer.days}d `}
                  {String(timer.hours).padStart(2, "0")}:
                  {String(timer.minutes).padStart(2, "0")}:
                  {String(timer.seconds).padStart(2, "0")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 bg-primary/5 border border-primary/20 rounded p-6 text-center">
        <h2 className="text-xl font-semibold text-primary mb-2">
          🎁 More Offers Coming Soon!
        </h2>
        <p className="text-gray-600">
          Stay tuned — we update this page weekly with new deals and surprises.
        </p>
      </div>
    </div>
  );
};

export default Offers;
