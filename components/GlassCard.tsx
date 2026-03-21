
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', delay = 0 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  
  // Emergence from depth on scroll
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y, scale, opacity }}
      className={`perspective-card w-full ${className}`}
    >
      <motion.div
        whileHover={{ 
          rotateX: 2, 
          rotateY: -2, 
          scale: 1.02,
          transition: { duration: 0.4, ease: "easeOut" } 
        }}
        className="glass rounded-[3rem] p-8 md:p-14 soft-border shadow-xl relative overflow-hidden group shine-container perspective-content"
      >
        {/* Animated Background Lueur */}
        <div className="absolute inset-0 bg-gradient-to-br from-nova-violet/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        
        {/* Deep Shadow on Hover */}
        <div className="absolute inset-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Sensory Border */}
        <div className="absolute inset-0 border border-nova-violet/0 group-hover:border-nova-violet/20 rounded-[3rem] transition-all duration-700 pointer-events-none" />

        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GlassCard;