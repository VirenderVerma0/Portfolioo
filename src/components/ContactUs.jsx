"use client";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

gsap.registerPlugin(ScrollTrigger);
const ContactUs = () => {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const email = process.env.NEXT_PUBLIC_EMAIL;
  const phone = process.env.NEXT_PUBLIC_PHONE;
  const whatsUrl = process.env.NEXT_PUBLIC_WHATSAPP;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-blue-400 text-xl sm:text-2xl" />,
      title: "Email",
      value: email,
      link: `mailto:${email}`,
    },
    {
      icon: <FaPhoneAlt className="text-green-400 text-xl sm:text-2xl" />,
      title: "Phone",
      value: phone,
      link: `tel:${phone}`,
    },
    {
      icon: <FaMapMarkerAlt className="text-red-400 text-xl sm:text-2xl" />,
      title: "Location",
      value: "Haryana, India",
      link: "#",
    },
  ];

  useGSAP(() => {
    // Header animation
    gsap.fromTo(
      ".contact-header",
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-header",
          start: "top 85%",
          end: "bottom 70%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    // Contact info cards animation
    gsap.fromTo(
      ".contact-info-item",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power1.inOut",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".contact-info-container",
          start: "top 80%",
          end: "bottom 70%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    // Form animation
    gsap.fromTo(
      ".contact-form",
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".contact-form",
          start: "top 80%",
          end: "bottom 70%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    // Form inputs animation
    gsap.fromTo(
      ".form-input",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".contact-form",
          start: "top 75%",
          end: "bottom 65%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    // Footer animation
    gsap.fromTo(
      ".contact-footer",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".contact-footer",
          start: "top 85%",
          end: "bottom 70%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );
  }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();
   setIsSubmitting(true);
   setStatus("Sending...");
   const { name, email, subject, message } = formData;

    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const json = await resp.json().catch(() => null);
      if (resp.ok) {
        if (json.requiresVerification) {
          // Verification email sent
          setStatus("Verification email sent! Please check your Gmail and click the verification link.");
          setFormData({ name: "", email: "", subject: "", message: "" });
          addToast("Verification email sent! Check your Gmail.", "success");
        } else {
          // Direct success (shouldn't happen with new system, but fallback)
          setStatus("Message Sent! Thank you.");
          setFormData({ name: "", email: "", subject: "", message: "" });
          addToast("Message sent — I will get back to you soon!", "success");
        }
      } else {
        const err = (json && json.error) || resp.statusText || "Send failed";
        setStatus(`Error: ${err}`);
        addToast(`Failed to send message: ${err}`, "error");
      }
    } catch (error) {
      setStatus("Network error");
      addToast("Network error while sending message", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { addToast } = useToast();

  const handleManagePortfolio = () => {
    if (!user) {
      // Store intended destination in localStorage
      localStorage.setItem('redirectAfterLogin', '/admin');
      router.push('/Signin');
    } else if (!isAdmin()) {
      alert('Access denied. Admin privileges required.');
    } else {
      router.push('/admin');
    }
  };

  return (
    <section id="contact" className=" overflow-x-hidden bg-gradient-to-br  from-gray-900 to-black text-gray-300 py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="contact-header text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Get In <span className="text-blue-400">Touch</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Have a project in mind or just want to say hello? Feel free to reach out —
            I&apos;d love to connect and discuss how we can work together!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Contact Info */}
          <div className="contact-info-container contact-info-item space-y-6 lg:space-y-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 lg:mb-8">
                Let&apos;s <span className="text-blue-400">Connect</span>
              </h3>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    className="contact-info-item flex items-center gap-4 p-4 rounded-xl bg-gray-700/30 hover:bg-gray-700/50
                             transition-all duration-300 group cursor-pointer border border-transparent
                             hover:border-blue-500/30 transform hover:scale-105"
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-lg group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Additional Info */}
              <div className="contact-info-item mt-8 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <p className="text-sm text-blue-300 text-center">
                  💡 Typically reply within 2-4 hours
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="contact-form bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700/50"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 lg:mb-8">
              Send <span className="text-blue-400">Message</span>
            </h3>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-3 text-sm font-medium text-gray-400">
                  Your Name *
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                onChange={handleChange}
                  type="text"
                  placeholder="Enter your full name"
                  className="form-input w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-500 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-3 text-sm font-medium text-gray-400">
                  Your Email *
                </label>
                <input
                  id="email"
                  name="email"
                  value={formData.email}
                onChange={handleChange}
                  type="email"
                  placeholder="Enter your email address"
                  className="form-input w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-500 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block mb-3 text-sm font-medium text-gray-400">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  type="text"
                  placeholder="Subject (optional)"
                  className="form-input w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-500 transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-3 text-sm font-medium text-gray-400">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                onChange={handleChange}
                  rows={5}
                  placeholder="Tell me about your project or just say hello..."
                  className="form-input w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-500 resize-none transition-all duration-300"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="form-input w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                         rounded-xl text-white font-semibold text-lg transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25
                         flex items-center justify-center gap-3 transform hover:scale-105"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-lg" />
                    Send Message
                  </>
                )}
              </button>
            </div>

            {/* Form Note */}
            <p className="form-input text-xs text-gray-500 text-center mt-6">
              * Required fields. Your data is safe with me.
            </p>
          </form>
        </div>

        {/* Quick Contact Footer */}
        <div className="contact-footer text-center mt-12 lg:mt-16 pt-8 border-t border-gray-800/50">
          <p className="text-gray-400 text-sm sm:text-base">
            Prefer a quick chat?{" "}
            <Link
              href={whatsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 underline transition-colors"
            >
              Message me on WhatsApp
            </Link>
          </p>
        </div>
        {/* Manage Portfolio button removed per request */}
      </div>
    </section>
  );
};

export default ContactUs;
