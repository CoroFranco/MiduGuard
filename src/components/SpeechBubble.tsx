import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

type BubbleStyle = {
  background: string;
  boxShadow: string;
  border: string;
  textColor: string;
  accentColor: string;
  font: string;
  particleColor: string;
};

type StyleVariant = "cyberpunk"; 

interface SpeechBubbleProps {
  phrase?: string;
  style?: StyleVariant; 
}

export const SpeechBubble = ({ phrase = "¡Bienvenido a mi país!", style = "cyberpunk" }: SpeechBubbleProps) => {
  const [displayedPhrase, setDisplayedPhrase] = useState("");
  const bubbleRef = useRef(null);
  
  useEffect(() => {
    setDisplayedPhrase("");
    const animateText = async () => {
      for (let i = 0; i <= phrase.length; i++) {
        setDisplayedPhrase(phrase.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 40));
      }
    };
    
    animateText();

  }, [phrase]);
  
  const bubbleStyles: Record<StyleVariant, BubbleStyle> = {
    cyberpunk: {
      background: "linear-gradient(135deg, rgba(2,0,36,0.85) 0%, rgba(32,18,77,0.9) 50%, rgba(60,9,121,0.85) 100%)",
      boxShadow: "0 0 15px rgba(111, 76, 255, 0.5), 0 0 30px rgba(111, 76, 255, 0.2) inset",
      border: "1px solid rgba(111, 76, 255, 0.7)",
      textColor: "text-cyan-300",
      accentColor: "rgba(0, 255, 255, 0.8)",
      font: "font-mono",
      particleColor: "rgba(111, 76, 255, 0.7)"
    }
  };
  
  const theme = bubbleStyles[style];
  
  const ParticleEffect = () => {
    const particles = Array(15).fill(0).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 3,
      delay: Math.random() * 2,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full z-0"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: theme.particleColor,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: 0.6
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  };

  const Cursor = () => {
    return (
      <motion.span
        className={`inline-block w-1.5 h-4 ml-0.5 ${theme.textColor}`}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ backgroundColor: theme.accentColor }}
      />
    );
  };

  return (
    <div className="absolute top-6 right-6 z-30 2xl:max-w-xs xl:max-w-[200px]" ref={bubbleRef}>
      <motion.div
        className="relative"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute -top-3 left-6 right-6 h-1 rounded-full" 
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)` }} />
        
        <div className="relative rounded-xl overflow-hidden backdrop-blur-sm"
          style={{ 
            background: theme.background,
            boxShadow: theme.boxShadow,
            border: theme.border
          }}>
          
          <ParticleEffect />
          
          <div className="p-4 relative z-10">
            <div className={`${theme.font} ${theme.textColor} text-sm relative z-10`}>
              {displayedPhrase}
              {displayedPhrase.length === phrase.length ? null : <Cursor />}
            </div>
            
            <div className="mt-3 flex gap-1 items-center">
              <motion.div 
                className="h-px flex-grow opacity-80"
                style={{ background: `linear-gradient(90deg, transparent, ${theme.accentColor})` }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div 
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
            </div>
          </div>
          
          <div className="absolute right-0 bottom-0 w-4 h-4 border-r border-b"
            style={{ borderColor: theme.accentColor, opacity: 0.7 }} />
          <div className="absolute left-0 top-0 w-4 h-4 border-l border-t"
            style={{ borderColor: theme.accentColor, opacity: 0.7 }} />
        </div>
        
        <div className="relative">
          <div 
            className="absolute -bottom-5 left-8 w-6 h-6 transform rotate-45"
            style={{ 
              background: theme.background,
              borderRight: theme.border,
              borderBottom: theme.border
            }}
          />
          <motion.div
            className="absolute -bottom-3 left-4 w-14 h-1 rounded-full opacity-40"
            style={{ background: theme.accentColor }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
};
