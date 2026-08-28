"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Define each sticker's final resting position/rotation/size.
// x/y are in px relative to the hover point, rotate in degrees.
const stickers = [
  { src: "/vincent/1.png", x: -180, y: -120, rotate: -15, size: 90, delay: 0 },
  { src: "/vincent/2.png", x: 140, y: -130, rotate: 10, size: 190, delay: 40 },
  { src: "/vincent/3.png", x: -260, y: 20, rotate: 8, size: 110, delay: 80 },
  { src: "/vincent/4.png", x: 220, y: 85, rotate: -20, size: 80, delay: 20 },
  { src: "/vincent/5.png", x: 0, y: -220, rotate: 5, size: 100, delay: 100 },
  { src: "/vincent/6.png", x: -100, y: 100, rotate: -8, size: 115, delay: 60 },
  { src: "/vincent/7.jpg", x: 250, y: -30, rotate: 18, size: 65, delay: 140 },
  { src: "/vincent/8.png", x: -190, y: 120, rotate: -10, size: 105, delay: 120 },
  { src: "/vincent/9.png", x: 180, y: 180, rotate: 5, size: 140, delay: 80 },
];

export default function Home() {
  const [photoHover, setPhotoHover] = useState(false);
  const [designHover, setDesignHover] = useState(false);
  const [showBio, setShowBio] = useState(false)
  const [showSocials, setShowSocials] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [hover, setHover] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnchor({ x: rect.left - 40 + rect.width / 2, y: rect.top - 46 + rect.height / 2 });
    setHover(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full h-[38vh] md:h-auto md:w-[56%] bg-background flex flex-col justify-between p-4">
        <img
          src="/design/NM/1a.png"
          alt="Hero"
          className="w-[58%] h-full object-cover absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ 
            opacity: designHover ? 1 : 0
          }}
        />

        <div 
          onClick={() => setShowSocials(!showSocials)}
          className="text-sm bottom-4 h-[63.5%] md:h-auto md:bottom-auto md:top-[55%] absolute cursor-pointer font-light tracking-widest text-gray-700">
          LORE SCHWARTZ
        </div>



        <div 
          className={`
          ${showSocials && !designHover ? 'opacity-100' : 'opacity-0'}
          text-xs md:max-w-[18%] xl:max-w-[10%] top-4 md:top-[20%] text-right absolute left-[30%] mr-4 md:left-[20%] xl:left-[16%] font-light tracking-widest text-light transition-opacity duration-500 ease-in-out
        `}>
          <img src="/me.png" alt="headshot" className="w-full h-full object-cover hidden md:block" />
        </div>

        <div className={`
          ${showBio && !designHover || isMobile ? 'opacity-100' : 'opacity-0'}
          text-xs max-w-[70%] md:max-w-[18%] xl:max-w-[10%] top-4 md:top-[55%] text-right absolute left-[30%] mr-4 md:left-[20%] xl:left-[16%] font-light tracking-widest text-light transition-opacity duration-500 ease-in-out
        `}>
          <h1>
            I AM A DESIGNER, FILMMAKER AND  SOFTWARE ENGINEER BASED IN MONTREAL, QC. 
            I AM ON THE EDITORIAL BOARD OF NARROW MARGIN (THE QUARTERLY CINEMA MAGAZINE) AND MY BEST FRIEND IS <span className="text-accent" onMouseEnter={handleEnter}
          onMouseLeave={() => setHover(false)}>VINCENT PRICE</span> (THE OATMEAL COLOURED TABBBY CAT)
          </h1>
          <button 
            onClick={() => setShowContact(true)}
            className="mt-4 cursor-pointer hover:underline"
          >
            CONTACT
          </button>
        </div>

        {/* Overlay — fixed to viewport so stickers can cover the whole page */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
        {stickers.map((s, i) => (
          <img
            key={i}
            src={s.src}
            alt=""
            className="absolute transition-all ease-out"
            style={{
              left: anchor.x,
              top: anchor.y,
              width: s.size,
              height: "auto",
              transitionDuration: hover ? "550ms" : "350ms",
              transitionDelay: `${hover ? s.delay : 0}ms`,
              transform: hover
                ? `translate(${s.x - s.size / 2}px, ${s.y - s.size / 2}px) rotate(${s.rotate}deg) scale(1)` 
                : `translate(0px, 0px) rotate(0deg) scale(0)`,
              opacity: hover ? 1 : 0,
            }}
          />
        ))}
      </div>

        <div 
          className="absolute cursor-pointer h-4 xl:h-5 w-4 xl:w-5 bg-dark top-4 left-4 md:top-[91%] md:left-[35.5%] xl:left-[24.5%]"
          onClick={() => setShowBio(!showBio)}
        >
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full flex-1 md:flex-none md:w-[44%] bg-background relative overflow-hidden">
        <img
          src="/photography/tradewinds/1.jpg"
          alt="Hero"
          className="w-full h-full object-[55%] object-cover absolute inset-0 transition-[filter,opacity] duration-[750ms] ease-in-out"
          style={{ 
            filter: photoHover ? "grayscale(0%)" : "grayscale(100%)",
            opacity: designHover ? 0 : 1
          }}
        />

        {/* Navigation Links */}
        <div className="fixed top-[35.5%] right-4 flex flex-col items-end gap-2 z-10 md:absolute md:top-[55%] md:left-4 md:right-auto md:flex-row md:items-stretch md:gap-8">
          <Link
            href="/design"
            onMouseEnter={() => !isMobile && setDesignHover(true)}
            onMouseLeave={() => !isMobile && setDesignHover(false)}
            style={{
              opacity: photoHover ? 0 : 1,
              pointerEvents: photoHover ? "none" : "auto",
            }}
            className="text-dark sm:text-white text-sm font-light tracking-widest hover:text-gray-700 hover:underline transition-opacity duration-500 ease-in-out"
          >
            DESIGN
          </Link>
          <Link
            href="/photography"
            onMouseEnter={() => setPhotoHover(true)}
            onMouseLeave={() => setPhotoHover(false)}
            style={{
              opacity: designHover ? 0 : 1,
              pointerEvents: designHover ? "none" : "auto",
            }}
            className="text-white text-sm font-light tracking-widest hover:opacity-80 hover:underline transition-opacity duration-500 ease-in-out"
          >
            PHOTOGRAPHY
          </Link>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] sm:h-[60%] bg-white z-[100] flex items-center max-w-3xl my-auto justify-center p-8"
        >
          <div 
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-8 right-8 text-2xl font-light text-dark hover:opacity-50"
            >
              ✕
            </button>

            <form
              className="flex flex-col gap-6"
              action="https://formspree.io/f/mgvakkna"
              method="POST"
            >
              <input type="hidden" name="_subject" value="New submission!" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              
              <textarea 
                name="Message" 
                required 
                autoFocus
                placeholder=""
                className="w-full border-b border-dark bg-transparent text-dark placeholder-gray-400 focus:outline-none focus:border-dark py-2 font-light text-2xl"
                rows={6}
              />
              
              <input 
                type="text" 
                name="Name" 
                placeholder="Name" 
                required 
                className="w-full border-b border-dark bg-transparent text-dark placeholder-gray-400 focus:outline-none focus:border-dark py-2 font-light text-lg"
              />
              
              <input 
                type="email" 
                name="Email" 
                placeholder="Email" 
                required 
                className="w-full border-b border-dark bg-transparent text-dark placeholder-gray-400 focus:outline-none focus:border-dark py-2 font-light text-lg"
              />
              
              <button 
                type="submit"
                className="mt-4 text-black font-bold tracking-wide hover:opacity-70 transition-colors"
              >
                SEND
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
