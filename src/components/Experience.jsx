"use client";
import React, { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaStar } from "react-icons/fa";

const experiences = [
  {
    id: 1,
    title: "Senior Full-Stack Developer",
    company: "Tech Solutions Inc.",
    location: "San Francisco, CA (Remote)",
    period: "Jan 2022 - Present",
    description: [
      "Led the development of a scalable e-commerce platform using Next.js, Node.js, and MongoDB.",
      "Implemented robust RESTful APIs and real-time data synchronization with WebSockets.",
      "Mentored junior developers and conducted code reviews to ensure high code quality.",
    ],
    techStack: ["Next.js", "React", "Node.js", "Express", "MongoDB", "TypeScript", "AWS", "Docker"],
  },
  {
    id: 2,
    title: "Software Engineer",
    company: "Innovate Labs",
    location: "New York, NY",
    period: "Mar 2019 - Dec 2021",
    description: [
      "Developed and maintained key features for a SaaS product using React and Django.",
      "Optimized backend services, reducing API response times by 20%.",
      "Collaborated with designers to translate wireframes into dynamic UIs.",
    ],
    techStack: ["React", "Redux", "Python", "Django", "PostgreSQL", "JavaScript", "Git"],
  },
  {
    id: 3,
    title: "Junior Developer",
    company: "WebCrafters Studio",
    location: "Austin, TX",
    period: "Jun 2017 - Feb 2019",
    description: [
      "Assisted in front-end development using HTML, CSS, and jQuery.",
      "Participated in agile development sprints and learned Git.",
      "Contributed to basic backend scripts in PHP.",
    ],
    techStack: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "MySQL", "Git"],
  },
  {
    id: 4,
    title: "Frontend Developer Intern",
    company: "Pixel Perfect Agency",
    location: "Los Angeles, CA",
    period: "Jan 2016 - May 2017",
    description: [
      "Created responsive layouts with Bootstrap and modern CSS.",
      "Worked closely with designers to enhance UX/UI elements.",
      "Improved website load performance by optimizing assets.",
    ],
    techStack: ["HTML", "CSS", "Bootstrap", "JavaScript", "GitHub"],
  },
  {
    id: 5,
    title: "Freelance Web Developer",
    company: "Self-Employed",
    location: "Remote",
    period: "Jun 2015 - Dec 2015",
    description: [
      "Built small business websites using WordPress and custom CSS.",
      "Maintained client websites and implemented SEO best practices.",
      "Delivered on-time and within budget while managing multiple clients.",
    ],
    techStack: ["WordPress", "HTML", "CSS", "SEO", "JavaScript"],
  },
];

// Framer Motion Variants - SAME AS BEFORE
const leftVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const rightVariants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const ExperienceCard = ({ experience }) => (
  <div
    className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl bg-gray-800/80 backdrop-blur-sm border border-blue-500/30 text-gray-100
               transform hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-cyan-400/50 transition-all duration-300 cursor-pointer
               group h-full flex flex-col"
  >
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-blue-400 group-hover:text-cyan-300 transition-colors leading-tight">
          {experience.title}
        </h3>
        <p className="flex items-center text-xs sm:text-sm font-semibold text-gray-400 px-2 py-1 sm:px-3 bg-gray-700 rounded-full w-fit shrink-0">
          <FaCalendarAlt size={16} className="mr-1 sm:mr-2 text-blue-500" /> {experience.period}
        </p>
      </div>

      <div className="space-y-2">
        <p className="flex items-center text-sm sm:text-base text-gray-300">
          <FaBuilding className="mr-2 text-cyan-500 flex-shrink-0" /> {experience.company}
        </p>
        <p className="flex items-center text-xs sm:text-sm text-gray-400">
          <FaMapMarkerAlt className="mr-2 text-cyan-500 flex-shrink-0" /> {experience.location}
        </p>
      </div>
    </div>

    <ul className="list-none space-y-2 sm:space-y-3 mb-4 sm:mb-6 flex-grow">
      {experience.description.map((point, index) => (
        <li key={index} className="flex items-start text-xs sm:text-sm leading-relaxed text-gray-300">
          <FaStar className="mr-2 sm:mr-3 mt-0.5 flex-shrink-0 text-yellow-400 text-xs" />
          <span className="flex-1">{point}</span>
        </li>
      ))}
    </ul>

    <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-3 sm:pt-4 border-t border-gray-700/50 mt-auto">
      {experience.techStack.map((tech, index) => (
        <span
          key={index}
          className="px-2 sm:px-3 py-1 bg-cyan-600/20 text-cyan-300 text-xs font-medium rounded-full hover:bg-cyan-600/30 transition-colors shadow-inner"
        >
          {tech}
        </span>
      ))}
    </div>
  </div>
);

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadExperiences = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/experience');
      if (!response.ok) {
        throw new Error('Failed to fetch experiences');
      }
      const data = await response.json().catch(() => null);
      // Normalize different possible API shapes:
      // - { success: true, data: [...] }
      // - [...] (direct array)
      // - { data: [...] }
      let rawList = [];
      if (data) {
        if (data.success && Array.isArray(data.data)) rawList = data.data;
        else if (Array.isArray(data)) rawList = data;
        else if (Array.isArray(data.data)) rawList = data.data;
      }
      // Normalize backend model to UI-friendly shape
      const list = rawList.map((exp) => {
        const start = exp.startDate ? new Date(exp.startDate) : null;
        const end = exp.endDate ? new Date(exp.endDate) : null;
        const format = (d) => d ? d.toLocaleString("en-US", { month: "short", year: "numeric" }) : null;
        const period = start ? `${format(start)} - ${exp.isCurrent ? "Present" : (end ? format(end) : "")}` : "";
        return {
          id: exp._id, // Use _id as id for key
          title: exp.role,
          company: exp.company,
          location: exp.location,
          period,
          description: (exp.description || "").split("\n").filter(Boolean), // Split into array
          techStack: exp.technologies || [],
        };
      });
      setExperiences(list);
      setError(null);
    } catch (err) {
      setError(err.message);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    setError(null);
    loadExperiences();
  };
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, []);

  // Decide how many experiences to show
  const safeExperiences = Array.isArray(experiences) ? experiences : [];
  const visibleExperiences = showAll ? safeExperiences : safeExperiences.slice(0, 3);

  return (
    <section id="experience" className="bg-[#0f172a] text-white py-16 sm:py-20 px-4 overflow-x-hidden sm:px-6 lg:px-8">
      <div className="max-w-4xl lg:max-w-5xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-center mb-12 sm:mb-16 text-transparent 
                     bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
        >
          Professional Evolution 🚀
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <span className="ml-4 text-cyan-300">Loading experiences...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="text-red-400 text-lg mb-4">Failed to load experiences</div>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={retryFetch}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Timeline */}
        {!loading && !error && (
          <div className="relative">
            {/* Timeline line - hidden on mobile, visible on md and up */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-cyan-600/30"></div>

          {visibleExperiences.map((exp, index) => {
            console.log('Rendering experience:', index, exp.id);
            const isLeft = index % 2 === 0;
            const variants = isLeft ? leftVariants : rightVariants;

            return (
              <motion.div
                key={exp.id}
                className={`flex flex-col md:flex-row mb-12 sm:mb-16 last:mb-0 ${isLeft ? "md:justify-start" : "md:justify-end"} w-full relative`}
                variants={variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Timeline dot - positioned to match card side */}
                <div
                  className={`hidden md:flex absolute top-0 w-8 h-8 rounded-full
                             bg-cyan-600 border-4 border-[#0f172a] shadow-xl shadow-cyan-500/50
                             items-center justify-center text-white font-bold z-10`}
                 style={isLeft ? { left: "50%", transform: "translateX(-50%)" } : { right: "50%", transform: "translateX(50%)" }}                >
                  {index + 1}
                </div>

                {/* Mobile timeline dot */}
                <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-cyan-600 border-4 border-[#0f172a] shadow-xl shadow-cyan-500/50 text-white font-bold z-5 mb-4 mx-auto">
                  {index + 1}
                </div>

                <div className={`w-full md:w-5/12 ${isLeft ? "md:pr-8" : "md:pl-6"}`}>
                  <ExperienceCard experience={exp} />
                </div>
              </motion.div>
            );
          })}
          </div>
        )}

        {/* See More / See Less Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                       text-white font-semibold rounded-full shadow-lg 
                       hover:from-blue-600 hover:to-cyan-600 transition-all duration-300
                       text-sm sm:text-base"
          >
            {showAll ? "See Less ▲" : "See More ▼"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Experience;