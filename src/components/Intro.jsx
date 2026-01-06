"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap/all";
import React, { useState, useEffect, useRef, Suspense} from "react";
import { ReactTyped } from "react-typed";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const ThreePCShowcase = dynamic(() => import("./ThreePCShowcase"), {
  ssr: false,
  loading: () => <div className="w-full h-screen flex items-center justify-center"><div className="text-white">Loading 3D Scene...</div></div>
});
// import { useGLTF } from "@react-three/drei";
// useGLTF.preload("./ThreePCShowcase");

const Intro = () => {
  const myName = process.env.NEXT_PUBLIC_NAME;
  const pdf = process.env.NEXT_PUBLIC_PDF;
  const modelRef = useRef(null);

  const [showToast, setShowToast] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [showFlipToast, setShowFlipToast] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showModel, setShowModel] = useState(true); // Temporarily set to true for testing
  const [isClient, setIsClient] = useState(false);

  useGSAP(() => {
    gsap.fromTo(".info", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, ease: "power3.inOut", stagger: 0.3, duration: 2, delay: 1 });
    gsap.fromTo(".info2", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, ease: "power3.inOut", stagger: 0.3, duration: 2, delay: 1 });
  }, []);

   useEffect(() => {
  let timeoutId;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        clearTimeout(timeoutId);
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setShowModel(true), 200);
        } else {
          timeoutId = setTimeout(() => setShowModel(false), 400);
        }
      });
    },
    { threshold: 0.2 }
  );

  if (modelRef.current) observer.observe(modelRef.current);
  return () => {
    if (modelRef.current) observer.unobserve(modelRef.current);
    clearTimeout(timeoutId);
  };
}, []);



  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Welcome toast on mount
  useEffect(() => {
    setShowWelcomeToast(true);
    const timer = setTimeout(() => { setShowWelcomeToast(false), 2000 }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);

    const link = document.createElement("a");
    link.href = `/${pdf}`;
    link.download = pdf;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      setIsDownloading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }, 800);
  };

  const handleCardHover = () => {
    setShowFlipToast(true);
    setTimeout(() => setShowFlipToast(false), 2000);
  };

  const handleGoToContact = () => {
    try {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.href = '/#contact';
    } catch (e) {
      window.location.href = '/#contact';
    }
  };

  return (
    <>
      <div className="relative w-full h-full lg:h-screen py-3 overflow-hidden">
        {/* Background video */}
        <video
          className="absolute top-0 left-0 opacity-90 w-full h-full object-cover"
          src="/bgVid.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Main Content */}
        <div className="relative z-10 h-full w-full mx-auto lg:w-[100%] flex flex-col px-2 md:px-10 lg:px-20  lg:flex-row items-center justify-between ">
          {/* Left Content Section */}
          <div className="info  flex flex-col justify-center items-center lg:items-start  mx-auto w-full mt-8 lg:mt-0">
            <div className="w-full  p-2 lg:mt-14">
              <h1 className="text-white font-sans text-center lg:text-left">
                <span className="text-xl sm:text-2xl lg:text-2xl font-sans block lg:inline">Hello, I'm </span>
                <span className="text-3xl sm:text-4xl lg:text-4xl font-bold text-blue-400 block lg:inline mt-2 lg:mt-0 lg:ml-2">
                  {myName}
                </span>
                <span className="text-xl sm:text-2xl lg:text-3xl font-sans text-white block lg:inline lg:ml-3 mt-2 lg:mt-0">
                  <ReactTyped
                    strings={["Software Developer", "Full-Stack Developer", "Problem Solver"]}
                    typeSpeed={50}
                    backSpeed={40}
                    loop
                    cursorChar="|"
                  />
                </span>
              </h1>
            </div>

            <div className="w-full max-w-2xl font-sans text-lg sm:text-xl lg:text-2xl mt-4 lg:mt-6 text-center lg:text-left">
              <p className="text-white leading-relaxed">
                Full-Stack Software Developer specializing in React, Node.js, Next.js, Nest.js and AWS to build scalable, high-performance web applications.
              </p>
            </div>

            {/* Download Resume Button */}
            <div className="mt-6 lg:mt-8 w-full flex justify-center lg:justify-start">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`px-6 py-3 text-base sm:text-lg font-semibold rounded-md transition-all duration-300 shadow-md cursor-pointer ${isDownloading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-400 hover:bg-blue-700 hover:scale-95 text-white"
                  }`}
              >
                {isDownloading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Downloading...
                  </div>
                ) : (
                  "Download CV"
                )}
              </button>
            </div>
          </div>

          {/* Right Card Section */}
          <div className="info2 lg:mb-0 md:mb-40 mb-40   p-1 rounded-2xl overflow-hidden  flex justify-center items-center mt-8 lg:mt-0 ">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <div className="w-full h-full perspective ">
                <div className="relative w-full h-full flex justify-center ">
                  <div className="absolute inset-0 flex items-center justify-center border-b-amber-300 animate-spin">
                    <div className="w-60 md:w-70 lg:w-72 h-[30rem] md:h-[36rem] lg:h-[36rem]  rounded-2xl bg-gradient-to-r from-blue-500 via-purple-400 to-pink-500"></div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-58 md:w-83 lg:w-100 h-79 md:h-[27rem] lg:h-[25rem] rounded-2xl bg-black"></div>
                  </div>

                  <div
                    className="relative w-58 md:w-83 lg:w-100 h-79 md:h-[27rem] lg:h-[25rem] cursor-pointer transition-transform duration-500 transform-style preserve-3d hover:rotate-y-180 z-10 group"
                    onMouseEnter={handleCardHover}
                  >
                    {/* Front Side */}
                    <div className="absolute w-full h-full  backface-hidden">
                      <img
                        src="/myImg.jpg"
                        alt="Itz Me"
                        className="object-cover w-full h-full rounded-2xl shadow-md"
                      />
                    </div>

                    {/* Back Side */}
                    <div className="absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] bg-slate-800/60 backdrop-blur-sm flex flex-col justify-center items-center p-4 sm:p-6 rounded-2xl shadow-xl border-4 border-green-400/50">
                      <img
                        src="/myavtar.png"
                        alt="Avatar"
                        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain rounded-full mb-3 sm:mb-4 ring-4 ring-green-400"
                      />
                      <h2 className="text-white text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-center">
                        Software Developer
                      </h2>
                      <p className="text-green-400 text-sm sm:text-md lg:text-lg mt-2 text-center">
                        I am a passionate technophile.
                      </p>
                      <div className="mt-4 sm:mt-6 lg:mt-8 text-xs sm:text-sm lg:text-base text-white text-center">
                        <button
                          onClick={handleGoToContact}
                          className="px-4 py-2 bg-linear-to-r from-green-400 to-green-600 text-black font-semibold rounded-full shadow-md hover:brightness-95 transition-all opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 duration-200"
                        >
                          Connect with me
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed top-1/4 left-0 bg-green-700 text-white px-8 py-4 text-xl rounded-lg shadow-lg z-50 
    transform transition-transform duration-500 ease-out
    ${showToast ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
        >
          Resume downloaded successfully!
        </div>

        {/* {showWelcomeToast && (
            <div className="fixed top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-md animate-fade-in-out">
              Welcome to the portfolio!
            </div>
          )} */}
        <div
          className={`fixed top-1/5  lg:left-[35%] justify-center mx-auto px-3  self-center w-full lg:w-100 text-center  text-xl rounded-lg  z-50 
    transform transition-transform duration-2000 ease-out
    ${showWelcomeToast ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
        >

          <div className="
 max-w-sm md:max-w-md lg:max-w-lg 
  min-h-16 md:min-h-20 
  mx-auto text-center 
  bg-gradient-to-br from-[#1f1c2c] to-[#928DAB]
  text-white px-4 sm:px-5 md:px-6 py-4 md:py-4 
  rounded-xl md:rounded-2xl 
  shadow-2xl backdrop-blur-lg
  border border-white/40
  animate-slide-in-left
  flex items-center gap-3 sm:gap-4 
  transition-all duration-300
  hover:shadow-3xl hover:scale-[1.02]
  transform-gpu
">
            {/* Icon Container */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center">
                {/* Avatar Image */}
                <img
                  src="/myavtar.png"
                  alt="My Avatar"
                  className="
          h-12 w-12 
          sm:h-14 sm:w-14 
          md:h-16 md:w-16
          rounded-full 
          object-cover 
          border-2 border-white/50
          shadow-lg
          hover:border-white/80 
          transition-all duration-300
        "
                />
              </div>
            </div>

            {/* Toast Message */}
            <div className="flex-1 text-left min-w-0">
              <p className="
      text-white 
      text-lg sm:text-xl md:text-2xl 
      font-semibold
      leading-tight
      tracking-tight
      drop-shadow-sm
      break-words
    ">
                Welcome to the portfolio
                <span className="inline-block animate-bounce ml-1">✨</span>
              </p>
              {/* Optional subtitle */}
              <p className="
      text-white/80 
      text-xs sm:text-sm 
      mt-1
      font-medium
      hidden sm:block
    ">
                Explore my work and skills
              </p>
            </div>

            {/* Optional Close Button */}
            <button className="
    flex-shrink-0 
    text-white/60 
    hover:text-white 
    transition-colors duration-200
    p-1
    rounded-full
    hover:bg-white/10
    focus:outline-none focus:ring-2 focus:ring-white/50
  ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>


        </div>
      </div>



      {/* <motion.div
        className="absolute lg:top-40 md:top-70 top-110 lg:left-85 md:left-60 left-5 pt-20 z-9999"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        onViewportEnter={() => console.log('entered view')}
        onViewportLeave={() => console.log('left view')}
        viewport={{
          once: false,
          amount: 0.5 // 50% of element needs to be visible
        }}
        transition={{ duration: 0.3 }}
      >
        <ThreePCShowcase />
      </motion.div> */}
     {isClient && (
        <motion.div
          ref={modelRef}
          className="absolute z-10 h-80 w-full left-1/2 -translate-x-1/2 -mt-65 sm:h-80 sm:w-100 sm:left-1/2 sm:-translate-x-1/2 sm:-mt-65 md:h-90 md:w-80 md:left-auto md:translate-x-0 md:ml-55 md:-mt-73 lg:h-106 lg:w-100 lg:left-auto lg:ml-100 lg:-mt-90"
          initial={{ opacity: 0 }}
          animate={{ opacity: showModel ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ThreePCShowcase />
        </motion.div>
      )}

    </>
  );
};

export default Intro;