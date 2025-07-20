const Contact = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-6 text-gray-700">
      <h1 className="text-3xl font-bold text-primary mb-2">Contact Us</h1>
      <p className="mb-8 text-gray-600">Our support team is here to help you 7 days a week.</p>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">📞 Customer Support</h2>
            <p className="text-gray-600">Need help with an order or have a question?</p>
            <p className="mt-1 font-mono text-primary">+91 91769 48381</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📧 Email Us</h2>
            <p className="text-gray-600">For queries, complaints, or feedback, drop us an email.</p>
            <p className="mt-1 font-mono text-primary">support@gromart.com</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📍 Office Location</h2>
            <p className="text-gray-600">#12, Market Street, Chennai, Tamil Nadu - 600001</p>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-medium mb-2">⏰ Working Hours</h2>
            <p className="text-gray-600">Monday - Friday: 9:00 AM – 9:00 PM</p>
          </div>
        </div>

        {/* Contact Form (UI Only) */}
        <form className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">💬 Send a Message</h2>
          <div>
            <label className="block mb-1 text-sm font-medium">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded outline-primary"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded outline-primary"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Message</label>
            <textarea
              rows="4"
              placeholder="Your message..."
              className="w-full px-4 py-2 border border-gray-300 rounded outline-primary"
            />
          </div>

          <button
            type="button"
            className="bg-primary hover:primary-dull text-white px-6 py-2 rounded shadow transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Optional Map or Image */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-3">🗺️ Find Us on the Map</h2>
        <div className="w-full h-60 bg-gray-200 rounded flex items-center justify-center text-gray-500">
          {/* Replace with <iframe> Google Map if needed */}
          <span>Map Placeholder</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;
