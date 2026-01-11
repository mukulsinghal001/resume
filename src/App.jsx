import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Analytics } from '@vercel/analytics/react';
import {
  ArrowUpRight, Mail, Linkedin, Cpu, Database,
  Layers, BarChart, Zap, ChevronRight, Menu, X,
  Terminal, Activity, Radio, Cog, Power, Eye, GraduationCap, Award, Github, Phone
} from 'lucide-react';

/**
 * THE SUPREME NOTHING OS DIGITAL TWIN: Mukul Singhal
 * Features: 3D Evolving Core, Continuous Loop Decryption, Interactive Experience Expansion.
 */

// --- 3D GENERATIVE NEURAL NETWORK (Responsive Three.js) ---
const EvolvingDataCore = ({ scrollProgress }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const isMobile = window.innerWidth < 768;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (mountRef.current) mountRef.current.appendChild(renderer.domElement);

    const nodeCount = isMobile ? 100 : 200;
    const connectionDistance = isMobile ? 2.5 : 3;
    const nodes = new Float32Array(nodeCount * 3);
    const nodeVelocities = new Float32Array(nodeCount * 3);
    
    // Create nodes
    for (let i = 0; i < nodeCount * 3; i++) {
      nodes[i] = (Math.random() - 0.5) * (isMobile ? 10 : 15);
      nodeVelocities[i] = (Math.random() - 0.5) * 0.002;
    }
    const nodesGeometry = new THREE.BufferGeometry();
    nodesGeometry.setAttribute('position', new THREE.BufferAttribute(nodes, 3));
    const nodesMaterial = new THREE.PointsMaterial({
      color: 0xff4141,
      size: 0.08,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    const nodePoints = new THREE.Points(nodesGeometry, nodesMaterial);
    scene.add(nodePoints);

    // Highlight node
    const highlightGeo = new THREE.BufferGeometry();
    highlightGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,0,1000]), 3));
    const highlightMat = new THREE.PointsMaterial({
        color: 0xff4141,
        size: 0.25,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
    });
    const highlightNode = new THREE.Points(highlightGeo, highlightMat);
    scene.add(highlightNode);

    const linesGeometry = new THREE.BufferGeometry();
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 1,
      transparent: true,
      opacity: 0.05
    });
    const networkLines = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(networkLines);
    
    camera.position.z = isMobile ? 12 : 10;
    
    let mouseX = 0, mouseY = 0;
    const pulses = [];
    const createPulse = (position) => {};
    
    const handleMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) / 100;
      mouseY = (e.clientY - window.innerHeight / 2) / 100;

      // Update normalized mouse coordinates
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    };
    if (!isMobile) window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      const currentScroll = scrollProgress.get();
      const pos = nodesGeometry.attributes.position.array;
      
      // Animate nodes
      for(let i=0; i<nodeCount * 3; i++) {
          pos[i] += nodeVelocities[i];
          if(pos[i] > 8 || pos[i] < -8) nodeVelocities[i] *= -1;
      }

      // Recreate connections
      const linePositions = [];
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const i3 = i * 3;
          const j3 = j * 3;
          const dx = pos[i3] - pos[j3];
          const dy = pos[i3+1] - pos[j3+1];
          const dz = pos[i3+2] - pos[j3+2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if(dist < connectionDistance) {
            linePositions.push(pos[i3], pos[i3+1], pos[i3+2]);
            linePositions.push(pos[j3], pos[j3+1], pos[j3+2]);
          }
        }
      }
      linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      linesGeometry.attributes.position.needsUpdate = true;
      nodesGeometry.attributes.position.needsUpdate = true;


      // Raycasting for hover
      if(!isMobile){
          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObject(nodePoints);
          if (intersects.length > 0) {
              const { index } = intersects[0];
              const p = nodesGeometry.attributes.position;
              const positionVec = new THREE.Vector3(p.getX(index), p.getY(index), p.getZ(index));
              highlightNode.geometry.attributes.position.setXYZ(0, positionVec.x, positionVec.y, positionVec.z);
              highlightNode.geometry.attributes.position.needsUpdate = true;
              
              const lastPulse = pulses[pulses.length - 1];
              if (!lastPulse || (Date.now() - lastPulse.startTime > 300)) {
                createPulse(positionVec);
              }

          } else {
            highlightNode.geometry.attributes.position.setXYZ(0, 0, 0, 1000);
            highlightNode.geometry.attributes.position.needsUpdate = true;
          }
      }

      // Pulse effect
      const pulseSpeed = 0.0001 + (currentScroll * 0.002);
      linesMaterial.opacity = 0.05 + (Math.sin(Date.now() * pulseSpeed) * 0.05);
      nodesMaterial.opacity = 0.8 + (Math.sin(Date.now() * pulseSpeed * 2) * 0.2);

      nodePoints.rotation.y += 0.0002;
      networkLines.rotation.y += 0.0002;

      if (!isMobile) {
        camera.position.x += (mouseX - camera.position.x) * 0.1;
        camera.position.y += (-mouseY - camera.position.y) * 0.1;
      }
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
    };
  }, [scrollProgress]);

  return <div ref={mountRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />;
};

// --- HOLOGRAPHIC PANEL ---
const TiltCard = ({ children, className = "", ...props }) => {
  const cardRef = useRef(null);
  const [isTouch, setIsTouch] = useState(false);
  
  const x = useSpring(0, { stiffness: 150, damping: 30 });
  const y = useSpring(0, { stiffness: 150, damping: 30 });

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouse = (e) => {
    if (isTouch) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientY - centerY) / 40);
    y.set((centerX - e.clientX) / 40);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      {...props}
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: x,
        rotateY: y,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className={`relative rounded-2xl overflow-hidden ${className}`}
    >
      {/* Main content with 3D transform */}
      <motion.div
        style={{
          transform: "translateZ(30px)",
          transformStyle: "preserve-3d",
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Scan Line Effect */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1.5 opacity-0 group-hover:opacity-100"
        style={{
            background: "radial-gradient(ellipse at center, rgba(255,65,65,0.4) 0%, rgba(255,65,65,0) 80%)",
        }}
        initial={{ y: "-10%" }}
        animate={{ y: "100%" }}
        transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: Math.random() * 1.5,
        }}
      />
      
      {/* Background Grid */}
      <div 
        style={{
          transform: "translateZ(-10px)",
        }}
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:34px_34px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
        aria-hidden="true"
      />
    </motion.div>
  );
};

// --- CONTINUOUS DECRYPTION ENGINE ---
const DecryptText = ({ text, active = true, speed = 40, loop = false }) => {
  const [display, setDisplay] = useState('');
  const glyphs = "01XYWZ<>[]_-+";

  useEffect(() => {
    if (!active) return;
    let iteration = 0;
    let interval;

    const startAnimation = () => {
      iteration = 0;
      interval = setInterval(() => {
        setDisplay(text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        }).join(""));

        if (iteration >= text.length) {
          clearInterval(interval);
          if (loop) setTimeout(startAnimation, 4000);
        }
        iteration += 1 / 3;
      }, speed);
    };

    startAnimation();
    return () => clearInterval(interval);
  }, [text, active, speed, loop]);

  return <span className="font-dot">{display || text}</span>;
};

// --- APP COMPONENT ---
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const aberration = useTransform(smoothScroll, [0, 0.5, 1], ["0px", "4px", "0px"]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const experiences = [
    {
      company: "MiQ Digital",
      role: "Associate Manager - Data & Analytics",
      period: "10/2024 — PRESENT",
      desc: "Leading a team of 8 analysts, driving revenue optimization, and developing AI-powered analytics platforms.",
      details: ["22% Spend Increase", "35% Time Reduction", "20% Cost Reduction"],
      fullHistory: [
        "Revenue Optimization: Identified declining investment trends and designed custom strategies, driving a 22% increase in spend across a $40M+ portfolio.",
        "Generative AI & Automation Leadership: Led development of a multi-agent analytics platform, reducing turnaround time by 35%.",
        "Strategic Leadership: Managed and mentored a team of 8 analysts, overseeing 50+ client insights and QBRs.",
        "Client Retention & Stakeholder Management: Owned senior stakeholder relationships, contributing to a 15% increase in client retention.",
        "Data Governance & Cloud ROI: Led initiatives to redesign pipelines, resulting in a 20% reduction in cloud expenses.",
        "Technical Consulting: Acted as a technical consultant for advanced analytics, advising on model selection and measurement frameworks."
      ]
    },
    {
      company: "MiQ Digital",
      role: "Lead Analyst",
      period: "11/2022 — 10/2024",
      desc: "Improved operational efficiency, led omnichannel measurement, and contributed to significant revenue pipeline growth.",
      details: ["48% Task Reduction", "11% Viewership Lift", "$12.7M Pipeline"],
      fullHistory: [
        "Operational Efficiency: Designed standardized data analysis frameworks, reducing manual tasks by 48% and improving productivity by 20%.",
        "Omnichannel Measurement: Led cross-screen measurement using Samba TV data, improving incremental TV viewership by 11%.",
        "Advanced Modeling: Spearheaded initiatives like CLV modeling and Competitor Density Analysis.",
        "Revenue Impact: Shaped analytics narratives that contributed to a potential revenue pipeline of $12.7M."
      ]
    },
    {
      company: "Merkle (A Dentsu Owned Company)",
      role: "Senior Analyst",
      period: "04/2021 — 11/2022",
      desc: "Directed digital analytics for global clients, building automated ETL pipelines and optimizing dashboard performance.",
      details: ["12+ Global Clients", "4hrs to Minutes", "38% Perf. Boost"],
      fullHistory: [
        "End-to-End ETL: Directed digital analytics for 12+ global clients, designing scalable ETL pipelines.",
        "Automation & Monitoring: Reduced manual oversight from 4 hours daily to minutes by automating pipeline monitoring with Slack-integrated Webhooks.",
        "Performance Optimization: Improved dashboard load times and query performance by 38% through advanced data aggregation."
      ]
    },
    {
      company: "Healthkart",
      role: "SEO Analyst",
      period: "09/2019 — 09/2020",
      desc: "Drove significant organic traffic growth and improved user experience through technical SEO.",
      details: ["30% Traffic Growth", "99% SERP Rank", "28% Bounce Reduction"],
      fullHistory: [
        "Growth Analytics: Executed keyword strategies resulting in a 30% increase in organic traffic and top 3 SERP rankings for 99% of branded keywords.",
        "User Experience: Decreased bounce rate by 28% through technical SEO enhancements and site-speed optimization."
      ]
    },
    {
      company: "Consultmate",
      role: "Digital Marketing Executive",
      period: "05/2018 — 09/2019",
      desc: "Managed successful PPC campaigns and boosted organic reach for multiple clients.",
      details: ["10+ Clients", "14% Relevance Score", "50+ Social Posts"],
      fullHistory: [
        "Campaign Management: Managed high-performance PPC campaigns on Google Ads and Meta for 10+ clients, optimizing ad targeting to improve ROI.",
        "Performance Optimization: Enhanced ad relevance scores by 14% through effective keyword research and landing page optimization.",
        "Organic Growth: Conducted keyword gap analysis and created 50+ social media posts, boosting organic reach and audience interaction."
      ]
    }
  ];

  const skillMatrix = [
    { icon: Cpu, label: "AI_INNOVATION", items: ["Gemini CLI", "Multi-Agent Systems", "Prompt Engineering"] },
    { icon: Database, label: "DATA_ENGINEERING", items: ["Python", "SQL / HiveQL", "PySpark / AWS"] },
    { icon: BarChart, label: "VISUAL_BI", items: ["Tableau", "Power BI", "Looker Studio"] },
    { icon: Zap, label: "ADTECH_STACK", items: ["DV360 / TTD", "Xandr / Beeswax", "GA4 / Ads Data Hub"] },
    { icon: Layers, label: "ADV_ANALYTICS", items: ["MMM Modeling", "CLV Prediction", "Geospatial Analysis"] }
  ];

  return (
    <div className="bg-black min-h-screen text-white font-mono selection:bg-red-600 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loader" exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-12">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 md:w-28 md:h-28 border border-red-600/30 border-dashed rounded-full flex items-center justify-center"
              />
              <div className="absolute inset-0 flex items-center justify-center font-dot text-red-600 text-xl md:text-2xl">M</div>
            </div>
            <div className="max-w-[200px] w-full">
              <div className="h-[1px] w-full bg-white/10 relative overflow-hidden">
                <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ duration: 2.5 }} className="absolute inset-0 bg-red-600 shadow-[0_0_10px_#ff3131]" />
              </div>
              <div className="mt-4 font-mono text-[7px] md:text-[9px] tracking-[0.4em] uppercase text-white/30">
                <DecryptText text="Kernel_Init_Sequence" speed={60} />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
            style={{ filter: `drop-shadow(${aberration} 0px 0px rgba(255,0,0,0.3))` }}
          >
            <EvolvingDataCore scrollProgress={smoothScroll} />
            <div className="noise-filter" />
            <div className="fixed inset-0 dot-overlay pointer-events-none z-1" />

            <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6 md:px-10 md:py-8 flex justify-between items-center border-b border-white/5 bg-black/60 backdrop-blur-xl">
              <div className="flex items-center space-x-4 md:space-x-6">
                <motion.div whileTap={{ scale: 0.9 }} className="w-8 h-8 md:w-10 md:h-10 border border-red-600 flex items-center justify-center font-dot text-red-600 text-xs bg-black">M</motion.div>
                <span className="text-lg md:text-xl font-dot tracking-widest uppercase truncate max-w-[150px] md:max-w-none">
                  <DecryptText text="Mukul Singhal" loop speed={80} />
                </span>
              </div>
              <div className="hidden lg:flex items-center space-x-8 font-mono text-[10px] text-white/40">
                <a href="https://github.com/mukulsinghal001" target="_blank" rel="noreferrer" className="hover:text-red-600 transition-colors uppercase tracking-[0.4em]">GitHub_Sync</a>
                <a href="mailto:gmukul25@gmail.com" className="bg-white text-black px-6 py-2 rounded-full font-dot uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Contact</a>
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-red-600">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                  className="fixed inset-0 z-[90] bg-black p-10 pt-32 lg:hidden flex flex-col space-y-8"
                >
                  <a href="#history" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-dot uppercase text-white">History</a>
                  <a href="#modules" onClick={() => setMobileMenuOpen(false)} className="text-4xl font-dot uppercase text-white">Modules</a>
                  <a href="https://github.com/mukulsinghal001" target="_blank" rel="noreferrer" className="text-4xl font-dot uppercase text-white">GitHub</a>
                  <button className="bg-red-600 text-white py-4 rounded-full font-dot text-sm uppercase tracking-widest">Connect</button>
                </motion.div>
              )}
            </AnimatePresence>

            <main className="relative z-10">
              {/* HERO & SUMMARY */}
              <section className="min-h-screen flex flex-col justify-center px-6 md:px-20 lg:px-40 pt-20">
                <div className="flex items-center space-x-4 mb-8 md:mb-12">
                  <Activity size={14} className="text-red-600 animate-pulse" />
                  <span className="text-[10px] md:text-[12px] font-mono uppercase tracking-[0.8em] text-white/20">Analytics_v.08_Active</span>
                </div>
                <h1 className="text-[18vw] sm:text-[15vw] md:text-[13vw] font-dot uppercase tracking-tighter leading-[0.85] mb-8 md:mb-12">
                  MUKUL <br />
                  <span className="text-red-600 italic glitch-active">SINGHAL</span>
                </h1>
                <div className="grid grid-cols-12 gap-6 mt-12 md:mt-20">
                  <div className="col-span-12 lg:col-span-9">
                    <p className="text-xl md:text-3xl lg:text-5xl font-mono font-bold uppercase leading-[1.2] mb-12 tracking-tight">
                      AI-ENABLED <span className="text-red-600">ANALYTICS MANAGER</span> <br />
                      PIONEERING MULTI-AGENT <br />
                      COGNITIVE WORKFLOWS.
                    </p>
                    <div className="max-w-2xl text-[10px] md:text-sm text-white/40 uppercase font-bold tracking-[0.2em] leading-relaxed mb-12 border-l-2 border-white/10 pl-6 flex flex-col gap-4">
                      <span>7 years specializing in digital analytics, programmatic DSP, and cross-channel measurement.</span>
                      <div className="flex items-center space-x-4 text-white/60">
                        <Phone size={14} className="text-red-600" />
                        <span>+91 6395313338</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* EXPERIENCE */}
              <section id="history" className="py-32 md:py-60 px-6 md:px-20 lg:px-40 border-t border-white/10 bg-black/60">
                <div className="mb-16 md:mb-32">
                  <span className="text-red-600 font-dot text-[10px] mb-2 block tracking-widest uppercase">[01] CHRONICLE</span>
                  <h2 className="text-5xl md:text-8xl lg:text-9xl font-dot uppercase text-white">
                    Experience
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:gap-12">
                  {experiences.map((exp, i) => (
                    <TiltCard key={i} className="group">
                      <div className="p-8 md:p-12 lg:p-16 flex flex-col xl:flex-row justify-between items-start xl:items-start transition-all duration-700 relative">
                        <div className="relative z-10 w-full xl:w-1/3">
                          <span className="text-red-600 font-mono text-[9px] md:text-[11px] mb-4 block tracking-[0.5em] uppercase italic">{exp.period}</span>
                          <h3 className="text-3xl md:text-5xl lg:text-6xl font-dot uppercase text-white mb-2 group-hover:text-red-600 transition-colors">{exp.company}</h3>
                          <p className="text-lg md:text-xl font-mono font-bold uppercase text-white/30 mb-8">{exp.role}</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.details.map((tag, j) => (
                              <span key={j} className="text-[8px] font-mono border border-white/10 px-3 py-1 rounded-sm text-white/40 uppercase tracking-widest bg-black/20">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="w-full xl:w-2/3 mt-12 xl:mt-0 xl:pl-12 relative z-10">
                          <motion.p className="text-sm md:text-base uppercase tracking-[0.1em] text-white/50 mb-8 leading-relaxed font-bold group-hover:text-white transition-colors uppercase">
                            {exp.desc}
                          </motion.p>
                          <div className="mt-8 space-y-6 overflow-hidden max-h-0 group-hover:max-h-[1000px] transition-all duration-1000 ease-in-out">
                            <div className="h-px w-full bg-white/10 mb-8" />
                            {exp.fullHistory.map((point, j) => (
                              <motion.div key={j} className="flex items-start space-x-6 text-xs md:text-sm text-white/40 group-hover:text-white/80">
                                <div className="mt-1.5 w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                                <p className="font-mono uppercase tracking-wider leading-relaxed">{point}</p>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-8 flex items-center space-x-3 text-[9px] font-dot text-red-600 group-hover:opacity-0 transition-opacity">
                            <Eye size={12} className="animate-pulse" />
                            <span>DECRYPT_LOGS_ON_HOVER</span>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </section>

              {/* SKILLS MATRIX */}
              <section id="modules" className="py-32 md:py-60 px-6 md:px-20 lg:px-40 border-t border-white/10 bg-white/[0.01]">
                <div className="mb-16 md:mb-32">
                  <span className="text-red-600 font-dot text-[10px] mb-2 block tracking-widest uppercase">[02] MODULES</span>
                  <h2 className="text-5xl md:text-8xl lg:text-9xl font-dot uppercase text-white">
                    Technical
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {skillMatrix.map((skill, i) => (
                    <TiltCard 
                      key={i}
                      className="group"
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(255, 65, 65, 0)",
                          "0 0 25px rgba(255, 65, 65, 0.3)",
                          "0 0 0px rgba(255, 65, 65, 0)",
                        ]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: Math.random() * 4,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="p-8 md:p-10 h-full">
                        <skill.icon size={28} className="text-red-600 mb-8 group-hover:scale-110 transition-transform" />
                        <h4 className="text-[10px] md:text-xs font-dot uppercase tracking-[0.4em] mb-8 text-white/70 group-hover:text-white">{skill.label}</h4>
                        <ul className="space-y-4">
                          {skill.items.map((item, j) => (
                            <li key={j} className="text-[11px] md:text-[13px] font-mono text-white/60 flex items-center space-x-3 group-hover:text-white transition-colors">
                              <span className="w-1 h-1 bg-red-600 rounded-full" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </section>

              {/* EDUCATION & AWARDS */}
              <section id="archives" className="py-32 md:py-60 px-6 md:px-20 lg:px-40 border-t border-white/10 bg-black">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
                  {/* Archives */}
                  <div>
                    <div className="flex items-center space-x-4 mb-16">
                      <GraduationCap className="text-red-600" size={24} />
                      <h2 className="text-4xl font-dot uppercase text-white">Archives</h2>
                    </div>
                    <div className="space-y-8">
                      {[
                        { institution: "Amity University", degree: "PGD in Data Science", period: "01/2020 — 03/2021", logType: "ACADEMIC_RECORD" },
                        { institution: "HNB Garhwal University", degree: "Bachelors in Commerce", period: "03/2015 — 04/2018", logType: "ACADEMIC_RECORD" }
                      ].map((edu, i) => (
                        <TiltCard key={i} className="group">
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className="text-red-600 text-xs font-mono uppercase tracking-widest">{edu.period}</span>
                                <h3 className="text-xl font-dot uppercase text-white mt-1">{edu.institution}</h3>
                              </div>
                              <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest pt-1">{edu.logType}</span>
                            </div>
                            <p className="text-base text-white/60 font-mono font-bold uppercase tracking-wider">{edu.degree}</p>
                          </div>
                        </TiltCard>
                      ))}
                    </div>
                  </div>
                  {/* Recognition */}
                  <div>
                    <div className="flex items-center space-x-4 mb-16">
                      <Award className="text-red-600" size={24} />
                      <h2 className="text-4xl font-dot uppercase text-white">Recognition</h2>
                    </div>
                    <div className="space-y-8">
                      {["MiQ Impact Award (2024)", "3× Individual Award (Merkle)", "MiQ Best Team Award (2023)"].map((award, idx) => (
                        <TiltCard key={idx} className="group">
                          <div className="p-6 flex justify-between items-center">
                            <span className="text-base font-dot uppercase text-white">{award}</span>
                            <div className="flex items-center space-x-4">
                              <Award className="text-red-600" size={20} />
                            </div>
                          </div>
                        </TiltCard>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* FOOTER */}
              <footer className="py-24 px-6 md:px-20 lg:px-40 border-t border-white/10 bg-black/80 backdrop-blur-md relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
                    {/* Column 1: Title & Status */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-4 mb-4">
                            <motion.div whileTap={{ scale: 0.9 }} className="w-10 h-10 border border-red-600 flex items-center justify-center font-dot text-red-600 text-xs bg-black">M</motion.div>
                            <h2 className="text-2xl font-dot uppercase tracking-widest">
                                SYSTEM_CTL
                            </h2>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-red-600">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                            <span>ALL_SYSTEMS_NOMINAL</span>
                        </div>
                    </div>

                    {/* Column 2: Links */}
                    <div className="lg:col-span-1 flex justify-center items-center space-x-8 font-mono">
                        <a href="https://linkedin.com/in/imukulsinghal/" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-sm uppercase tracking-widest group">
                            <Linkedin className="text-white/40 group-hover:text-red-600 transition-colors" size={16} />
                            <span className="text-white/40 group-hover:text-white transition-colors">LINKEDIN</span>
                        </a>
                        <a href="https://github.com/mukulsinghal001" target="_blank" rel="noreferrer" className="flex items-center space-x-3 text-sm uppercase tracking-widest group">
                            <Github className="text-white/40 group-hover:text-red-600 transition-colors" size={16} />
                            <span className="text-white/40 group-hover:text-white transition-colors">GITHUB</span>
                        </a>
                    </div>

                    {/* Column 3: Contact & Copyright */}
                    <div className="lg:col-span-1 flex flex-col items-start lg:items-end">
                        <motion.a href="mailto:gmukul25@gmail.com" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className="w-full lg:w-auto bg-red-600 text-white px-8 py-4 rounded-full text-lg font-dot uppercase transition-all shadow-lg shadow-red-600/20 mb-6 flex items-center justify-center space-x-4"
                        >
                          <Mail size={20} />
                          <span>Initiate Contact</span>
                        </motion.a>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">
                            <DecryptText text={`©2026 MUKUL SINGHAL`} speed={20} />
                        </p>
                    </div>
                </div>
              </footer>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  );
}
