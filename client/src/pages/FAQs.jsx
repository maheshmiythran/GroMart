import { useState } from "react";
import { useEffect } from "react";
const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery takes 1–3 business days. In metro cities, you may receive your order within 24 hours.",
  },
  {
    question: "What if an item is missing or damaged?",
    answer:
      "Please report any missing or damaged items within 24 hours of delivery via the Contact Us page or support email. We’ll resolve it swiftly.",
  },
  {
    question: "Do you offer same-day delivery?",
    answer:
      "Yes, same-day delivery is available in select locations. You'll see the option during checkout if eligible.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "You can cancel or edit your order before it is packed for dispatch. After that, changes may not be possible.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Credit/Debit cards, UPI, Net Banking, and Cash on Delivery (COD). For details, visit our Payment Methods page.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-6 text-gray-700">
      <h1 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h1>
      <p className="mb-8 text-gray-600">Find quick answers to your most common doubts.</p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded shadow-sm bg-white"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left px-4 py-3 font-medium flex justify-between items-center hover:bg-gray-50 transition"
            >
              {faq.question}
              <span className="text-xl">{openIndex === index ? "−" : "+"}</span>
            </button>

            <div
              className={`px-4 overflow-hidden transition-all duration-150 ease-in-out ${
                openIndex === index ? "max-h-40 py-3" : "max-h-0 py-0"
              }`}
            >
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-center text-gray-500 mt-10">
        Still need help? Contact us at{" "}
        <span className="font-mono text-primary">support@gromart.com</span>
      </p>
    </div>
  );
};

export default FAQ;
