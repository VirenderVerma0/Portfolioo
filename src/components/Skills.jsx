"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { loadIcon } from "@iconify/react/dist/iconify.js";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as MdIcons from "react-icons/md";
import * as DiIcons from "react-icons/di";
import * as IoIcons from "react-icons/io5";

const iconLibraries = {
  ...FaIcons,
  ...SiIcons,
  ...MdIcons,
  ...DiIcons,
  ...IoIcons,
};

const DefaultIcon = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontSize: size * 0.5,
      color: "#fff",
      boxShadow: "0 0 20px rgba(102, 126, 234, 0.5)",
    }}
  >
    ?
  </div>
);

const getTechIconComponent = (skillName) => {
  const normalized = skillName.toLowerCase().replace(/\s+/g, "");

  const possibleReactIconKeys = Object.keys(iconLibraries).filter((key) =>
    key.toLowerCase().includes(normalized)
  );

  const possibleIconifyNames = [
    `logos:${normalized}`,
    `devicon:${normalized}`,
    `simple-icons:${normalized}`,
    `fa6-brands:${normalized}`,
    `mdi:${normalized}`,
  ];

  return function DynamicIcon({ size = 50, className = "" }) {
    const [iconName, setIconName] = useState(null);
    const [ReactIcon, setReactIcon] = useState(null);

    useEffect(() => {
      if (possibleReactIconKeys.length > 0) {
        const IconComp = iconLibraries[possibleReactIconKeys[0]];
        setReactIcon(() => IconComp);
        return;
      }

      let isMounted = true;
      const tryIcons = async () => {
        for (const icon of possibleIconifyNames) {
          try {
            const iconData = await loadIcon(icon);
            if (iconData && isMounted) {
              setIconName(icon);
              break;
            }
          } catch {
            continue;
          }
        }
      };
      tryIcons();

      return () => {
        isMounted = false;
      };
    }, [skillName]);

    if (ReactIcon) return <ReactIcon size={size} className={className} color="#fff" />;
    if (iconName)
      return <Icon icon={iconName} width={size} height={size} className={className} color="#fff" />;
    return <DefaultIcon size={size} />;
  };
};

// Optimized Framer Motion variants for smooth performance
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40, // Reduced from 80px for smoother motion
    scale: 0.9, // Reduced from 0.8 for less dramatic scaling
  },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5, // Reduced duration for faster animation
      ease: "easeOut", // Simpler easing function
      delay: i * 0.08, // Reduced stagger delay
    }
  }),
  hover: {
    y: -8, // Reduced lift effect
    scale: 1.05, // Reduced scale for better performance
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98, // More subtle tap effect
    transition: {
      duration: 0.2
    }
  }
};

const iconFloat = {
  hover: {
    y: -4, // Reduced movement
    scale: 1.1, // Reduced scale
    transition: {
      duration: 0.25,
      ease: "easeOut"
    }
  }
};

// Simplified particle burst for better performance
const particleBurst = {
  hidden: { scale: 0, opacity: 0 },
  hover: (i) => ({
    scale: [0, 1, 0],
    opacity: [0, 0.6, 0],
    x: Math.cos((i * 45 * Math.PI) / 180) * 20, // Reduced distance
    y: Math.sin((i * 45 * Math.PI) / 180) * 20,
    transition: {
      duration: 0.4, // Faster particles
      delay: i * 0.02, // Reduced delay between particles
    }
  })
};

// Common Skill Card Component with performance optimizations
const SkillCard = React.forwardRef(({ skill, index }, ref) => {
  const IconComp = getTechIconComponent(skill);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      whileTap="tap"
      viewport={{
        once: false,
        amount: 0.15, // Reduced trigger threshold
        margin: "0px 0px -30px 0px" // Reduced margin for earlier trigger
      }}
      custom={index}
      className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl bg-cyan-600 border-2 border-[#0f172a] p-8 shadow-xl hover:shadow-cyan-500/50   backdrop-blur-xl cursor-pointer overflow-hidden group hover:border-cyan-400/40"
      // Removed transformStyle: preserve-3d for better performance
    >
      {/* Card Background - simplified */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]  to-[#1e293b] rounded-2xl" />
      
      {/* Icon Container */}
      <motion.div
        className="relative p-3 mb-3 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 group-hover:border-cyan-400/40 flex items-center justify-center"
        whileHover="hover"
        variants={iconFloat}
      >
        <IconComp size={32} />
      </motion.div>
      
      {/* Skill Name */}
      <motion.p
        className="relative text-sm font-bold text-cyan-300 text-center z-10"
        whileHover={{
          textShadow: "0 0 10px rgba(6, 182, 212, 0.6)",
          transition: { duration: 0.2 }
        }}
      >
        {skill}
      </motion.p>

      {/* Simplified Hover Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Optimized Particle Burst - fewer particles */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
        {[...Array(6)].map((_, i) => ( // Reduced from 8 to 6 particles
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full"
            custom={i}
            variants={particleBurst}
            initial="hidden"
            whileHover="hover"
          />
        ))}
      </div>
    </motion.div>
  );
} );

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/skills');
        if (!response.ok) {
          throw new Error('Failed to fetch skills');
        }
        const data = await response.json();
        // Assuming the API returns { success: true, data: [...] }
        setSkills(data.success ? data.data.map(skill => skill.name) : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const addSkill = () => {
    const clean = input.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <section 
      id="skills"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#050510] via-[#0b1220] to-[#0f172a] text-white px-4 py-10"
    >
      {/* Optimized Background Elements - reduced movement */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl"
          animate={{
            y: [0, -15, 0], // Reduced movement
            x: [0, 10, 0],
          }}
          transition={{
            duration: 15, // Slower for smoother motion
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            y: [0, 12, 0], // Reduced movement
            x: [0, -8, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Title Section */}
      <motion.div 
        className="text-center mb-12 w-full max-w-6xl"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }} // Faster animation
        viewport={{ once: false }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-black  pb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
        >
          My Tech Stack{" "}
          <motion.span
            animate={{ 
              rotate: [0, 5, -5, 0], // Reduced rotation
              scale: [1, 1.1, 1] // Reduced scale
            }}
            transition={{ 
              duration: 6, // Slower for smoother motion
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block text-white"
          >
            🚀
          </motion.span>
        </motion.h1>
        
        <motion.p
          className="text-lg text-cyan-200/80 font-light max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }} // Faster animation
          viewport={{ once: false }}
        >
          Technologies I work with to bring ideas to life
        </motion.p>
      </motion.div>

      {/* Input Section */}
      {/* <motion.div
        className="flex flex-col sm:flex-row items-center gap-3 bg-gradient-to-r from-[#1e293b]/80 to-[#334155]/60 p-4 rounded-2xl shadow-2xl w-full max-w-xl mb-16 border border-cyan-500/40 backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }} 
        viewport={{ once: false }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          placeholder="Type skill name..."
          className="flex-1 bg-transparent outline-none text-white placeholder-cyan-200/60 text-lg font-medium w-full mb-3 sm:mb-0 px-2 py-2"
        />
        <motion.button
          onClick={addSkill}
          whileHover={{ 
            scale: 1.03, // Reduced scale
            boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" // Reduced shadow
          }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-semibold shadow-lg relative overflow-hidden min-w-[120px]"
        >
          <span className="relative z-10">Add Skill ✨</span>
        </motion.button>
      </motion.div> */}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-cyan-300/60 mt-12 p-8"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-4xl mb-4"
          >
            🔄
          </motion.div>
          <p className="text-lg font-medium mb-2">Loading skills...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-red-300/80 mt-12 p-8 bg-red-500/10 rounded-2xl border border-red-500/20 backdrop-blur-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl mb-4"
          >
            ⚠️
          </motion.div>
          <p className="text-lg font-medium mb-2">Failed to load skills</p>
          <p className="text-red-300/70">{error}</p>
        </motion.div>
      )}

      {/* Skills Grid - Optimized with will-change */}
      {!loading && !error && (
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-[84%] relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          style={{ willChange: 'transform' }} // Performance hint
        >
          <AnimatePresence mode="popLayout">
            {skills.map((skill, index) => (
              <SkillCard
                key={`${skill}-${index}`}
                skill={skill}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Skills Count & Clear Button */}
      <motion.div
        className="flex items-center justify-between w-full max-w-6xl mt-8 px-4"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }} // Faster animation
        viewport={{ once: false }}
      >
        <p className="text-cyan-300/80 text-sm">
          {skills.length} skill{skills.length !== 1 ? 's' : ''} displayed
        </p>
        
        {/* Clear All button removed per request */}
      </motion.div>

      {/* Empty State */}
      {skills.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center text-cyan-300/60 mt-12 p-8 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 backdrop-blur-sm"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }} // Reduced movement
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl mb-4"
          >
            💫
          </motion.div>
          <p className="text-lg font-medium mb-2">No skills added yet</p>
          <p className="text-cyan-300/70">Start by adding some skills above!</p>
        </motion.div>
      )}
    </section>
  );
};

export default SkillsPage;