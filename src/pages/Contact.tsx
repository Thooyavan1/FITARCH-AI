import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const contactDetails = [
  {
    icon: <Mail className="text-blue-600" />,
    title: "Email",
    lines: ["support@fitarchai.com", "info@fitarchai.com"],
    bg: "bg-blue-100",
  },
  {
    icon: <Phone className="text-green-600" />,
    title: "Phone",
    lines: ["+1 (555) 123-4567", "Mon-Fri: 9AM-6PM EST"],
    bg: "bg-green-100",
  },
  {
    icon: <MapPin className="text-purple-600" />,
    title: "Address",
    lines: ["123 Fitness Street", "Tech City, TC 12345", "United States"],
    bg: "bg-purple-100",
  },
];

const faqs = [
  {
    q: "How does FitArch AI work?",
    a: "Our AI analyzes workout videos to provide personalized coaching and feedback using computer vision and machine learning.",
  },
  {
    q: "What types of workouts are supported?",
    a: "We support strength, cardio, yoga, and more. FitArch AI’s capabilities grow continuously.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We use industry-grade encryption and never share your data.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Anytime. You're free to cancel through your dashboard.",
  },
];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600">
            Have questions about FitArch AI? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Send us a Message
            </h2>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <span className="text-green-800">
                  Thank you! Your message has been sent successfully.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-medium mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    autoComplete="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-medium mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block font-medium mb-1">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 disabled:bg-blue-400"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info + FAQ */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactDetails.map((info, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`${info.bg} p-3 rounded-lg`}>{info.icon}</div>
                    <div>
                      <h3 className="font-semibold">{info.title}</h3>
                      {info.lines.map((line, j) => (
                        <p key={j} className="text-gray-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4 text-sm text-gray-700">
                {faqs.map((faq, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                    <p>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
