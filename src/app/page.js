"use client";
import React from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import Intro from "@/components/Intro";
import AboutUs from "@/components/AboutUs";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

const Page = () => {
  const myName = process.env.NEXT_PUBLIC_NAME;

  // Common animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gray-900 text-white scroll-smooth">
      <Navbar name={myName} />


      {/* Intro */}
      <motion.section
        id="intro"

        variants={sectionVariants}
        // initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <Intro />
      </motion.section>

      {/* About */}
      <motion.section
        id="about"

        variants={sectionVariants}
        // initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <AboutUs />
      </motion.section>

      {/* Skills */}
      <motion.section
        id="skills"

        variants={sectionVariants}
        // initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <Skills />
      </motion.section>

      {/* Projects */}
      <motion.section
        id="projects"

        variants={sectionVariants}

        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <Projects />
      </motion.section>

      {/* Experience */}
      <motion.section
        id="experience"

        variants={sectionVariants}

        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <Experience />
      </motion.section>

      {/* Contact */}
      <motion.section
        id="contact"

        variants={sectionVariants}

        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <ContactUs />
      </motion.section>

      <Footer />
    </div>
  );
};

export default Page;
