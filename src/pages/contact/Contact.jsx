import React, { useState } from 'react';
import { MapPin, Mail, Phone, Calendar, Send, Check } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';

const ContactPage = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    phoneNumber: "",
    messageContent: ""
  });

  const [state, handleSubmit] = useForm("moveozww");

  const updateFormField = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const venueDetails = {
    venue: "Conference Center",
    streetAddress: "701 S Nedderman Dr",
    city: "Arlington",
    state: "TX",
    postalCode: "76019",
    country: "United States",
    embedMapUrl: "httpss://maps.google.com/maps?q=University+of+Texas+at+Arlington&t=&z=13&ie=UTF8&iwloc=&output=embed",
  };

  const ContactDetail = ({ icon, label, details }) => (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-100">{label}</h3>
        <p className="text-gray-300">{details}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions about the conference? Reach out to our team and we'll be happy to assist you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 bg-teal-50 border-b border-teal-100">
              <h2 className="text-2xl font-bold text-gray-800">Send Us a Message</h2>
              <p className="text-gray-600 mt-2">We'll get back to you as soon as possible</p>
            </div>

            <div className="p-8">
              {state.succeeded ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <Check size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Message Sent!</h3>
                  <p className="text-gray-600 mb-8 max-w-md">
                    Thank you for contacting us. We have received your message and will respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={updateFormField}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                          Email Address *
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={contactForm.email}
                          onChange={updateFormField}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="you@example.com"
                        />
                        <ValidationError prefix="Email" field="email" errors={state.errors} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">
                          Phone Number
                        </label>
                        <input
                          id="phoneNumber"
                          type="tel"
                          name="phoneNumber"
                          value={contactForm.phoneNumber}
                          onChange={updateFormField}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="subject">
                        Subject *
                      </label>
                      <input
                        id="subject"
                        type="text"
                        name="subject"
                        value={contactForm.subject}
                        onChange={updateFormField}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="What is this regarding?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="messageContent"
                        value={contactForm.messageContent}
                        onChange={updateFormField}
                        rows="6"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Please provide details about your inquiry..."
                      ></textarea>
                      <ValidationError prefix="Message" field="message" errors={state.errors} />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={state.submitting}
                    className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-70"
                  >
                    {state.submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send size={18} className="mr-2" />
                        Submit Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="lg:w-96 bg-gradient-to-br from-teal-700 to-teal-900 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Conference Details</h2>

              <div className="space-y-4 mb-10">
                <ContactDetail
                  icon={<MapPin size={24} />}
                  label="Our Location"
                  details={`${venueDetails.venue}, ${venueDetails.streetAddress}, ${venueDetails.city}, ${venueDetails.state}`}
                />
                <ContactDetail
                  icon={<Mail size={24} />}
                  label="Email Us"
                  details="info@conferencesite.org"
                />
                <ContactDetail
                  icon={<Phone size={24} />}
                  label="Call Us"
                  details="+1 (800) 555-0123"
                />
                <ContactDetail
                  icon={<Calendar size={24} />}
                  label="Office Hours"
                  details="Monday to Friday, 8:30 AM - 6:00 PM"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-teal-50">
            <h2 className="text-2xl font-bold text-gray-800">How to Find Us</h2>
            <p className="text-gray-600 mt-1">
              {venueDetails.venue} - {venueDetails.streetAddress}, {venueDetails.city}, {venueDetails.state} {venueDetails.postalCode}
            </p>
          </div>
          <div className="h-96">
            <iframe
              src={venueDetails.embedMapUrl}
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Conference Venue Map"
            ></iframe>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} StyleWithAi Conference. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
