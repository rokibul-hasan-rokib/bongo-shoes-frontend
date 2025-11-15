import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  console.log(formData);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="font-sans bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/10 to-transparent"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We're here to help with any questions about our collections or services.
            </p>

            <div className="space-y-8 mt-12">
              <div className="group flex items-start space-x-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-green-400 to-green-500 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                  <p className="text-gray-700 font-medium">
                    +8801813848018<br />
                    <span className="text-sm text-gray-500 font-normal">24/7 Support</span>
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-700 font-medium">
                    contact.bongoshoes@gmail.com<br />
                    <span className="text-sm text-gray-500 font-normal">Response within 24 hours</span>
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Store Hours</h3>
                  <p className="text-gray-700 font-medium">
                    10:00 AM - 08:00 PM<br />
                    <span className="text-sm text-gray-500 font-normal">Every Day</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-12">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-80 rounded-2xl shadow-xl border border-gray-200 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <p className="text-gray-600 font-medium">Interactive Map Coming Soon</p>
                  <p className="text-sm text-gray-500">Stay tuned for location details</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:sticky lg:top-20">
            <div className="bg-white/80 backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-2xl border border-white/20">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="What's this about?"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm shadow-md hover:shadow-lg resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Send size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-white/50 py-24 border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-3">
                Do you offer wholesale or bulk orders?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes, we do. For wholesale or corporate bulk orders, please contact us directly through our business inquiry form or message our page for a custom quotation.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-3">
                Can I return or exchange my shoes?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes, we offer easy return and exchange within 3 days of delivery if the product is unused, undamaged, and in its original packaging.<br />
                <span className="text-sm text-gray-500">(Terms and conditions apply.)</span>
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-3">
                How long does delivery take?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Inside Dhaka: 1–2 working days<br />
                Outside Dhaka: 2–3 working days<br />
                <span className="text-sm text-gray-500">(Delivery times may vary slightly based on courier service and location.)</span>
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-3">
                What types of shoes do you offer?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We design and manufacture a wide range of shoes, including formal leather shoes, casual wear, sandals, loafers, sneakers, and comfort collections—all made with premium materials and expert craftsmanship.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
