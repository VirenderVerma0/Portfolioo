"use client";
import React from 'react';
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
  const myName = process.env.NEXT_PUBLIC_NAME;
  const gitUrl = process.env.NEXT_PUBLIC_GIT;
  const linkUrl = process.env.NEXT_PUBLIC_LINKEDIN;
  const whatsUrl = process.env.NEXT_PUBLIC_WHATSAPP;
  const mailUrl = process.env.NEXT_PUBLIC_GMAIL;
  const naukriUrl = process.env.NEXT_PUBLIC_NAUKRI;

  useGSAP(() => {
    // Animation for icons
    gsap.fromTo(
      ".social-icon",
      { 
        opacity: 0, 
        y: -40, 
        scale: 0.5 
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power1.inOut",
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".icons-container",
          start: "top 90%",
          end: "bottom 70%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    // Animation for about text
    gsap.fromTo(
      ".about-text-content",
      { 
        opacity: 0, 
        y: 30 
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-content",
          start: "top 85%",
          end: "bottom 70%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    // Animation for header
    gsap.fromTo(
      ".about-header",
      { 
        opacity: 0, 
        y: -20 
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-header",
          start: "top 90%",
          end: "bottom 80%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );

    // Animation for additional info cards
    gsap.fromTo(
      ".info-card",
      { 
        opacity: 0, 
        x: -30 
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".info-cards-container",
          start: "top 85%",
          end: "bottom 70%",
          toggleActions: "play none none reverse",
          markers: false
        }
      }
    );
  }, []);

  return (
    <section id="about" className="w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="about-header text-center mb-12 lg:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            About <span className="text-blue-400">Me</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="about-content max-w-4xl mx-auto">
          {/* Text Content */}
          <div className="about-text-content mb-12 lg:mb-16 shadow-2xl transition-shadow duration-300 hover:shadow-blue-500/30 backdrop-blur-sm rounded-2xl  border border-gray-700/50">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-700/50 shadow-2xl">
              <p className="text-lg sm:text-xl lg:text-xl leading-relaxed text-gray-200 text-center lg:text-left">
                Hi, I'm <span className="text-blue-400 font-semibold">{myName}</span>, a passionate and skilled Full-Stack Developer with a knack for crafting visually appealing, interactive, and responsive web applications.
              </p>
              
              <p className="text-lg sm:text-xl lg:text-xl leading-relaxed text-gray-200 mt-6 text-center lg:text-left">
                Motivated and self-taught Full-Stack Developer with a strong foundation in HTML, CSS, JavaScript,React Js,Redux-toolkit, Node Js, Express Js, Zoho-catalyst and databases like SQL/MySQL, Catalyst and Mongodb along with hands-on experience building responsive websites and web applications through personal and academic projects. Eager to contribute to real-world development teams, I specialize in turning ideas into digital experiences, ensuring both functionality and user satisfaction.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="icons-container">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-300 mb-6">
                Connect With Me
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mb-8"></div>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-10">
              {/* GitHub */}
              <a
                href={gitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 transform cursor-pointer hover:text-[#181717] hover:drop-shadow-[0_0_8px_rgb(59,130,246),0_0_15px_rgb(59,130,246),0_0_25px_rgb(59,130,246)]"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 group-hover:border-blue-400/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <FaGithub size={30} className="social-icon" />
                </div>
                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-gray-300 bg-gray-900/90 px-2 py-1 rounded-md whitespace-nowrap">
                    GitHub
                  </span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 transform cursor-pointer hover:text-[#25D366] hover:drop-shadow-[0_0_8px_rgba(37,211,102,0.8),0_0_15px_rgba(37,211,102,0.8),0_0_25px_rgba(37,211,102,0.8)]"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 group-hover:border-blue-400/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <BsWhatsapp size={30} className="social-icon" />
                </div>
                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-gray-300 bg-gray-900/90 px-2 py-1 rounded-md whitespace-nowrap">
                    WhatsApp
                  </span>
                </div>
              </a>

              {/* LinkedIn */}
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 transform cursor-pointer text-[#0A66C2]  hover:text-white hover:drop-shadow-[0_0_8px_#0A66C2,0_0_15px_#0A66C2,0_0_25px_#0A66C2]"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 group-hover:border-blue-400/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <FaLinkedinIn size={26} className="social-icon" />
                </div>
                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-gray-300 bg-gray-900/90 px-2 py-1 rounded-md whitespace-nowrap">
                    LinkedIn
                  </span>
                </div>
              </a>

              {/* Gmail */}
              <a
                href={mailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 transform cursor-pointer hover:text-[#0A66C2] hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8),0_0_15px_rgba(59,130,246,0.8),0_0_25px_rgba(59,130,246,0.8)]"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 group-hover:border-blue-400/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <img src="/gmail.png" alt="Gmail" className="social-icon w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-gray-300 bg-gray-900/90 px-2 py-1 rounded-md whitespace-nowrap">
                    Gmail
                  </span>
                </div>
              </a>

              {/* Naukri */}
              <a
                href={naukriUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center transition-all duration-300 hover:scale-110 transform cursor-pointer  hover:text-[#25D366] hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8),0_0_15px_rgba(59,130,246,0.8),0_0_25px_rgba(59,130,246,0.8)]"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 group-hover:border-blue-400/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <img src="/na.png" alt="Naukri" className="social-icon w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-gray-300 bg-gray-900/90 px-2 py-1 rounded-md whitespace-nowrap">
                    Naukri
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="info-cards-container about-text-content mt-16 lg:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="info-card bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl transition-shadow duration-300 hover:shadow-blue-500/30">
              <h3 className="text-xl font-semibold text-blue-400 mb-4 text-center">
                🎯 My Focus
              </h3>
              <p className="text-gray-300 text-center">
                Creating seamless user experiences with modern technologies and best practices.
              </p>
            </div>
            
            <div className="info-card bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl transition-shadow duration-300 hover:shadow-blue-500/30">
              <h3 className="text-xl font-semibold text-purple-400 mb-4 text-center">
                💡 My Approach
              </h3>
              <p className="text-gray-300 text-center">
                Problem-solving through clean, efficient code and user-centered design principles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;