'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useInView, useAnimation } from 'framer-motion'
import { Menu, X, ChevronRight, Send, ArrowRight } from 'lucide-react'

const AnimatedText = ({ text }) => {
  const letters = Array.from(text)
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  }
  const child = {
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: -20,
      y: 10,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  }

  return (
    (<motion.div
      style={{ overflow: "hidden", display: "flex" }}
      variants={container}
      initial="hidden"
      animate="visible">
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>)
  );
}

const NavLink = ({ href, children }) => {
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

  const variants = {
    initial: { rotateX: 0, fontWeight: 'normal' },
    hover: { rotateX: 180, fontWeight: 'bold' },
    tap: { scale: 0.95, rotate: 5 }
  }

  return (
    (<motion.a
      href={href}
      initial="initial"
      animate={controls}
      variants={variants}
      onHoverStart={() => {
        setIsHovered(true)
        controls.start("hover")
      }}
      onHoverEnd={() => {
        setIsHovered(false)
        controls.start("initial")
      }}
      whileTap="tap"
      style={{ transformStyle: 'preserve-3d' }}>
      <motion.span
        style={{
          display: 'inline-block',
          backfaceVisibility: 'hidden',
          transition: 'opacity 0.3s',
          opacity: isHovered ? 0 : 1
        }}>
        {children}
      </motion.span>
      <motion.span
        style={{
          display: 'inline-block',
          position: 'absolute',
          left: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateX(180deg)',
          transition: 'opacity 0.3s',
          opacity: isHovered ? 1 : 0
        }}>
        {children}
      </motion.span>
    </motion.a>)
  );
}

export function EnhancedPortfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const lastScrollY = useRef(0)
  const scrollDirection = useRef('up')
  const scrollThreshold = 50 // Adjust this value to change when the header hides/shows

  useMotionValueEvent(scrollY, "change", (latest) => {
    const currentScrollY = latest
    setIsScrolled(currentScrollY > 20)

    if (currentScrollY > lastScrollY.current) {
      scrollDirection.current = 'down'
    } else if (currentScrollY < lastScrollY.current) {
      scrollDirection.current = 'up'
    }

    if (Math.abs(currentScrollY - lastScrollY.current) > scrollThreshold) {
      setIsHeaderVisible(scrollDirection.current === 'up')
      lastScrollY.current = currentScrollY
    }
  })

  const servicesRef = useRef(null)
  const isServicesInView = useInView(servicesRef, { once: true, amount: 0.2 })

  const projectsRef = useRef(null)
  const isProjectsInView = useInView(projectsRef, { once: true, amount: 0.2 })

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    (<div className="min-h-screen bg-gray-50 text-gray-900">
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`text-2xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
            DesignPro
          </motion.div>
          <div className="hidden md:flex space-x-4">
            {['Home', 'Services', 'Projects', 'Contact'].map((item) => (
              <NavLink
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`transition-colors ${
                  isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-200'
                }`}>
                {item}
              </NavLink>
            ))}
          </div>
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={isScrolled ? 'text-gray-900' : 'text-white'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}>
              {isMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>
      </motion.header>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-blue-600 z-50 flex items-center justify-center">
            <motion.button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}>
              <X size={32} />
            </motion.button>
            <nav className="flex flex-col items-center space-y-8">
              {['Home', 'Services', 'Projects', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white text-3xl font-bold"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: index * 0.1 
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}>
                  {item}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <main>
        <section
          id="home"
          className="min-h-screen flex items-center bg-gradient-to-br from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="md:w-1/2 text-white">
              <AnimatedText text="Elevate Your Brand with Modern Design" />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl mb-8 mt-4">
                Transforming ideas into visually stunning realities
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                Get Started
              </motion.button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative w-full h-96">
                <motion.img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Design Illustration"
                  className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }} />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="services" ref={servicesRef} className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-12 text-center">
              Our Services
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {['UI/UX Design', 'Brand Identity', 'Web Development'].map((service, index) => (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isServicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">{service}</h3>
                  <p className="text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <motion.a
                    href="#"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    whileHover={{ x: 5 }}>
                    Learn More <ChevronRight className="ml-2 h-4 w-4" />
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" ref={projectsRef} className="py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isProjectsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-12 text-center">
              Featured Projects
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isProjectsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="bg-white rounded-lg overflow-hidden shadow-lg">
                  <motion.img
                    src={`/placeholder.svg?height=300&width=400`}
                    alt={`Project ${item}`}
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }} />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Project {item}</h3>
                    <p className="text-gray-600">
                      A brief description of the project and its impact.
                    </p>
                    <motion.a
                      href="#"
                      className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
                      whileHover={{ x: 5 }}>
                      View Project <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-12 text-center">
              Get in Touch
            </motion.h2>
            <div className="max-w-2xl mx-auto">
              <form>
                <div className="mb-6">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div className="mb-6">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div className="mb-6">
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"></motion.textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Send Message <Send className="ml-2 h-5 w-5" />
                </motion.button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 DesignPro. All rights reserved.</p>
        </div>
      </footer>
    </div>)
  );
}